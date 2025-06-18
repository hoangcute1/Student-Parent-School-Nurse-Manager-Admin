// Authentication utilities


const AUTH_TOKEN_KEY = "authToken";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token;
};

const setAuthToken = (token: string) => {
  if (typeof window === "undefined")
    return localStorage.setItem("token", token);
};

const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Function to logout
const logout = () => {
  clearAuthToken();
  window.location.href = "/";
};

export { getAuthToken, setAuthToken, clearAuthToken, logout };
