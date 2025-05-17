
import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Função para verificar se deve usar o tema escuro com base no horário de São Paulo
  const shouldUseDarkTheme = useCallback(() => {
    try {
      // Cria uma data usando o fuso horário de São Paulo (GMT-3)
      const date = new Date();
      
      // Ajusta para o fuso horário de São Paulo
      const options = { timeZone: 'America/Sao_Paulo' };
      const spTime = new Date(date.toLocaleString('en-US', options));
      
      const hour = spTime.getHours();
      
      // Das 18h (6PM) às 8h, usar tema escuro
      return hour >= 18 || hour < 8;
    } catch (error) {
      console.error("Erro ao verificar horário:", error);
      return false;
    }
  }, []);

  const updateTheme = useCallback((darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(darkMode);
  }, []);

  useEffect(() => {
    // Inicializa baseado na preferência do sistema ou preferência armazenada
    const storedTheme = localStorage.getItem("theme");
    const userSetTheme = storedTheme !== null;
    
    if (storedTheme) {
      // Se o usuário definiu manualmente um tema, respeitamos sua preferência
      updateTheme(storedTheme === "dark");
    } else {
      // Caso contrário, verificamos o horário para definir automaticamente
      const darkMode = shouldUseDarkTheme();
      updateTheme(darkMode);
    }
    
    setMounted(true);
    
    // Configura um intervalo para verificar a hora e atualizar o tema automaticamente
    const themeInterval = setInterval(() => {
      // Só atualiza automaticamente se o usuário não definiu manualmente
      if (!userSetTheme) {
        const darkMode = shouldUseDarkTheme();
        if (darkMode !== isDark) {
          updateTheme(darkMode);
        }
      }
    }, 60000); // Verifica a cada minuto
    
    return () => clearInterval(themeInterval);
  }, [shouldUseDarkTheme, updateTheme, isDark]);

  const toggleTheme = () => {
    const newMode = !isDark;
    updateTheme(newMode);
    
    // Quando o usuário clica manualmente, guardamos a preferência
    localStorage.setItem("theme", newMode ? "dark" : "light");
    toast.info(`Modo ${newMode ? "escuro" : "claro"} ativado`);
  };

  // Não renderiza nada até que o componente esteja montado para evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-white/10 dark:text-white text-gray-700 transition-all duration-300"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-300 hover:text-amber-400 transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 hover:text-slate-900 transition-colors" />
      )}
    </Button>
  );
};
