
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Função para verificar se deve usar o tema escuro com base no horário de São Paulo
  const shouldUseDarkTheme = () => {
    // Cria uma data usando o fuso horário de São Paulo (GMT-3)
    const date = new Date();
    
    // Ajusta para o fuso horário de São Paulo
    // Isso funcionará independentemente do fuso horário do usuário
    const options = { timeZone: 'America/Sao_Paulo' };
    const spTime = new Date(date.toLocaleString('en-US', options));
    
    const hour = spTime.getHours();
    
    // Das 18h (6PM) às 8h, usar tema escuro
    return hour >= 18 || hour < 8;
  };

  useEffect(() => {
    // Inicializa baseado na preferência do sistema ou preferência armazenada
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme) {
      // Se o usuário definiu manualmente um tema, respeitamos sua preferência
      setIsDark(storedTheme === "dark");
      updateTheme(storedTheme === "dark");
    } else {
      // Caso contrário, verificamos o horário para definir automaticamente
      const darkMode = shouldUseDarkTheme();
      setIsDark(darkMode);
      updateTheme(darkMode);
    }
    
    // Configura um intervalo para verificar a hora e atualizar o tema automaticamente
    const themeInterval = setInterval(() => {
      // Só atualiza automaticamente se o usuário não definiu manualmente
      if (!localStorage.getItem("theme")) {
        const darkMode = shouldUseDarkTheme();
        if (darkMode !== isDark) {
          setIsDark(darkMode);
          updateTheme(darkMode);
        }
      }
    }, 60000); // Verifica a cada minuto
    
    return () => clearInterval(themeInterval);
  }, []);

  const updateTheme = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    updateTheme(newMode);
    
    // Quando o usuário clica manualmente, guardamos a preferência
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-white/10 dark:text-white text-gray-700"
      aria-label="Alternar tema"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
