import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AppTabs from "./AppTabs";
import AuthStack from "./AuthStack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <AppTabs /> : <AuthStack />;
};

export default RootNavigator;
