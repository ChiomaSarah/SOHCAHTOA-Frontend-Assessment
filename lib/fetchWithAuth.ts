let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.accessToken;
}

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(async (newToken: string) => {
        const retryRes = await fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        resolve(retryRes);
      });
    });
  }

  isRefreshing = true;

  const newToken = await refreshAccessToken();

  if (!newToken) {
    isRefreshing = false;
    refreshQueue = [];
    await logout();
    return res;
  }

  refreshQueue.forEach((callback) => callback(newToken));
  refreshQueue = [];
  isRefreshing = false;

  res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  });

  return res;
}
