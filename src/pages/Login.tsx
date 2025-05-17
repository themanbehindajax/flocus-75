
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-elegant border animate-fade-in p-8">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold font-satoshi bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400"
            >
              Flocus
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground mt-2"
            >
              Sua ferramenta de produtividade pessoal
            </motion.p>
          </div>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="rounded-lg text-sm">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg text-sm">Cadastro</TabsTrigger>
            </TabsList>
            
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="space-y-4 mt-2">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <LoginForm />
                </GoogleOAuthProvider>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-2">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <LoginForm isSignUp={true} />
                </GoogleOAuthProvider>
              </TabsContent>
            </motion.div>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {activeTab === "login" 
                ? "Não tem uma conta? " 
                : "Já tem uma conta? "}
              <button 
                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                className="text-primary hover:underline font-medium transition-colors"
              >
                {activeTab === "login" ? "Cadastre-se" : "Faça login"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
