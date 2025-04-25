import { useAppTheme } from "@/src/contexts/ThemeContext";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Text,
  Divider,
  TextInput,
  Button,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useStore } from "@/src/stores/store";
import { useUser } from "@clerk/clerk-expo";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AccountSettingsScreen = () => {
  const { colors } = useAppTheme();
  const updatePreferences = useStore((state) => state.updatePreferences);
  const preferences = useStore((state) => state.user?.preferences);
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [revealEmail, setRevealEmail] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [selectedColorIndex, setSelectedColorIndex] = useState(
    preferences?.profileBackgroundColorIndex ?? 0
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return email;
    const [username, domain] = email.split("@");
    return "•".repeat(username.length) + "@" + domain;
  };

  const handleSave = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
      });
      showToast("Profile information saved successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("Failed to save profile information");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setError("Permission to access media library is required");
      showToast("Permission to access media library is required");
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
      uploadProfileImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async (
    imageUri: string
  ): Promise<string | null> => {
    if (!imageUri) return null;

    setIsUploading(true);
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imageType = imageUri.endsWith(".png") ? "png" : "jpeg";
      const formattedBase64 = `data:image/${imageType};base64,${base64Image}`;

      await user?.setProfileImage({
        file: formattedBase64,
      });

      showToast("Profile photo updated successfully");
      return imageUri;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      showToast("Failed to upload profile photo");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index);
    // Auto-save the color preference immediately
    updatePreferences({
      profileBackgroundColorIndex: index,
    });
    showToast("Profile background color updated");
  };

  const renderColorItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.colorItem,
        { backgroundColor: PROFILE_BACKGROUND_COLORS[index] },
        selectedColorIndex === index && styles.selectedColorItem,
      ]}
      onPress={() => handleColorSelect(index)}
    >
      {selectedColorIndex === index && (
        <FontAwesome name="check" size={16} color="white" />
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (isLoaded) {
      setFirstName(user?.firstName ?? "");
      setLastName(user?.lastName ?? "");
      setEmail(user?.emailAddresses[0].emailAddress ?? "");
      setUsername(user?.username ?? "");
      setProfileImage(user?.imageUrl ?? null);
      // setBio(user?.unsafeMetadata?.bio ?? "");
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.onBackground },
            ]}
          >
            {isUploading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={styles.uploadingIndicator}
              />
            ) : profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={[
                  styles.avatar,
                  { backgroundColor: colors.onBackground },
                ]}
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={80}
                color={colors.primary}
              />
            )}
          </View>
          <Button
            mode="outlined"
            style={styles.changePhotoButton}
            onPress={pickImage}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Edit Profile Section */}
        <View style={styles.inputSection}>
          <TextInput
            label="USERNAME"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            multiline={true}
            numberOfLines={5}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.sensitiveFieldWrapper}>
            <TextInput
              label="EMAIL"
              value={revealEmail ? email : maskEmail(email)}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity onPress={() => setRevealEmail(!revealEmail)}>
              <Text style={[styles.revealText, { color: colors.primary }]}>
                {revealEmail ? "Hide" : "Reveal"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Background Color Section */}
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Profile Background
          </Text>

          <FlatList
            data={PROFILE_BACKGROUND_COLORS}
            renderItem={renderColorItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorList}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Profile Info
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={toastVisible}
        onDismiss={hideToast}
        duration={3000}
        action={{
          label: "Close",
          onPress: hideToast,
        }}
      >
        {toastMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    borderRadius: 100,
    padding: 4,
    width: 128,
    height: 128,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadingIndicator: {
    position: "absolute",
  },
  changePhotoButton: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  inputSection: {
    padding: 20,
    gap: 15,
  },
  input: {
    marginBottom: 5,
  },
  sensitiveFieldWrapper: {
    marginBottom: 8,
  },
  revealText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "left",
    marginTop: 2,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  colorList: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  selectedColorItem: {
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default AccountSettingsScreen;
