
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "./types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  googleToken: string | null;
  
  // Auth actions
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      googleToken: null,
      
      login: (user: UserProfile, token: string) => {
        set({
          isAuthenticated: true,
          user,
          googleToken: token
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          googleToken: null
        });
      },
      
      updateUser: (userData: Partial<UserProfile>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: "produtivo-auth-storage",
    }
  )
);
