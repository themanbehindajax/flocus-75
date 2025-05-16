import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, SkipForward, SkipBack, Music, Spotify } from "lucide-react";
import { toast } from "sonner";

interface CurrentTrack {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  is_playing: boolean;
  uri: string;
}

export const SpotifyPlayer = () => {
  const { settings, getCurrentTrack, playTrack, pauseTrack, nextTrack, previousTrack } = useAppStore();
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  const isConnected = !!settings.spotifyAuth?.accessToken;

  const fetchCurrentTrack = async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      const trackData = await getCurrentTrack();
      
      if (trackData && trackData.item) {
        setCurrentTrack({
          name: trackData.item.name,
          artists: trackData.item.artists,
          album: trackData.item.album,
          is_playing: trackData.is_playing,
          uri: trackData.item.uri
        });
      }
    } catch (error) {
      console.error("Error fetching current track:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!currentTrack) return;
    
    try {
      if (currentTrack.is_playing) {
        await pauseTrack();
        setCurrentTrack(prev => prev ? { ...prev, is_playing: false } : null);
      } else {
        await playTrack(currentTrack.uri);
        setCurrentTrack(prev => prev ? { ...prev, is_playing: true } : null);
      }
    } catch (error) {
      toast.error("Failed to control playback. Make sure Spotify is active on a device.");
    }
  };

  const handleNext = async () => {
    try {
      await nextTrack();
      // Fetch updated track info after a short delay
      setTimeout(fetchCurrentTrack, 500);
    } catch (error) {
      toast.error("Failed to skip track");
    }
  };

  const handlePrevious = async () => {
    try {
      await previousTrack();
      // Fetch updated track info after a short delay
      setTimeout(fetchCurrentTrack, 500);
    } catch (error) {
      toast.error("Failed to go to previous track");
    }
  };

  // Start polling for current track when component mounts
  useEffect(() => {
    if (isConnected) {
      fetchCurrentTrack();
      
      // Poll every 10 seconds to keep track info updated
      const interval = window.setInterval(fetchCurrentTrack, 10000);
      setPollingInterval(interval);
      
      return () => {
        if (pollingInterval) {
          window.clearInterval(pollingInterval);
        }
      };
    }
  }, [isConnected]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        window.clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  if (!isConnected) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Spotify className="mr-2 h-5 w-5" />
            Spotify não conectado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Conecte-se ao Spotify nas configurações para controlar música durante seus pomodoros.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <a href="/settings">Ir para Configurações</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Spotify className="mr-2 h-5 w-5 text-green-500" />
          Música para Foco
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-12 rounded-md" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : currentTrack ? (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 shrink-0">
              {currentTrack.album.images && currentTrack.album.images[0] ? (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={`${currentTrack.album.name} cover`}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium truncate">{currentTrack.name}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artists.map(artist => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma música tocando</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={!currentTrack}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          onClick={handlePlayPause}
          disabled={!currentTrack}
        >
          {currentTrack?.is_playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!currentTrack}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
