import * as React from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {

  React.useLayoutEffect(() => {
    if (navigation)
      navigation.setOptions({
        title: "Settings",

      })
  }, []);


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }} onPress={() => {
        // navigation.push('settings')
      }}>Hello Settings</Text>
    </View>
  );
}