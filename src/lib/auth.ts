import BASE_URL from "./baseUrl";
import {
  credentialsProps,
  userDataProps,
  GetCurrentUserResponse,
} from "@/types";
import { useUserStore } from "@/store/useUserStore";
import {
  getJsonWithToken,
  postJsonWithToken,
  setAccessToken,
} from "./fetchLib";
import { withErrorHandler } from "./withErrorHandler";

export const loginService = async (credentials: credentialsProps) => {
  const response = await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/login`, credentials, false),
    "Failed to login"
  );

  setAccessToken(response?.token);
  useUserStore.getState().setUser(response?.user);
};

export const registerService = async (userData: userDataProps) => {
  await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/register`, userData, false),
    "Failed to Register"
  );
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/me`),
    "Failed to Get Current User"
  );
};
