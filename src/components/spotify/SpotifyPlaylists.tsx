
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Music } from "lucide-react";
import { toast } from "sonner";

interface Playlist {
  id: string;
  name: string;
  uri: string;
  images: { url: string }[];
}

export const SpotifyPlaylists = () => {
  const { settings, getUserPlaylists, playPlaylist } = useAppStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isConnected = !!settings.spotifyAuth?.accessToken;

  const fetchPlaylists = async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      const playlistData = await getUserPlaylists();
      
      if (playlistData) {
        const formattedPlaylists = playlistData.map((item: any) => ({
          id: item.id,
          name: item.name,
          uri: item.uri,
          images: item.images || []
        }));
        
        setPlaylists(formattedPlaylists);
        
        if (formattedPlaylists.length > 0 && !selectedPlaylistId) {
          setSelectedPlaylistId(formattedPlaylists[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Erro ao buscar suas playlists");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = async () => {
    if (!selectedPlaylistId) return;
    
    const playlist = playlists.find(p => p.id === selectedPlaylistId);
    if (!playlist) return;
    
    try {
      await playPlaylist(playlist.uri);
      toast.success(`Tocando playlist: ${playlist.name}`);
    } catch (error) {
      toast.error("Erro ao iniciar playlist. Certifique-se que o Spotify está aberto em algum dispositivo.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchPlaylists();
    }
  }, [isConnected]);

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Suas Playlists
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-28" />
          </>
        ) : playlists.length > 0 ? (
          <>
            <Select
              value={selectedPlaylistId}
              onValueChange={setSelectedPlaylistId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma playlist" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Suas Playlists</SelectLabel>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handlePlayPlaylist} 
              disabled={!selectedPlaylistId}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Tocar Playlist
            </Button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Nenhuma playlist encontrada. Crie playlists no Spotify para vê-las aqui.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
