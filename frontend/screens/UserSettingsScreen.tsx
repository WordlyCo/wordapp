import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Divider, List, TextInput, Button } from 'react-native-paper';

const UserSettingsScreen = () => {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');

  const handleSave = () => {
    // Handle saving user information
    console.log('Saving user information...');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={120}
          source={require('../assets/images/headshot.png')}
          style={styles.avatar}
        />
        <Button mode="outlined" style={styles.changePhotoButton}>
          Change Photo
        </Button>
      </View>

      <Divider style={styles.divider} />

      {/* Edit Profile Section */}
      <View style={styles.inputSection}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.saveButton}
        >
          Save Changes
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
  changePhotoButton: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  inputSection: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default UserSettingsScreen; 