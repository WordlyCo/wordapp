import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const USER_TOKEN_KEY = "user_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const getToken = async () => {
  const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
  return token;
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(USER_TOKEN_KEY, token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(USER_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  return refreshToken;
};

export const setRefreshToken = async (refreshToken: string) => {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeRefreshToken = async () => {
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const authFetch = async (
  url: string,
  options?: RequestInit,
  isFirstTime: boolean = true
): Promise<Response> => {
  try {
    if (!isFirstTime) {
      removeToken();
      removeRefreshToken();
    }

    const token = await getToken();
    const refreshToken = await getRefreshToken();

    if (!token) {
      throw new Error("No token found");
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

    const copiedResponse = response.clone();
    const copiedResponseJson = await copiedResponse.json();
    const success = copiedResponseJson.success;
    const errorCode = copiedResponseJson.errorCode;
    const message = copiedResponseJson.message;

    if (response.status === 401 && refreshToken) {
      const newTokenResponse = await fetch(`${API_URL}/users/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
      const data = await newTokenResponse.json();
      const newToken = data.token;
      if (newToken) {
        await setToken(newToken);
        return authFetch(
          url,
          {
            ...options,
            headers: { ...headers, Authorization: `Bearer ${newToken}` },
          },
          false
        );
      }
      throw new Error("Failed to refresh token");
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
