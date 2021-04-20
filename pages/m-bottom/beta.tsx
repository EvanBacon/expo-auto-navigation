import * as React from 'react';
import { Text, View } from 'react-native';

export default function Screen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', fontWeight: 'bold' }} onPress={() => {
        navigation.navigate('alpha')
      }}>Hello Beta</Text>
    </View>
  );
}