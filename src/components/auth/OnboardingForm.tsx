
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const OnboardingForm = () => {
  const { login } = useAuthStore();
  const { updateProfile, addProject } = useAppStore();
  const [name, setName] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
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
    
    // Add a default project
    addProject({
      name: "Meu Primeiro Projeto",
      description: "Um projeto para organizar minhas tarefas iniciais",
      color: "#9b87f5"
    });
    
    // Save user data
    localStorage.setItem("username", name);
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
    
    toast.success(`Bem-vindo ao Flocus, ${name}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar className="h-28 w-28 border-2 border-primary/30 shadow-lg">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="text-3xl bg-primary/10">
                {name ? name.charAt(0).toUpperCase() : "F"}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-white text-sm font-medium">Alterar</span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </motion.div>
          
          <div className="space-y-3 w-full">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <Label htmlFor="name" className="font-medium text-lg">Como podemos te chamar?</Label>
            </div>
            <Input
              id="name"
              placeholder="Seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="text-lg py-6 px-4 bg-background/50 border-primary/20 focus:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-medium mt-6"
          disabled={!name.trim()}
        >
          Começar a usar o Flocus
        </Button>
      </form>
    </motion.div>
  );
};
