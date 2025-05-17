
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Use the client ID provided by the user
const GOOGLE_CLIENT_ID = "803068792420-t0ndpse3ju98b7smatl9jmphp6udhkk7.apps.googleusercontent.com";

const Login = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20 bg-gradient-to-br from-background to-muted/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-background rounded-lg shadow-lg p-8 border animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Flocus</h1>
            <p className="text-muted-foreground mt-2">Sua ferramenta de produtividade pessoal</p>
          </div>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <LoginForm />
              </GoogleOAuthProvider>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <LoginForm isSignUp={true} />
              </GoogleOAuthProvider>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {activeTab === "login" 
                ? "Não tem uma conta? " 
                : "Já tem uma conta? "}
              <button 
                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                className="text-primary hover:underline font-medium"
              >
                {activeTab === "login" ? "Cadastre-se" : "Faça login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
