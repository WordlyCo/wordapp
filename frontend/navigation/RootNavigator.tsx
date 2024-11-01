import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;
