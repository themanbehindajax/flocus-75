
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, set } from "date-fns";
import { enUS } from 'date-fns/locale';
import { CalendarIcon, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";

interface CalendarEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  editEvent?: CalendarEvent;
}

export const CalendarEventForm = ({ 
  open, 
  onOpenChange,
  selectedDate,
  editEvent
}: CalendarEventFormProps) => {
  const { addCalendarEvent, updateCalendarEvent } = useAppStore();
  
  // Parse times from event if editing
  const getInitialStartTime = () => {
    if (editEvent?.startDate) {
      const date = new Date(editEvent.startDate);
      return format(date, "HH:mm");
    }
    return "09:00";
  };

  const getInitialEndTime = () => {
    if (editEvent?.endDate) {
      const date = new Date(editEvent.endDate);
      return format(date, "HH:mm");
    }
    return "10:00";
  };
  
  // Initialize form state
  const [eventData, setEventData] = useState<{
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    startTime: string;
    endTime: string;
    allDay: boolean;
    repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
    repeatUntil?: Date;
    reminder: number | null;
    color: string;
  }>({
    title: editEvent?.title || "",
    description: editEvent?.description || "",
    startDate: editEvent ? new Date(editEvent.startDate) : selectedDate || new Date(),
    endDate: editEvent?.endDate ? new Date(editEvent.endDate) : undefined,
    startTime: getInitialStartTime(),
    endTime: getInitialEndTime(),
    allDay: editEvent?.allDay || false,
    repeat: editEvent?.repeat || "none",
    repeatUntil: editEvent?.repeatUntil ? new Date(editEvent.repeatUntil) : undefined,
    reminder: editEvent?.reminder || null,
    color: editEvent?.color || "#6366f1"
  });

  // Update form data when editEvent changes
  useEffect(() => {
    if (editEvent) {
      setEventData({
        title: editEvent.title,
        description: editEvent.description || "",
        startDate: new Date(editEvent.startDate),
        endDate: editEvent.endDate ? new Date(editEvent.endDate) : undefined,
        startTime: format(new Date(editEvent.startDate), "HH:mm"),
        endTime: editEvent.endDate ? format(new Date(editEvent.endDate), "HH:mm") : "10:00",
        allDay: editEvent.allDay,
        repeat: editEvent.repeat || "none",
        repeatUntil: editEvent.repeatUntil ? new Date(editEvent.repeatUntil) : undefined,
        reminder: editEvent.reminder || null,
        color: editEvent.color || "#6366f1"
      });
    } else {
      // Reset form when not editing
      setEventData({
        title: "",
        description: "",
        startDate: selectedDate || new Date(),
        endDate: undefined,
        startTime: "09:00",
        endTime: "10:00",
        allDay: false,
        repeat: "none",
        repeatUntil: undefined,
        reminder: null,
        color: "#6366f1"
      });
    }
  }, [editEvent, selectedDate]);

  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [repeatUntilPickerOpen, setRepeatUntilPickerOpen] = useState(false);

  const resetForm = () => {
    setEventData({
      title: "",
      description: "",
      startDate: selectedDate || new Date(),
      endDate: undefined,
      startTime: "09:00",
      endTime: "10:00",
      allDay: false,
      repeat: "none",
      repeatUntil: undefined,
      reminder: null,
      color: "#6366f1"
    });
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setEventData(prev => ({ 
        ...prev, 
        startDate: date,
        // If end date is before new start date, update it
        endDate: prev.endDate && prev.endDate < date ? date : prev.endDate
      }));
      setStartDatePickerOpen(false);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEventData(prev => ({ ...prev, endDate: date }));
    setEndDatePickerOpen(false);
  };

  const handleRepeatUntilSelect = (date: Date | undefined) => {
    setEventData(prev => ({ ...prev, repeatUntil: date }));
    setRepeatUntilPickerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    
    // For repeating events, require a repeat until date
    if (eventData.repeat !== "none" && !eventData.repeatUntil) {
      toast.error("For recurring events, define when the event will stop repeating");
      return;
    }

    // Combine date and time for start and end
    let finalStartDate = new Date(eventData.startDate);
    let finalEndDate = eventData.endDate ? new Date(eventData.endDate) : new Date(eventData.startDate);

    if (!eventData.allDay) {
      // Parse start time
      const [startHours, startMinutes] = eventData.startTime.split(':').map(Number);
      finalStartDate = set(finalStartDate, { 
        hours: startHours, 
        minutes: startMinutes,
        seconds: 0,
        milliseconds: 0 
      });

      // Parse end time
      const [endHours, endMinutes] = eventData.endTime.split(':').map(Number);
      finalEndDate = set(finalEndDate, { 
        hours: endHours, 
        minutes: endMinutes,
        seconds: 0,
        milliseconds: 0
      });

      // Validate that end time is after start time on the same day
      if (finalEndDate < finalStartDate) {
        toast.error("End time must be after start time");
        return;
      }
    } else {
      // For all-day events, set time to midnight
      finalStartDate = set(finalStartDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      finalEndDate = set(finalEndDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });
    }

    const newEventData = {
      title: eventData.title.trim(),
      description: eventData.description.trim() || undefined,
      startDate: finalStartDate.toISOString(),
      endDate: finalEndDate.toISOString(),
      allDay: eventData.allDay,
      repeat: eventData.repeat,
      repeatUntil: eventData.repeatUntil?.toISOString(),
      reminder: eventData.reminder || undefined,
      color: eventData.color
    };
    
    if (editEvent) {
      updateCalendarEvent({
        ...editEvent,
        ...newEventData
      });
      toast.success("Event updated successfully!");
    } else {
      addCalendarEvent(newEventData);
      toast.success("Event created successfully!");
    }
    
    resetForm();
    onOpenChange(false);
  };

  // Format date for display with São Paulo timezone
  const formatLocalDate = (date: Date) => {
    return formatInTimeZone(date, 'America/Sao_Paulo', 'PPP', { locale: enUS });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              Add event details to your calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Event description (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="all-day">All Day</Label>
                <Switch
                  id="all-day"
                  checked={eventData.allDay}
                  onCheckedChange={(checked) => setEventData({ ...eventData, allDay: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatLocalDate(eventData.startDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                      locale={enUS}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.endDate ? formatLocalDate(eventData.endDate) : "Not set"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.endDate}
                      onSelect={handleEndDateSelect}
                      fromDate={eventData.startDate}
                      initialFocus
                      locale={enUS}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!eventData.allDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="repeat">Repeat</Label>
              <Select
                value={eventData.repeat}
                onValueChange={(value: any) => setEventData({ ...eventData, repeat: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Don't repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don't repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventData.repeat !== "none" && (
              <div className="grid gap-2">
                <Label htmlFor="repeat-until">Repeat Until</Label>
                <Popover open={repeatUntilPickerOpen} onOpenChange={setRepeatUntilPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.repeatUntil ? formatLocalDate(eventData.repeatUntil) : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.repeatUntil}
                      onSelect={handleRepeatUntilSelect}
                      fromDate={eventData.startDate}
                      initialFocus
                      locale={enUS}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Select
                value={eventData.reminder?.toString() || "null"}
                onValueChange={(value) => setEventData({ ...eventData, reminder: value === "null" ? null : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No reminder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">No reminder</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                {["#6366f1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      eventData.color === color ? "ring-2 ring-offset-2 ring-offset-background ring-primary" : ""
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEventData({ ...eventData, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editEvent ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
