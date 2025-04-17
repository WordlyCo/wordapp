import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Switch,
  IconButton,
  Menu,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import useTheme from "../../src/hooks/useTheme";
import * as FileSystem from "expo-file-system";
import timezones from "../../src/utils/timezones";
import { useStore } from "@/src/stores/store";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { colors, theme } = useTheme();
  const timezoneInputRef = useRef<any>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const setHasOnboarded = useStore((state) => state.setHasOnboarded);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [darkMode, setDarkMode] = useState(theme?.dark || false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimezoneMenu, setShowTimezoneMenu] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      
      const userTimezone = user.unsafeMetadata?.timezone as string;
      if (userTimezone) {
        setTimezone(userTimezone);
      } else {
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(localTimezone);
      }
      
      const themePreference = user.unsafeMetadata?.theme as string;
      if (themePreference) {
        setDarkMode(themePreference === "dark");
      }
    }
  }, [isLoaded, user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      setError("Permission to access media library is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage) return null;
    
    try {
      const base64Image = await FileSystem.readAsStringAsync(profileImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Add data URL prefix to the base64 string
      const imageType = profileImage.endsWith('.png') ? 'png' : 'jpeg';
      const formattedBase64 = `data:image/${imageType};base64,${base64Image}`;
      
      await user?.setProfileImage({
        file: formattedBase64,
      });
      
      return profileImage;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (profileImage) {
        await uploadProfileImage();
      }

      await user.update({
        firstName,
        lastName,
      });

      await user.update({
        unsafeMetadata: {
          timezone,
          theme: darkMode ? "dark" : "light",
        },
      });

      await setHasOnboarded(true);
      router.replace("/");
    } catch (error) {
      setError("Failed to update profile: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showTimezonePicker = () => {
    if (timezoneInputRef.current) {
      timezoneInputRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setMenuPosition({ x, y: y + height });
        setShowTimezoneMenu(true);
      });
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            Complete Your Profile
          </Text>
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center", marginTop: 10 }}
          >
            Let's set up your account preferences
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text variant="bodyMedium" style={styles.errorText}>
              {error}
            </Text>
            <IconButton
              icon="close"
              size={20}
              onPress={() => setError(null)}
            />
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={[
                  styles.profileImagePlaceholder,
                  { backgroundColor: colors.surfaceVariant },
                ]}
              >
                <Text style={{ fontSize: 40, color: colors.onSurfaceVariant }}>
                  {firstName && lastName
                    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                    : "?"}
                </Text>
              </View>
            )}
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.uploadButton}
            >
              Choose Photo
            </Button>
          </View>

          <TextInput
            mode="outlined"
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              Timezone
            </Text>
            <View
              style={[
                styles.pickerWrapper,
                { borderColor: colors.outline, backgroundColor: colors.surfaceVariant },
              ]}
            >
              <TextInput
                ref={timezoneInputRef}
                mode="outlined"
                label="Select Timezone"
                value={timezone}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon="menu-down"
                    onPress={showTimezonePicker}
                  />
                }
                onPressIn={showTimezonePicker}
              />
              <Menu
                visible={showTimezoneMenu}
                onDismiss={() => setShowTimezoneMenu(false)}
                anchor={menuPosition}
                style={styles.menu}
              >
                <ScrollView style={{ maxHeight: 300 }}>
                  {timezones.map((tz) => (
                    <Menu.Item
                      key={tz}
                      onPress={() => {
                        setTimezone(tz);
                        setShowTimezoneMenu(false);
                      }}
                      title={tz}
                    />
                  ))}
                </ScrollView>
              </Menu>
              <Button
                mode="outlined"
                onPress={() => {
                  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  setTimezone(localTimezone);
                }}
                style={{ marginTop: 8 }}
              >
                Set to Local Timezone
              </Button>
            </View>
          </View>

          <View style={styles.themeContainer}>
            <Text variant="bodyMedium">Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color={colors.primary}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Profile
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.replace("/")}
            style={{ marginTop: 10 }}
          >
            Skip for Now
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scrollViewContainer: {
    flexGrow: 1,
    gap: 15,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "200",
  },
  formContainer: {
    gap: 16,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    marginTop: 10,
  },
  input: {
    width: "100%",
  },
  pickerContainer: {
    width: "100%",
  },
  pickerWrapper: {
    borderRadius: 4,
    padding: 4,
  },
  menu: {
    width: '100%',
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  buttonContent: {
    height: 48,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgb(255 13 93)",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  errorText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
}); 