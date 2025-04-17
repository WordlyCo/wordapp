import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Switch,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import useTheme from "../../src/hooks/useTheme";
import * as FileSystem from "expo-file-system";
import timezones from "../../src/utils/timezones";
import { useStore } from "@/src/stores/store";
import DropDownPicker from "react-native-dropdown-picker";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { colors, theme } = useTheme();

  const setHasOnboarded = useStore((state) => state.setHasOnboarded);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [darkMode, setDarkMode] = useState(theme?.dark || false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bio, setBio] = useState("");
  
  // Dropdown picker state
  const [open, setOpen] = useState(false);
  const [timezoneItems, setTimezoneItems] = useState(
    timezones.map(tz => ({ label: tz, value: tz }))
  );

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

      setHasOnboarded(true);
      router.replace("/");
    } catch (error) {
      setError("Failed to update profile: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
    router.replace("/");
  };

  const setLocalTimezone = () => {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(localTimezone);
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
            <DropDownPicker
              open={open}
              value={timezone}
              items={timezoneItems}
              setOpen={setOpen}
              setValue={setTimezone}
              setItems={setTimezoneItems}
              style={[styles.dropdownStyle, { backgroundColor: colors.surfaceVariant }]}
              textStyle={{ color: colors.onSurface }}
              dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: colors.surfaceVariant }]}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              searchable={true}
              searchPlaceholder="Search for a timezone..."
            />
            <Button
              mode="outlined"
              onPress={setLocalTimezone}
              style={{ marginTop: 16 }}
            >
              Set to Local Timezone
            </Button>
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
            onPress={handleSkip}
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
    zIndex: 100, // Needed for the dropdown to show properly
  },
  dropdownStyle: {
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 50,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 4,
    maxHeight: 200,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 50, // Add extra margin to avoid overlap with dropdown
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