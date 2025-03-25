import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useTheme from "@/hooks/useTheme";
import StickyHeader from "@/components/StickyHeader";
import { useStore } from "@/stores/store";
import { PROFILE_BACKGROUND_COLORS } from "@/constants/profileColors";

// Import local headshot image
const headshotImage = require('@/assets/images/headshot.png');

type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  AccountSettings: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('Stats');
  
  // Get profile background color from user preferences
  const profileBackgroundColorIndex = useStore(
    (state) => state.preferences?.profileBackgroundColorIndex ?? 0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StickyHeader />
      
      <ScrollView>
        {/* Profile Background */}
        <View 
          style={[
            styles.profileBackground, 
            { backgroundColor: PROFILE_BACKGROUND_COLORS[profileBackgroundColorIndex] }
          ]}
        >
          {/* Settings Icon on top of background */}
          <View style={styles.profileHeader}>
            <View style={{ flex: 1 }} />
            <IconButton
              icon="cog"
              size={24}
              iconColor="white"
              onPress={() => navigation.navigate("Settings")}
              style={styles.settingsButton}
            />
          </View>
        </View>
        
        {/* Profile Card - positioned to overlap the background */}
        <View style={styles.profileCard}>
          {/* Profile Image */}
          <View style={[styles.avatarContainer, { 
            backgroundColor: colors.primaryContainer,
            marginTop: -60, // Lift avatar up to overlap with background
          }]}>
            <Image
              source={headshotImage}
              style={styles.avatar}
            />
          </View>
          
          {/* User Info */}
          <Text style={[styles.userName, { color: colors.onSurface }]}>John Doe</Text>
          <Text style={[styles.userTitle, { color: colors.onSurfaceVariant }]}>Product Designer</Text>
          <Text style={[styles.userLocation, { color: colors.onSurfaceVariant }]}>Los Angeles, CA</Text>
          
          {/* User Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>205</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>178</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Following</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.actionButtonLabel}
              onPress={() => navigation.navigate("AccountSettings" as never)}
            >
              Edit Profile
            </Button>
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.actionButtonLabel}
            >
              Add Friends
            </Button>
          </View>
          
          {/* Tab Selection */}
          <View style={[styles.tabContainer, { borderBottomColor: colors.outline }]}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'Stats' && styles.activeTab, 
                activeTab === 'Stats' && { borderBottomColor: colors.primary }]} 
              onPress={() => setActiveTab('Stats')}>
              <Text style={[
                styles.tabText, 
                { color: colors.onSurfaceVariant },
                activeTab === 'Stats' && styles.activeTabText,
                activeTab === 'Stats' && { color: colors.primary }
              ]}>
                Stats
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content Area */}
          <View style={styles.contentArea}>
            {/* Content will be added here */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileBackground: {
    height: 150,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)', // Subtle border at the bottom
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)', // Subtle border at the top
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 10,
  },
  settingsButton: {
    margin: 0,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: -40, // Pull card up to overlap with background
  },
  avatarContainer: {
    marginBottom: 15,
    borderRadius: 100,
    padding: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  actionButtonLabel: {
    color: 'white',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // Color will be set dynamically
  },
  tabText: {
    // Color will be set dynamically
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  contentArea: {
    width: '100%',
    minHeight: 300,
  },
});

export default ProfileScreen;
