import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { Button } from "react-native-paper";
import { updateCachedToken } from "@/lib/api";
import { API_URL } from "@/lib/api";

export default function TestAuthPage() {
  const { getToken, userId, isSignedIn } = useClerkAuth();
  const [token, setToken] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      setLoading(true);
      const newToken = await getToken();
      setToken(newToken);

      // Update token in cache
      updateCachedToken(newToken);

      // Decode token
      if (newToken) {
        // Split the token and get the payload part (second part)
        const parts = newToken.split(".");
        if (parts.length >= 2) {
          // Decode the payload
          const payload = JSON.parse(atob(parts[1]));
          setTokenInfo(payload);
        }
      }
    } catch (err: any) {
      setError(`Error fetching token: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("No token available");
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setApiResponse(data);

      if (!response.ok) {
        setError(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setError(`API Request Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchToken();
    }
  }, [isSignedIn]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Auth Debug Page</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Clerk Status</Text>
        <Text>Signed In: {isSignedIn ? "Yes" : "No"}</Text>
        <Text>User ID: {userId || "None"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Token</Text>
        <Button
          mode="contained"
          onPress={fetchToken}
          style={styles.button}
          loading={loading}
        >
          Refresh Token
        </Button>

        {token ? (
          <Text style={styles.tokenText} numberOfLines={3}>
            {token.substring(0, 20)}...
          </Text>
        ) : (
          <Text>No token available</Text>
        )}
      </View>

      {tokenInfo && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Token Info</Text>
          <Text style={styles.infoText}>Subject: {tokenInfo.sub}</Text>
          <Text style={styles.infoText}>Issuer: {tokenInfo.iss}</Text>
          <Text style={styles.infoText}>
            Expiration: {new Date(tokenInfo.exp * 1000).toLocaleString()}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.subtitle}>API Test</Text>
        <Button
          mode="contained"
          onPress={testApi}
          style={styles.button}
          loading={loading}
        >
          Test /users/me API
        </Button>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {apiResponse && (
          <View style={styles.apiResponse}>
            <Text style={styles.label}>API Response:</Text>
            <Text style={styles.apiResponseText}>
              {JSON.stringify(apiResponse, null, 2)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    marginVertical: 8,
  },
  tokenText: {
    fontFamily: "monospace",
    fontSize: 12,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  infoText: {
    marginBottom: 4,
  },
  apiResponse: {
    marginTop: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  apiResponseText: {
    fontFamily: "monospace",
    fontSize: 12,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    marginVertical: 8,
  },
});
