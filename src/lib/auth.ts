import BASE_URL from "./baseUrl";

interface userDataProps {
  email: string;
  password: string;
  username: string;
}

interface credentialsProps {
  email: string;
  password: string;
}

export const loginService = async (credentials: credentialsProps) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login Failed');
  }

  return data;
};

export const registerService = async (userData: userDataProps) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed Register');
  }

  return data;
};