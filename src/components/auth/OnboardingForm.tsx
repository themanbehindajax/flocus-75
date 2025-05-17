
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Briefcase, Target, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OnboardingForm = () => {
  const { login } = useAuthStore();
  const { updateProfile, addProject } = useAppStore();
  const [activeStep, setActiveStep] = useState<string>("profile");
  const [name, setName] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<string>("");
  const [monthlyGoals, setMonthlyGoals] = useState<string>("");
  const [yearlyGoals, setYearlyGoals] = useState<string>("");
  const [projects, setProjects] = useState<Array<{name: string, description: string}>>([
    { name: "", description: "" }
  ]);
  
  const handleAddProject = () => {
    setProjects([...projects, { name: "", description: "" }]);
  };
  
  const handleProjectChange = (index: number, field: 'name' | 'description', value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }
    
    // Create user profile
    const user: UserProfile = {
      name: name.trim(),
      points: 0,
      streak: 0,
      lastActivity: new Date().toISOString(),
      totalTasksCompleted: 0,
      totalPomodorosCompleted: 0,
      avatar: avatarPreview
    };
    
    // Create projects from onboarding
    const validProjects = projects.filter(project => project.name.trim() !== "");
    validProjects.forEach(project => {
      addProject({
        name: project.name.trim(),
        description: project.description.trim(),
        color: getRandomColor()
      });
    });
    
    // Save onboarding data
    localStorage.setItem("username", name);
    localStorage.setItem("weeklyGoals", weeklyGoals);
    localStorage.setItem("monthlyGoals", monthlyGoals);
    localStorage.setItem("yearlyGoals", yearlyGoals);
    if (avatarPreview) {
      localStorage.setItem("userAvatar", avatarPreview);
    }
    
    // Update profile in store
    updateProfile({ 
      name,
      avatar: avatarPreview || undefined
    });
    
    // Login with local info
    login(user, "local");
    
    toast.success("Bem-vindo ao Flocus! Sua configuração foi concluída.");
  };
  
  const getRandomColor = () => {
    const colors = ["#9b87f5", "#0EA5E9", "#F97316", "#D946EF", "#8B5CF6"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs 
        defaultValue="profile" 
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="text-xs">Perfil</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">Projetos</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs">Metas</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="profile" className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="text-2xl">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <span className="text-white text-xs">Alterar</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              <div className="space-y-2 w-full">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="name">Nome</Label>
                </div>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                type="button" 
                onClick={() => setActiveStep("projects")}
                disabled={!name.trim()}
              >
                Próximo
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Seus projetos</h3>
              </div>
              
              {projects.map((project, index) => (
                <div key={index} className="space-y-3 mb-4 p-4 border rounded-md">
                  <div>
                    <Label htmlFor={`project-name-${index}`}>Nome do Projeto</Label>
                    <Input
                      id={`project-name-${index}`}
                      placeholder="Nome do projeto"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`project-desc-${index}`}>Descrição</Label>
                    <Textarea
                      id={`project-desc-${index}`}
                      placeholder="Descrição do projeto"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddProject}
                className="w-full mt-2"
              >
                Adicionar outro projeto
              </Button>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveStep("profile")}
              >
                Voltar
              </Button>
              <Button 
                type="button" 
                onClick={() => setActiveStep("goals")}
              >
                Próximo
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Suas metas</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weekly-goals">Metas Semanais</Label>
                  <Textarea
                    id="weekly-goals"
                    placeholder="Quais são suas metas para esta semana?"
                    value={weeklyGoals}
                    onChange={(e) => setWeeklyGoals(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthly-goals">Metas Mensais</Label>
                  <Textarea
                    id="monthly-goals"
                    placeholder="Quais são suas metas para este mês?"
                    value={monthlyGoals}
                    onChange={(e) => setMonthlyGoals(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearly-goals">Metas Anuais</Label>
                  <Textarea
                    id="yearly-goals"
                    placeholder="Quais são suas metas para este ano?"
                    value={yearlyGoals}
                    onChange={(e) => setYearlyGoals(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveStep("projects")}
              >
                Voltar
              </Button>
              <Button type="submit">
                Concluir
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};
