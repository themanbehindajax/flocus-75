
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "./GoogleLogin";
import { toast } from "sonner";

export const LoginForm = () => {
  const { login } = useAuthStore();
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }
    
    setIsLoading(true);
    
    const user: UserProfile = {
      name: name,
      points: profile.points,
      streak: profile.streak,
      lastActivity: profile.lastActivity,
      totalTasksCompleted: profile.totalTasksCompleted,
      totalPomodorosCompleted: profile.totalPomodorosCompleted
    };
    
    // Save profile in local storage for persistence
    localStorage.setItem("username", name);
    
    // Update profile in store
    updateProfile({ name });
    
    // Login with local info (no token for simple name login)
    login(user, "local");
    
    setIsLoading(false);
    toast.success("Login realizado com sucesso!");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Bem-vindo</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Entre para acessar seu painel de produtividade
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="name"
            placeholder="Seu nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      
      <GoogleLogin />
    </div>
  );
};
