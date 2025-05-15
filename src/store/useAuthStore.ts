import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,

  setAccessToken: (token: string) => {
    Cookies.set("accessToken", token, { expires: 1 });
    set({ accessToken: token });
  },

  clearAccessToken: () => {
    Cookies.remove("accessToken");
    set({ accessToken: null });
  },
}));
