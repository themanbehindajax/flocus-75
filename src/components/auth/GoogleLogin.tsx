
import { useState } from "react";
import { GoogleLogin as GoogleOAuthLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";

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
    <div className="w-full">
      {isLoading ? (
        <div className="w-full h-10 flex items-center justify-center border rounded-md bg-muted/20">
          <span className="text-sm">Processando...</span>
        </div>
      ) : (
        <GoogleOAuthLogin
          onSuccess={handleSuccess}
          onError={() => {
            toast.error("Erro ao fazer login com Google");
          }}
          width="100%"
          shape="rectangular"
          text="signin_with"
          locale="pt"
          theme="outline"
          size="large"
        />
      )}
    </div>
  );
};
