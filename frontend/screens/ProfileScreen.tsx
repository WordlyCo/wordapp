import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, List, Avatar, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type ProfileStackParamList = {
  ProfileMain: undefined;
  UserSettingsScreen: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  PrivacyPolicy: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout } = useContext(AuthContext);
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={120}
          source={require('../assets/images/headshot.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Menu Items */}
      <List.Section>
        <List.Item
          title="Your Profile"
          left={props => <List.Icon {...props} icon="account-cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('UserSettingsScreen')}
        />
        <List.Item
          title="Settings"
          left={props => <List.Icon {...props} icon="cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Settings')}
        />
        <List.Item
          title="Payment Methods"
          left={props => <List.Icon {...props} icon="credit-card" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* Handle navigation */}}
        />
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <List.Item
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
      </List.Section>

      <Divider style={styles.divider} />

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button 
          icon="logout" 
          mode="contained" 
          onPress={logout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#5856D6',
  },
});

export default ProfileScreen;