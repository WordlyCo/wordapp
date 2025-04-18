import useTheme from "@/src/hooks/useTheme";
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
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useStore } from "@/src/stores/store";
import { useUser } from "@clerk/clerk-expo";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AccountSettingsScreen = () => {
  const { colors } = useTheme();
  const updatePreferences = useStore((state) => state.updatePreferences);
  const preferences = useStore((state) => state.preferences);
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [revealEmail, setRevealEmail] = useState(false);

  const [selectedColorIndex, setSelectedColorIndex] = useState(
    preferences?.profileBackgroundColorIndex ?? 0
  );

  const maskEmail = (email: string) => {
    if (!email || !email.includes("@")) return email;
    const [username, domain] = email.split("@");
    return "•".repeat(username.length) + "@" + domain;
  };

  const handleSave = async () => {
    if (profileImage) {
      await uploadProfileImage();
    }

    updatePreferences({
      profileBackgroundColorIndex: selectedColorIndex,
    });
    user?.update({
      firstName,
      lastName,
    });
  };

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

      const imageType = profileImage.endsWith(".png") ? "png" : "jpeg";
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
      onPress={() => setSelectedColorIndex(index)}
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: colors.onBackground },
          ]}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={[styles.avatar, { backgroundColor: colors.onBackground }]}
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
        >
          Change Photo
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

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Save Changes
        </Button>
      </View>
    </ScrollView>
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
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
