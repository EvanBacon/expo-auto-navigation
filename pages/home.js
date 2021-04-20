import * as React from "react";
import { Text, View } from "react-native";

import { TabBarIcon } from "../components/TabBarIcon";

export default function HomeScreen({ navigation }) {
  React.useLayoutEffect(() => {
    if (navigation)
      navigation.setOptions({
        title: "All Items",
        tabBarIcon: ({ color }) => <TabBarIcon name="basket" color={color} />,
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "bold" }}>
        Hello Home
      </Text>
    </View>
  );
}
