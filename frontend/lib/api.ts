import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;
let tokenRefreshPromise: Promise<string | null> | null = null;

let getClerkToken: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (fn: () => Promise<string | null>) => {
  getClerkToken = fn;
};

export const updateCachedToken = (token: string | null): void => {
  if (token) {
    cachedToken = token;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp) {
        tokenExpiryTime = payload.exp * 1000 - 1 * 60 * 1000;
      } else {
        tokenExpiryTime = Date.now() + 5 * 60 * 1000;
      }
    } catch (e) {
      tokenExpiryTime = Date.now() + 5 * 60 * 1000;
    }
  } else {
    clearCachedToken();
  }
};

export const clearCachedToken = (): void => {
  cachedToken = null;
  tokenExpiryTime = 0;
  tokenRefreshPromise = null;
};

export const getCachedToken = async (): Promise<string | null> => {
  if (cachedToken && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  if (getClerkToken) {
    tokenRefreshPromise = getClerkToken()
      .then((newToken) => {
        if (newToken) {
          updateCachedToken(newToken);
          return newToken;
        }
        return null;
      })
      .catch((error) => {
        console.error("Failed to refresh token:", error);
        clearCachedToken();
        return null;
      })
      .finally(() => {
        tokenRefreshPromise = null;
      });

    return tokenRefreshPromise;
  }

  return null;
};

export const getToken = async (): Promise<string | null> => {
  return getCachedToken();
};

export const authFetch = async (
  url: string,
  options?: RequestInit,
  retryCount: number = 3,
  initialDelay: number = 1000
): Promise<Response> => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No token found. Please sign in again.");
    }

    const headers = {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearCachedToken();

      if (getClerkToken) {
        const newToken = await getClerkToken();
        if (newToken) {
          updateCachedToken(newToken);

          const retryResponse = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          if (retryResponse.status === 401 && retryCount > 0) {
            await new Promise((resolve) => setTimeout(resolve, initialDelay));

            return authFetch(url, options, retryCount - 1, initialDelay * 2);
          } else if (retryResponse.status === 401) {
            throw new Error(
              "Authentication failed even after token refresh and retries."
            );
          }

          return retryResponse;
        }
      }

      throw new Error("Authentication token expired. Please sign in again.");
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
