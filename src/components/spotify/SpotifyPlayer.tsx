import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

export const SpotifyPlayer = () => {
  const { getCurrentTrack, playTrack, pauseTrack, nextTrack, previousTrack } = useAppStore();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      setIsLoading(true);
      const track = await getCurrentTrack();
      setCurrentTrack(track);
      setIsPlaying(track?.is_playing || false);
      setIsLoading(false);
    };

    fetchCurrentTrack();
    
    // Refresh every 10 seconds
    const intervalId = setInterval(fetchCurrentTrack, 10000);
    
    return () => clearInterval(intervalId);
  }, [getCurrentTrack]);

  const togglePlayPause = async () => {
    if (currentTrack) {
      if (isPlaying) {
        await pauseTrack();
        setIsPlaying(false);
      } else {
        await playTrack(currentTrack.item.uri);
        setIsPlaying(true);
      }
    }
  };

  const handleNext = async () => {
    await nextTrack();
  };

  const handlePrevious = async () => {
    await previousTrack();
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <Skeleton className="w-10 h-10 rounded-md" />
          ) : currentTrack ? (
            <img 
              src={currentTrack.item?.album?.images?.[0]?.url} 
              alt="Album Art" 
              className="w-10 h-10 rounded-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Music size={20} className="text-primary" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ) : currentTrack ? (
              <>
                <p className="font-medium truncate">{currentTrack.item?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.item?.artists?.map((a: any) => a.name).join(", ")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma música tocando</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handlePrevious}
              disabled={isLoading || !currentTrack}
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={togglePlayPause}
              disabled={isLoading || !currentTrack}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleNext}
              disabled={isLoading || !currentTrack}
            >
              <SkipForward size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
