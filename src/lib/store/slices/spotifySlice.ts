
import { SpotifyState, SetFunction, GetFunction } from '../types';
import { fetchSpotifyApi } from '../../spotifyApi';

export const createSpotifySlice = (set: SetFunction, get: GetFunction): SpotifyState => ({
  spotifyAuth: null,
  
  setSpotifyAuth: (auth) => set({ spotifyAuth: auth }),
  
  clearSpotifyAuth: () => set({ spotifyAuth: null }),
  
  getCurrentTrack: async () => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return null;
    
    try {
      const response = await fetchSpotifyApi('/me/player/currently-playing', {
        method: 'GET',
        token: spotifyAuth.accessToken
      });
      return response;
    } catch (error) {
      console.error('Error fetching current track:', error);
      return null;
    }
  },
  
  playTrack: async (uri) => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return;
    
    try {
      await fetchSpotifyApi('/me/player/play', {
        method: 'PUT',
        token: spotifyAuth.accessToken,
        body: JSON.stringify({
          uris: [uri]
        })
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },
  
  pauseTrack: async () => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return;
    
    try {
      await fetchSpotifyApi('/me/player/pause', {
        method: 'PUT',
        token: spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  },
  
  nextTrack: async () => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return;
    
    try {
      await fetchSpotifyApi('/me/player/next', {
        method: 'POST',
        token: spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  },
  
  previousTrack: async () => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return;
    
    try {
      await fetchSpotifyApi('/me/player/previous', {
        method: 'POST',
        token: spotifyAuth.accessToken
      });
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  },
  
  getUserPlaylists: async () => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return [];
    
    try {
      const response = await fetchSpotifyApi('/me/playlists', {
        method: 'GET',
        token: spotifyAuth.accessToken
      });
      // We need to make sure we return an array synchronously
      return Promise.resolve(response?.items || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },
  
  playPlaylist: async (playlistUri) => {
    const { spotifyAuth } = get();
    if (!spotifyAuth?.accessToken) return;
    
    try {
      await fetchSpotifyApi('/me/player/play', {
        method: 'PUT',
        token: spotifyAuth.accessToken,
        body: JSON.stringify({
          context_uri: playlistUri
        })
      });
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  }
});
