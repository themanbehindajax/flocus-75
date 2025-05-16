
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/auth";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google Client ID

const Login = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-lg p-6 border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Produtivo</h1>
            <p className="text-muted-foreground mt-2">Sua ferramenta de produtividade pessoal</p>
          </div>
          
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginForm />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;
