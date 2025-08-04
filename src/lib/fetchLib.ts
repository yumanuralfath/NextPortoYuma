/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
interface FetchWithTokenOptions extends RequestInit {
  method?: string;
  contentType?: string;
  useToken?: boolean;
}

function getAccessToken(): string | undefined {
  return Cookies.get("accessToken");
}

function setAccessToken(token: string): string | undefined {
  return Cookies.set("accessToken", token, { expires: 1 });
}

function removeAccessToken(): void {
  Cookies.remove("accessToken");
}

const fetchwithToken = async (
  url: string,
  {
    method = "GET",
    contentType = "application/json",
    body,
    headers,
    useToken = true,
    ...rest
  }: FetchWithTokenOptions = {}
): Promise<Response> => {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (!isFormData && contentType) {
    finalHeaders["Content-Type"] = contentType;
  }

  if (useToken) {
    const token = getAccessToken();
    if (!token) throw new Error("Token tidak ditemukan. Silakan login.");
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    method,
    body,
    headers: finalHeaders,
    ...rest,
  });
};

const handleJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || response.statusText);
    }
    return data;
  }

  const text = await response.text();
  throw new Error(text || "Respons bukan JSON");
};

const getJsonWithToken = async (url: string, useToken: boolean = true) => {
  const response = await fetchwithToken(url, { method: "GET", useToken });
  return handleJsonResponse(response);
};

const postJsonWithToken = async (
  url: string,
  data: any,
  useToken: boolean = true
) => {
  const response = await fetchwithToken(url, {
    method: "POST",
    body: JSON.stringify(data),
    useToken,
  });
  return handleJsonResponse(response);
};

const putJsonWithToken = async (
  url: string,
  data: any,
  useToken: boolean = true
) => {
  const response = await fetchwithToken(url, {
    method: "PUT",
    body: JSON.stringify(data),
    useToken,
  });
  return handleJsonResponse(response);
};

const deleteJsonWithToken = async (url: string, useToken: boolean = true) => {
  const response = await fetchwithToken(url, {
    method: "DELETE",
    useToken,
  });
  if (response.status === 204) {
    return { success: true };
  }
  return handleJsonResponse(response);
};

export {
  getAccessToken,
  setAccessToken,
  fetchwithToken,
  removeAccessToken,
  getJsonWithToken,
  postJsonWithToken,
  putJsonWithToken,
  deleteJsonWithToken,
};
