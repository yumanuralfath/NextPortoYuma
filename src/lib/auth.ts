import BASE_URL from "./baseUrl";
import { useAuthStore } from "@/store/useAuthStore";
import {
  credentialsProps,
  userDataProps,
  GetCurrentUserResponse,
} from "@/types";

const token = useAuthStore.getState().accessToken;

export const loginService = async (credentials: credentialsProps) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data;
};

export const registerService = async (userData: userDataProps) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed Register");
  }

  return data;
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed get User");
  }

  return data;
};
