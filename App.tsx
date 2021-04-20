import * as React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import AutoNavigator from "./lib/RemoteNavigator";

export default () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <AutoNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);
