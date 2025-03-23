import useTheme from "@/hooks/useTheme";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import {
  Text,
  Divider,
  TextInput,
  Button,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useStore } from "@/stores/store";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";

// Import local headshot image
const headshotImage = require('@/assets/images/headshot.png');

const AccountSettingsScreen = () => {
  const { colors } = useTheme();
  const updatePreferences = useStore((state) => state.updatePreferences);
  const preferences = useStore((state) => state.preferences);

  const [displayName, setDisplayName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  
  // State for revealing masked fields
  const [revealEmail, setRevealEmail] = useState(false);
  const [revealPhone, setRevealPhone] = useState(false);
  
  // Get current profile background color index
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    preferences?.profileBackgroundColorIndex ?? 0
  );

  // Function to mask email
  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return email;
    const [username, domain] = email.split('@');
    return '•'.repeat(username.length) + '@' + domain;
  };

  // Function to mask phone number
  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    const lastFourDigits = phone.slice(-4);
    return '•'.repeat(phone.length - 4) + lastFourDigits;
  };

  const handleSave = () => {
    // Save user preferences including color
    updatePreferences({
      profileBackgroundColorIndex: selectedColorIndex,
    });
    
    console.log("Saving user information...");
  };

  const renderColorItem = ({ item, index }: { item: string; index: number }) => (
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primaryContainer }]}>
          <Image source={headshotImage} style={styles.avatar} />
        </View>
        <Button mode="outlined" style={styles.changePhotoButton}>
          Change Photo
        </Button>
      </View>

      <Divider style={styles.divider} />

      {/* Edit Profile Section */}
      <View style={styles.inputSection}>
        <TextInput
          label="DISPLAY NAME"
          value={displayName}
          onChangeText={setDisplayName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="USERNAME"
          value={username}
          onChangeText={setUsername}
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
        <View style={styles.sensitiveFieldWrapper}>
          <TextInput
            label="PHONE NUMBER"
            value={revealPhone ? phone : maskPhone(phone)}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TouchableOpacity onPress={() => setRevealPhone(!revealPhone)}>
            <Text style={[styles.revealText, { color: colors.primary }]}>
              {revealPhone ? "Hide" : "Reveal"}
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
    borderColor: 'rgba(0,0,0,0.1)',
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
