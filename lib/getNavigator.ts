import * as React from "react";

// rip bundle size
export function getNavigator(name: string) {
  if (name === "bottom-tabs")
    return require("@react-navigation/bottom-tabs").createBottomTabNavigator;
  if (name === "drawer")
    return require("@react-navigation/drawer").createDrawerNavigator;
  if (name === "stack")
    return require("@react-navigation/stack").createStackNavigator;
  if (name === "native-stack")
    return require("@react-navigation/stack").createStackNavigator;
  if (name === "material-top-tabs")
    return require("@react-navigation/material-top-tabs")
      .createMaterialTopTabNavigator;
  if (name === "material-bottom-tabs")
    return require("@react-navigation/material-bottom-tabs")
      .createMaterialBottomTabNavigator;
  if (name === "native-stack")
    return require("react-native-screens/native-stack")
      .createNativeStackNavigator;
  throw new Error("unknown navigator type: " + name);
}

export function useNavigator(name: string) {
  return React.useMemo(() => getNavigator(name)(), [name]);
}
