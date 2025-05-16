
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react"; // Changed from Spotify to Music
import { useAppStore } from "@/lib/store";
import { getSpotifyAuthUrl, exchangeSpotifyCode } from "@/lib/spotifyApi";
import { toast } from "sonner";

export const SpotifyAuth = () => {
  const location = useLocation();
  const { settings, clearSpotifyAuth } = useAppStore();
  const isConnected = !!settings.spotifyAuth?.accessToken;
  
  // Check for Spotify auth callback on component mount
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // Clear the code from the URL to prevent reusing it
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Exchange the code for tokens
        const success = await exchangeSpotifyCode(code);
        
        if (success) {
          toast.success("Spotify conectado com sucesso!");
        } else {
          toast.error("Falha ao conectar com o Spotify");
        }
      }
    };
    
    handleCallback();
  }, [location]);
  
  const handleConnect = () => {
    window.location.href = getSpotifyAuthUrl();
  };
  
  const handleDisconnect = () => {
    clearSpotifyAuth();
    toast.success("Spotify desconectado");
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className={isConnected ? "text-green-500" : "text-muted-foreground"} /> {/* Changed from Spotify to Music */}
          <span>{isConnected ? 'Conectado ao Spotify' : 'Não conectado ao Spotify'}</span>
        </div>
        
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar
          </Button>
        ) : (
          <Button onClick={handleConnect}>
            <Music className="mr-2 h-4 w-4" /> {/* Changed from Spotify to Music */}
            Conectar
          </Button>
        )}
      </div>
      
      {isConnected && (
        <p className="text-sm text-muted-foreground">
          Sua conta Spotify foi conectada com sucesso. Agora você pode controlar o Spotify no timer Pomodoro.
        </p>
      )}
    </div>
  );
};
