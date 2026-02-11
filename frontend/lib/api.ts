const API_BASE = "http://127.0.0.1:8000";

export async function apiRequest(
  url: string,
  method: string,
  body?: any,
  token?: string
) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Something went wrong");
  }

  return res.json();
}
