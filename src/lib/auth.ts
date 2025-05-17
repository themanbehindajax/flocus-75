
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "./types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  
  // Auth actions
  login: (user: UserProfile, source: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: (user: UserProfile, source: string) => {
        set({
          isAuthenticated: true,
          user,
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
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
