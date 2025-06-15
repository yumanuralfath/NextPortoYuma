import BASE_URL from "./baseUrl";
import { getJsonWithToken, postJsonWithToken } from "./fetchLib";
import { withErrorHandler } from "./withErrorHandler";

interface UserPrompt {
  prompt: string;
}

export const promptService = async (prompts: UserPrompt) => {
  return await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/generate`, prompts),
    "Error to connect AI"
  );
  // const token = getAccessToken();
  // if (!token) {
  //   throw new Error("Token tidak ditemukan. Silakan login.");
  // }
  // const response = await fetch(`${BASE_URL}/generate`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(prompts),
  // });
  // const contentType = response.headers.get("content-type");
  // let data: any = null;
  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }
  // if (!response.ok) {
  //   throw new Error(
  //     data?.error || data?.message || "Terjadi kesalahan dari server."
  //   );
  // }
  // return data;
};

export const createThread = async (content: string) => {
  return await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/thread`, content),
    "Error when create thread"
  );
  // const token = getAccessToken();
  // if (!token) {
  //   throw new Error("Token tidak ditemukan. Silakan login.");
  // }

  // const response = await fetch(`${BASE_URL}/thread`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({ content }),
  // });

  // const contentType = response.headers.get("content-type");
  // let data: any = null;

  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }

  // if (!response.ok) {
  //   throw new Error(data?.error || data?.message || "Gagal menyimpan thread.");
  // }

  // return data;
};

export const createComment = async (threadId: string, content: string) => {
  return await withErrorHandler(
    () => postJsonWithToken(`${BASE_URL}/commennt/${threadId}`, content),
    "Error when save result"
  );
  // const token = getAccessToken();
  // if (!token) {
  //   throw new Error("Token tidak ditemukan. Silakan login.");
  // }

  // const response = await fetch(`${BASE_URL}/comment/${threadId}`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({ content }),
  // });

  // const contentType = response.headers.get("content-type");
  // let data: any = null;

  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }

  // if (!response.ok) {
  //   throw new Error(
  //     data?.error || data?.message || "Gagal menyimpan komentar."
  //   );
  // }

  // return data;
};

export const getRandomThreads = async () => {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/threads`, false),
    "Error when get thread AI result"
  );
  // const response = await fetch(`${BASE_URL}/threads`, {
  //   method: "GET",
  //   headers: {
  //     "content-Type": "application/json",
  //   },
  // });

  // const contentType = response.headers.get("content-type");
  // let data: any = null;

  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }

  // if (!response.ok) {
  //   throw new Error(
  //     data?.error || data?.message || "Gagal menyimpan komentar."
  //   );
  // }

  // return data;
};

export const getCommentbyThreadID = async (threadId: number) => {
  return await withErrorHandler(
    () => getJsonWithToken(`${BASE_URL}/comments/${threadId}`, false),
    "Error Get AI Response"
  );

  // const response = await fetch(`${BASE_URL}/comments/${threadId}`, {
  //   method: "GET",
  //   headers: {
  //     "content-Type": "application/json",
  //   },
  // });

  // const contentType = response.headers.get("content-type");
  // let data: any = null;

  // if (contentType && contentType.includes("application/json")) {
  //   try {
  //     data = await response.json();
  //   } catch {
  //     throw new Error("Gagal parsing respons JSON dari server.");
  //   }
  // } else {
  //   const text = await response.text();
  //   throw new Error(`${text}`);
  // }

  // if (!response.ok) {
  //   throw new Error(
  //     data?.error || data?.message || "Gagal menyimpan komentar."
  //   );
  // }

  // return data;
};
