
import { useState, useEffect } from "react";
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

const Settings = () => {
  const { settings, updateSettings, profile, updateProfile } = useAppStore();
  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [name, setName] = useState(profile.name);

  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  const handleSaveSettings = () => {
    updateSettings(formSettings);
    
    if (name !== profile.name) {
      updateProfile({ name });
      // Save username to localStorage for persistence
      localStorage.setItem("username", name);
    }
    
    toast.success("Configurações atualizadas com sucesso!");
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Configure suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Seus pontos:</h3>
                <p className="text-muted-foreground text-sm">{profile.points} pontos</p>
              </div>
              
              <div>
                <h3 className="font-medium">Streak atual:</h3>
                <p className="text-muted-foreground text-sm">{profile.streak} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pomodoro Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Pomodoro</CardTitle>
            <CardDescription>
              Ajuste os tempos de foco e descanso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="pomodoro-duration">Duração do Pomodoro</Label>
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
                  <Label htmlFor="short-break">Pausa Curta</Label>
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
                  <Label htmlFor="long-break">Pausa Longa</Label>
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
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize a aparência do aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={formSettings.theme}
                onValueChange={(value) => setFormSettings({ ...formSettings, theme: value as "light" | "dark" | "system" })}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notifications">Notificações</Label>
              <Select
                value={formSettings.notificationsEnabled ? "enabled" : "disabled"}
                onValueChange={(value) => setFormSettings({ 
                  ...formSettings, 
                  notificationsEnabled: value === "enabled" 
                })}
              >
                <SelectTrigger id="notifications">
                  <SelectValue placeholder="Configurar notificações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Ativadas</SelectItem>
                  <SelectItem value="disabled">Desativadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
