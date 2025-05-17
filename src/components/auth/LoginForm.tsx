
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "./GoogleLogin";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { AtSign, KeyRound, User } from "lucide-react";

interface LoginFormProps {
  isSignUp?: boolean;
}

export const LoginForm = ({ isSignUp = false }: LoginFormProps) => {
  const { login } = useAuthStore();
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }
      
      if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }
      
      if (!email.includes('@')) {
        toast.error("Por favor, insira um email válido");
        return;
      }
    } else {
      if (!name.trim()) {
        toast.error("Por favor, insira seu nome");
        return;
      }
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
    if (email) localStorage.setItem("useremail", email);
    
    // Update profile in store
    updateProfile({ name });
    
    // Login with local info (no token for simple name login)
    login(user, "local");
    
    setIsLoading(false);
    toast.success(isSignUp ? "Cadastro realizado com sucesso!" : "Login realizado com sucesso!");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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
            autoComplete="name"
          />
        </div>
        
        {isSignUp && (
          <>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AtSign className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="email">Email</Label>
              </div>
              <Input
                id="email"
                placeholder="seu.email@exemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
          </>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processando..." : isSignUp ? "Cadastrar" : "Entrar"}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou continue com
          </span>
        </div>
      </div>
      
      <GoogleLogin />
    </div>
  );
};
