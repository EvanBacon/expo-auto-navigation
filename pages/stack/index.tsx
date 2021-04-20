import * as React from 'react';
import { Text, View } from 'react-native';

export default function Screen({ navigation, route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Screen ' + (route.params?.index || 0)
    })
  }, [navigation])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }} onPress={() => {
        navigation.push('index', { index: (route.params?.index || 0) + 1 })
      }}>Push Next</Text>
    </View>
  );
}