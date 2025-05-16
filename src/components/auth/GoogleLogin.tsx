
import { useState, useEffect } from "react";
import { GoogleLogin as GoogleOAuthLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";
import { Google } from "lucide-react";

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export const GoogleLogin = () => {
  const { login } = useAuthStore();
  const { updateProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSuccess = (credentialResponse: { credential: string }) => {
    try {
      setIsLoading(true);
      const decodedToken = jwtDecode<GoogleUserInfo>(credentialResponse.credential);
      
      const user: UserProfile = {
        name: decodedToken.name,
        avatar: decodedToken.picture,
        points: 0,
        streak: 0,
        lastActivity: new Date().toISOString(),
        totalTasksCompleted: 0,
        totalPomodorosCompleted: 0
      };
      
      login(user, credentialResponse.credential);
      updateProfile(user);
      
      toast.success("Login realizado com sucesso!");
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login com Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {isLoading ? (
          <Button variant="outline" disabled className="w-full">
            <span className="loading loading-spinner loading-sm mr-2"></span>
            Processando...
          </Button>
        ) : (
          <GoogleOAuthLogin
            onSuccess={handleSuccess}
            onError={() => {
              toast.error("Erro ao fazer login com Google");
            }}
            width="100%"
          />
        )}
        
        <Button variant="outline" className="w-full" disabled={isLoading} asChild>
          <div>
            <Google className="mr-2 h-4 w-4" />
            Entrar com Google
          </div>
        </Button>
      </div>
    </div>
  );
};
