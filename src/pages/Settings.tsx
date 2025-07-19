
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
import { TIMEZONE_OPTIONS, getCurrentTimeInTimezone } from "@/lib/timezone";
import { t } from "@/lib/translations";
import { loadDemoData, clearAllData } from "@/lib/loadDemoData";
import { Database, Trash2 } from "lucide-react";

const Settings = () => {
  const { settings, updateSettings, profile, updateProfile, timezone, setTimezone } = useAppStore();
  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatar);
  const [selectedTimezone, setSelectedTimezone] = useState(timezone || 'America/Sao_Paulo');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  useEffect(() => {
    setAvatarUrl(profile.avatar);
  }, [profile.avatar]);

  useEffect(() => {
    setSelectedTimezone(timezone || 'America/Sao_Paulo');
  }, [timezone]);

  const handleSaveSettings = () => {
    const updatedSettings = {
      ...formSettings,
      timezone: selectedTimezone
    };
    
    updateSettings(updatedSettings);
    setTimezone(selectedTimezone);
    
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
    
    toast.success(t('settings_saved'));
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

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
  };

  const getSelectedTimezoneLabel = () => {
    const option = TIMEZONE_OPTIONS.find(tz => tz.value === selectedTimezone);
    return option?.label || selectedTimezone;
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('settings_title')}</h1>
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
            <CardDescription>
              {t('profile_description')}
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
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t('your_points')}</h3>
                    <p className="text-muted-foreground text-sm">{profile.points} {t('points')}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{t('current_streak')}</h3>
                    <p className="text-muted-foreground text-sm">{profile.streak} {t('days')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pomodoro Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('pomodoro_settings')}</CardTitle>
            <CardDescription>
              {t('pomodoro_settings_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="pomodoro-duration">{t('pomodoro_duration')}</Label>
                  <span className="text-muted-foreground">{formSettings.pomodoroDuration} {t('minutes')}</span>
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
                  <Label htmlFor="short-break">{t('short_break')}</Label>
                  <span className="text-muted-foreground">{formSettings.shortBreakDuration} {t('minutes')}</span>
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
                  <Label htmlFor="long-break">{t('long_break')}</Label>
                  <span className="text-muted-foreground">{formSettings.longBreakDuration} {t('minutes')}</span>
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
            <CardTitle>{t('appearance')}</CardTitle>
            <CardDescription>
              {t('appearance_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t('theme')}</Label>
              <Select
                value={formSettings.theme}
                onValueChange={(value) => setFormSettings({ ...formSettings, theme: value as "light" | "dark" | "system" })}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder={`${t('select')} ${t('theme').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('light')}</SelectItem>
                  <SelectItem value="dark">{t('dark')}</SelectItem>
                  <SelectItem value="system">{t('system')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">{t('timezone')}</Label>
              <Select
                value={selectedTimezone}
                onValueChange={handleTimezoneChange}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder={`${t('select')} ${t('timezone').toLowerCase()}`}>
                    {getSelectedTimezoneLabel()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIMEZONE_OPTIONS.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{timezone.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {getCurrentTimeInTimezone(timezone.value)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('timezone_description')} {getCurrentTimeInTimezone(selectedTimezone)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notifications">{t('notifications')}</Label>
              <Select
                value={formSettings.notificationsEnabled ? "enabled" : "disabled"}
                onValueChange={(value) => setFormSettings({ 
                  ...formSettings, 
                  notificationsEnabled: value === "enabled" 
                })}
              >
                <SelectTrigger id="notifications">
                  <SelectValue placeholder={`Configure ${t('notifications').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">{t('enabled')}</SelectItem>
                  <SelectItem value="disabled">{t('disabled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Dados</CardTitle>
            <CardDescription>
              Carregar dados de exemplo ou limpar todos os dados da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => {
                  loadDemoData();
                  toast.success("Dados demo carregados com sucesso!");
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Carregar Dados Demo
              </Button>
              
              <Button 
                onClick={() => {
                  if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
                    clearAllData();
                    toast.success("Todos os dados foram removidos!");
                  }
                }}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Todos os Dados
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Os dados demo incluem tarefas, projetos, sessões de pomodoro, tags e eventos de calendário de exemplo.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            {t('save_settings')}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
