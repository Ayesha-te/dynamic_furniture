const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Try refresh once
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        const r = await fetch(`${API_BASE}/accounts/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
        if (r.ok) {
          const tokens = await r.json();
          if (tokens.access) {
            localStorage.setItem("access_token", tokens.access);
            // retry original request with new token
            const retryHeaders = {
              "Content-Type": "application/json",
              ...(options.headers as Record<string, string>),
              Authorization: `Bearer ${tokens.access}`,
            };
            const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers: retryHeaders });
            const retryData = await retryRes.json().catch(() => null);
            if (!retryRes.ok) throw { status: retryRes.status, data: retryData };
            return retryData;
          }
        }
      } catch (e) {
        // fall through to clear tokens
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export default apiFetch;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path: string) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
