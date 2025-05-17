
import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [autoMode, setAutoMode] = useState<boolean>(true);

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

  const updateTheme = useCallback((darkMode: boolean, isAuto: boolean = false) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      if (!isAuto) localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      if (!isAuto) localStorage.setItem("theme", "light");
    }
    setIsDark(darkMode);
  }, []);

  useEffect(() => {
    // Inicializa baseado na preferência do sistema ou preferência armazenada
    const storedTheme = localStorage.getItem("theme");
    const userSetTheme = storedTheme !== null;
    const storedAutoMode = localStorage.getItem("autoTheme");
    
    if (storedAutoMode !== null) {
      setAutoMode(storedAutoMode === "true");
    }
    
    if (storedTheme && !autoMode) {
      // Se o usuário definiu manualmente um tema e não está em modo automático
      updateTheme(storedTheme === "dark", false);
    } else if (autoMode) {
      // Se está em modo automático
      const darkMode = shouldUseDarkTheme();
      updateTheme(darkMode, true);
      localStorage.removeItem("theme"); // Remove preferência manual
    }
    
    setMounted(true);
    
    // Configura um intervalo para verificar a hora e atualizar o tema automaticamente
    const themeInterval = setInterval(() => {
      // Só atualiza automaticamente se estiver em modo automático
      if (autoMode) {
        const darkMode = shouldUseDarkTheme();
        if (darkMode !== isDark) {
          updateTheme(darkMode, true);
        }
      }
    }, 60000); // Verifica a cada minuto
    
    return () => clearInterval(themeInterval);
  }, [shouldUseDarkTheme, updateTheme, autoMode, isDark]);

  const toggleTheme = () => {
    const newMode = !isDark;
    updateTheme(newMode, false);
    
    // Quando o usuário clica manualmente, desativa o modo automático
    setAutoMode(false);
    localStorage.setItem("autoTheme", "false");
    
    // Quando o usuário clica manualmente, guardamos a preferência
    localStorage.setItem("theme", newMode ? "dark" : "light");
    toast.info(`Modo ${newMode ? "escuro" : "claro"} ativado`);
  };

  const toggleAutoMode = () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    localStorage.setItem("autoTheme", newAutoMode ? "true" : "false");
    
    if (newAutoMode) {
      // Se ativou o modo automático, atualiza imediatamente
      const darkMode = shouldUseDarkTheme();
      updateTheme(darkMode, true);
      localStorage.removeItem("theme"); // Remove preferência manual
      toast.info("Modo automático ativado");
    } else {
      // Se desativou o modo automático, mantém o tema atual como preferência manual
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toast.info("Modo manual ativado");
    }
  };

  // Não renderiza nada até que o componente esteja montado para evitar problemas de hidratação
  if (!mounted) {
    return <div className="w-10 h-10"></div>; // Placeholder para evitar layout shift
  }

  return (
    <div className="flex items-center gap-2">
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
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAutoMode}
        className="text-xs rounded-full px-2 py-1 h-auto hover:bg-white/10 transition-all duration-300"
      >
        <span className={`${autoMode ? "text-blue-500 font-medium" : "text-muted-foreground"}`}>
          Auto
        </span>
      </Button>
    </div>
  );
};
