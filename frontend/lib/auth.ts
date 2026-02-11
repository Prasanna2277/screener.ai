export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return response;
}
