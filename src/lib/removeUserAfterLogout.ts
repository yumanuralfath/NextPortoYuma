import { useUserStore } from "@/store/useUserStore";
import { removeAccessToken } from "./fetchLib";

export function removeUser() {
  removeAccessToken();
  useUserStore.getState().clearUser();
}
