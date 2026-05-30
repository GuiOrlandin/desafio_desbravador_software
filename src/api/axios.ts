import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  return headers;
}

const api = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: getHeaders(),
});

export default api;
