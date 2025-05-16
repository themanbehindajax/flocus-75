
import { v4 as uuidv4 } from "uuid";
import { fetchSpotifyApi } from "../spotifyApi";

export const createSpotifyActions = (set: any, get: any) => ({
  setSpotifyAuth: (auth: { accessToken: string; refreshToken: string; expiresAt: number }) => {
    set((state: any) => ({
      settings: {
        ...state.settings,
        spotifyAuth: {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          expiresAt: auth.expiresAt,
        }
      }
    }));
  },
  clearSpotifyAuth: () => {
    set((state: any) => ({
      settings: {
        ...state.settings,
        spotifyAuth: undefined
      }
    }));
  },
  getCurrentTrack: async () => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return null;
    try {
      const response = await fetchSpotifyApi('/me/player/currently-playing', {
        method: 'GET',
        token: settings.spotifyAuth.accessToken
      });
      return response;
    } catch (error) {
      console.error('Error fetching current track:', error);
      return null;
    }
  },
  playTrack: async (uri: string) => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return;
    try {
      await fetchSpotifyApi('/me/player/play', {
        method: 'PUT',
        token: settings.spotifyAuth.accessToken,
        body: JSON.stringify({
          uris: [uri]
        })
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },
  pauseTrack: async () => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return;
    try {
      await fetchSpotifyApi('/me/player/pause', {
        method: 'PUT',
        token: settings.spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  },
  nextTrack: async () => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return;
    try {
      await fetchSpotifyApi('/me/player/next', {
        method: 'POST',
        token: settings.spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  },
  previousTrack: async () => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return;
    try {
      await fetchSpotifyApi('/me/player/previous', {
        method: 'POST',
        token: settings.spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  },
  getUserPlaylists: async () => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return [];
    try {
      const response = await fetchSpotifyApi('/me/playlists', {
        method: 'GET',
        token: settings.spotifyAuth.accessToken
      });
      return response.items || [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },
  playPlaylist: async (playlistUri: string) => {
    const { settings } = get();
    if (!settings.spotifyAuth?.accessToken) return;
    try {
      await fetchSpotifyApi('/me/player/play', {
        method: 'PUT',
        token: settings.spotifyAuth.accessToken,
        body: JSON.stringify({
          context_uri: playlistUri
        })
      });
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  }
});
