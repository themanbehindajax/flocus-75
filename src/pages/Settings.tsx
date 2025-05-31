
import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { AppSettings } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";

const Settings = () => {
  const { settings, updateSettings, profile, updateProfile } = useAppStore();
  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  useEffect(() => {
    setAvatarUrl(profile.avatar);
  }, [profile.avatar]);

  const handleSaveSettings = () => {
    updateSettings(formSettings);
    
    const profileUpdates = {} as any;
    
    if (name !== profile.name) {
      profileUpdates.name = name;
      // Save username to localStorage for persistence
      localStorage.setItem("username", name);
    }
    
    if (avatarUrl !== profile.avatar) {
      profileUpdates.avatar = avatarUrl;
    }
    
    if (Object.keys(profileUpdates).length > 0) {
      updateProfile(profileUpdates);
    }
    
    toast.success("Settings updated successfully!");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Configure your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:gap-6 sm:items-start">
              <div className="relative group mb-4 sm:mb-0">
                <Avatar 
                  className="h-24 w-24 cursor-pointer hover:opacity-80 transition"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl bg-primary/10">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition"
                  onClick={handleAvatarClick}
                >
                  <Camera className="text-white h-8 w-8" />
                </div>
                {avatarUrl && (
                  <button 
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md"
                    onClick={handleRemoveAvatar}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="w-full space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Your points:</h3>
                    <p className="text-muted-foreground text-sm">{profile.points} points</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Current streak:</h3>
                    <p className="text-muted-foreground text-sm">{profile.streak} days</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pomodoro Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Settings</CardTitle>
            <CardDescription>
              Adjust focus and break times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="pomodoro-duration">Pomodoro Duration</Label>
                  <span className="text-muted-foreground">{formSettings.pomodoroDuration} min</span>
                </div>
                <Slider
                  id="pomodoro-duration"
                  min={5}
                  max={60}
                  step={5}
                  value={[formSettings.pomodoroDuration]}
                  onValueChange={([value]) => setFormSettings({ ...formSettings, pomodoroDuration: value })}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="short-break">Short Break</Label>
                  <span className="text-muted-foreground">{formSettings.shortBreakDuration} min</span>
                </div>
                <Slider
                  id="short-break"
                  min={1}
                  max={15}
                  step={1}
                  value={[formSettings.shortBreakDuration]}
                  onValueChange={([value]) => setFormSettings({ ...formSettings, shortBreakDuration: value })}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="long-break">Long Break</Label>
                  <span className="text-muted-foreground">{formSettings.longBreakDuration} min</span>
                </div>
                <Slider
                  id="long-break"
                  min={5}
                  max={30}
                  step={5}
                  value={[formSettings.longBreakDuration]}
                  onValueChange={([value]) => setFormSettings({ ...formSettings, longBreakDuration: value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the appearance of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={formSettings.theme}
                onValueChange={(value) => setFormSettings({ ...formSettings, theme: value as "light" | "dark" | "system" })}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notifications">Notifications</Label>
              <Select
                value={formSettings.notificationsEnabled ? "enabled" : "disabled"}
                onValueChange={(value) => setFormSettings({ 
                  ...formSettings, 
                  notificationsEnabled: value === "enabled" 
                })}
              >
                <SelectTrigger id="notifications">
                  <SelectValue placeholder="Configure notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
