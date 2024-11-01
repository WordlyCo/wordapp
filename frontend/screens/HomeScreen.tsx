import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Text variant="headlineSmall">Home Screen</Text>
      <Button icon="logout" mode="contained" onPress={logout}>
        Logout
      </Button>
    </View>
  );
};

export default HomeScreen;
