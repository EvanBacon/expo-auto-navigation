import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AutoNavigator from "./lazy/RemoteNavigator";

export default () => (
  <NavigationContainer>
    <AutoNavigator />
  </NavigationContainer>
);
