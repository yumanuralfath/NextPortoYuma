import Cookies from "js-cookie";

function getAccessToken(): string | undefined {
  return Cookies.get("accessToken");
}

function setAccessToken(token: string): string | undefined {
  return Cookies.set("accessToken", token, { expires: 1 });
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const fetchwithToken = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

function removeAccessToken(): void {
  Cookies.remove("accessToken");
}

export { getAccessToken, setAccessToken, fetchwithToken, removeAccessToken };
