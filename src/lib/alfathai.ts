/* eslint-disable @typescript-eslint/no-explicit-any */
import BASE_URL from "./baseUrl";
import { useAuthStore } from "@/store/useAuthStore";

interface UserPrompt {
  prompt: string;
}

const token = useAuthStore.getState().accessToken;

export const promptService = async (prompts: UserPrompt) => {
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login.");
  }

  const response = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prompts),
  });

  const contentType = response.headers.get("content-type");

  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      throw new Error("Gagal parsing respons JSON dari server.");
    }
  } else {
    const text = await response.text();
    throw new Error(`${text}`);
  }

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Terjadi kesalahan dari server."
    );
  }

  return data;
};

export const createThread = async (content: string) => {
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login.");
  }

  const response = await fetch(`${BASE_URL}/thread`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const contentType = response.headers.get("content-type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      throw new Error("Gagal parsing respons JSON dari server.");
    }
  } else {
    const text = await response.text();
    throw new Error(`${text}`);
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Gagal menyimpan thread.");
  }

  return data;
};

export const createComment = async (threadId: string, content: string) => {
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login.");
  }

  const response = await fetch(`${BASE_URL}/comment/${threadId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const contentType = response.headers.get("content-type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      throw new Error("Gagal parsing respons JSON dari server.");
    }
  } else {
    const text = await response.text();
    throw new Error(`${text}`);
  }

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Gagal menyimpan komentar."
    );
  }

  return data;
};
