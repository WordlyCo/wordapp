import { formatTimezone, timezones } from "@/lib/utils";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useStore } from "@/src/stores/store";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomSnackbar } from "@/src/components/CustomSnackbar";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { colors } = useAppTheme();

  const setHasOnboarded = useStore((state) => state.setHasOnboarded);
  const preferences = useStore((state) => state.user?.preferences);
  const updatePreferences = useStore((state) => state.updatePreferences);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bio, setBio] = useState("");

  // Dropdown-picker state
  const [open, setOpen] = useState(false);
  const [timezoneItems, setTimezoneItems] = useState(
    timezones.map((tz: string) => ({
      label: formatTimezone(tz),
      value: tz,
    }))
  );

  const fetchMe = useStore((state) => state.getMe);
  const isFetchingUser = useStore((state) => state.isFetchingUser);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (!isFetchingUser) fetchMe();
  }, [isFetchingUser]);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");

      const userTz = user.unsafeMetadata?.timezone as string;
      if (userTz) {
        setTimezone(userTz);
      } else {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      }
    }
  }, [isLoaded, user]);

  const handleThemeChange = () => {
    updatePreferences({
      theme: preferences?.theme === "dark" ? "light" : "dark",
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setSnackbarMessage("Media library access is required");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets.length) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage) return null;
    const base64 = await FileSystem.readAsStringAsync(profileImage, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const ext = profileImage.endsWith(".png") ? "png" : "jpeg";
    const dataUrl = `data:image/${ext};base64,${base64}`;
    await user?.setProfileImage({ file: dataUrl });
    return profileImage;
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user) return;
    setIsSubmitting(true);
    try {
      if (profileImage) await uploadProfileImage();
      await user.update({ firstName, lastName });

      const oldPreferences = Object.assign({}, user.unsafeMetadata.preferences);

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: {
            ...oldPreferences,
            timezone,
            theme: preferences?.theme === "dark" ? "light" : "dark",
          },
        },
      });
      setSnackbarMessage("Setup complete!");
      setSnackbarType("success");
      setSnackbarVisible(true);
      setHasOnboarded(true);
      router.replace("/");
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : String(err));
      setSnackbarType("error");
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
    router.replace("/");
  };

  const setLocalTimezone = () => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  };

  if (!isLoaded) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
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

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: profileImage || user?.imageUrl,
                }}
                style={styles.profileImage}
              />
              <Button
                mode="contained"
                onPress={pickImage}
                style={styles.uploadButton}
              >
                Choose Photo
              </Button>
            </View>

            {/* Name & Bio */}
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
            <TextInput
              mode="outlined"
              label="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.pickerContainer}>
              <DropDownPicker
                open={open}
                value={timezone}
                items={timezoneItems}
                setOpen={setOpen}
                setValue={setTimezone}
                setItems={setTimezoneItems}
                placeholder="Select timezone..."
                searchable={true}
                searchPlaceholder="Search..."
                listMode="SCROLLVIEW"
                style={{
                  backgroundColor: colors.background,
                  borderColor: open ? colors.primary : colors.outline,
                  height: 56,
                }}
                textStyle={{ color: colors.onSurface, fontSize: 16 }}
                placeholderStyle={{ color: colors.onSurface }}
                dropDownContainerStyle={{
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  maxHeight: 250,
                }}
                labelStyle={{ fontSize: 16 }}
                listItemContainerStyle={{ paddingVertical: 8 }}
                searchContainerStyle={{
                  borderBottomColor: colors.primary,
                }}
                searchTextInputStyle={{
                  color: colors.onSurface,
                  borderWidth: 0,
                }}
                ArrowDownIconComponent={() => (
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={24}
                    color={colors.primary}
                  />
                )}
                ArrowUpIconComponent={() => (
                  <MaterialCommunityIcons
                    name="chevron-up"
                    size={24}
                    color={colors.primary}
                  />
                )}
                zIndex={9999}
                zIndexInverse={9999}
              />
            </View>

            <Button
              mode="contained"
              onPress={setLocalTimezone}
              style={{ marginTop: 16 }}
            >
              Set to Local Timezone
            </Button>
          </View>

          {/* Theme Switch */}
          <View style={styles.themeContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={
                  preferences?.theme === "dark"
                    ? "weather-night"
                    : "weather-sunny"
                }
                size={24}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text variant="bodyMedium">Theme</Text>
            </View>
            <Switch
              value={preferences?.theme === "dark"}
              onValueChange={handleThemeChange}
              color={colors.primary}
            />
          </View>

          {/* Submit / Skip */}
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
            style={{ marginTop: 10, marginBottom: 20 }}
          >
            Skip for Now
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    gap: 15,
    paddingHorizontal: 24,
    paddingVertical: 20,
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
  uploadButton: {
    marginTop: 10,
  },
  input: {
    width: "100%",
  },
  pickerContainer: {
    width: "100%",
    marginTop: 8,
    zIndex: 9999,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 16,
  },
  submitButton: {
    marginTop: 24,
  },
  buttonContent: {
    height: 48,
  },
});
