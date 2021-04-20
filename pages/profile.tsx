import * as React from 'react';
import { Text, View } from 'react-native';

import { TabBarIcon } from '../components/TabBarIcon';

export default function HomeScreen({ navigation }) {
  React.useLayoutEffect(() => {
    if (navigation)
      navigation.setOptions({
        title: "Profile",
        tabBarIcon: ({ color }) => (
          <TabBarIcon name="person" color={color} />
        ),
      })
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 36, alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>Hello Profile</Text>
    </View>
  );
}