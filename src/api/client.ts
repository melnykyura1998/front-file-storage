import axios from "axios";

const viteEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;

export const api = axios.create({
  baseURL: viteEnv?.VITE_API_URL ?? "http://localhost:3000",
});

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(path, api.defaults.baseURL).toString();
}

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("drive_token", token);
    return;
  }

  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem("drive_token");
}
