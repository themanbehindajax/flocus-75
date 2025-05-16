
import { useAppStore } from "./store";
import { toast } from "sonner";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

interface FetchOptions {
  method: string;
  token: string;
  body?: string;
}

/**
 * Refreshes the Spotify access token using the refresh token
 * 
 * Note: In a production app, this should be handled by a server
 * to avoid exposing the client secret. This is a simplified implementation
 * for development purposes.
 */
export const refreshSpotifyToken = async (refreshToken: string): Promise<string | null> => {
  try {
    // In a real implementation, this would call a backend endpoint
    // that securely handles the token refresh
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // In a real app, this would be handled server-side with proper authentication
        "Authorization": `Basic ${btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ":" + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)}`
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || "Failed to refresh token");
    }
    
    // Update the token in store
    useAppStore.getState().setSpotifyAuth({
      accessToken: data.access_token,
      refreshToken: refreshToken, // Use the same refresh token
      expiresAt: Date.now() + data.expires_in * 1000
    });
    
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    useAppStore.getState().clearSpotifyAuth();
    toast.error("Spotify authentication expired. Please login again.");
    return null;
  }
};

/**
 * Fetch data from Spotify API with token refresh handling
 */
export const fetchSpotifyApi = async (endpoint: string, options: FetchOptions): Promise<any> => {
  try {
    const url = `${SPOTIFY_BASE_URL}${endpoint}`;
    const headers = {
      "Authorization": `Bearer ${options.token}`,
      "Content-Type": "application/json"
    };
    
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body
    });
    
    // If token expired, try to refresh it
    if (response.status === 401) {
      const settings = useAppStore.getState().settings;
      const refreshToken = settings.spotifyAuth?.refreshToken;
      
      if (!refreshToken) {
        useAppStore.getState().clearSpotifyAuth();
        throw new Error("Authentication required");
      }
      
      const newToken = await refreshSpotifyToken(refreshToken);
      if (!newToken) {
        throw new Error("Failed to refresh authentication");
      }
      
      // Retry the request with new token
      const retryResponse = await fetch(url, {
        method: options.method,
        headers: {
          ...headers,
          "Authorization": `Bearer ${newToken}`
        },
        body: options.body
      });
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json();
        throw new Error(errorData.error?.message || "API request failed");
      }
      
      // For GET requests, return the data
      if (options.method === "GET") {
        return await retryResponse.json();
      }
      
      return true;
    }
    
    // Handle regular response
    if (!response.ok) {
      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
      }
      
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }
    
    // For GET requests, return the data
    if (options.method === "GET" && response.status !== 204) {
      return await response.json();
    }
    
    return true;
  } catch (error) {
    console.error(`Spotify API error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Get Spotify authorization URL
 */
export const getSpotifyAuthUrl = () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = encodeURIComponent(window.location.origin + "/settings");
  const scopes = encodeURIComponent([
    'user-read-private',
    'user-read-email',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' '));
  
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeSpotifyCode = async (code: string): Promise<boolean> => {
  try {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = window.location.origin + "/settings";
    
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // In a real app, this would be handled server-side with proper authentication
        "Authorization": `Basic ${btoa(clientId + ":" + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || "Failed to exchange code");
    }
    
    // Save tokens to store
    useAppStore.getState().setSpotifyAuth({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000
    });
    
    return true;
  } catch (error) {
    console.error("Error exchanging code:", error);
    return false;
  }
};
