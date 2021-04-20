import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AutoNavigator from "./lib/RemoteNavigator";

export default () => (
  <NavigationContainer>
    <AutoNavigator />
  </NavigationContainer>
);
