export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("access_token"); // ✅ FIXED

  if (!token) {
    window.location.href = "/login";
    throw new Error("No token found. Please login.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`, // ✅ ALWAYS SEND
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (response.status === 403) {
    throw new Error("Access denied. HR role required.");
  }

  return response;
};
