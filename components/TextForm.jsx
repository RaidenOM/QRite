import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function ({ onGenerate }) {
  const [text, setText] = useState('');

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'Text'}
        placeholder="Enter Text"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={10}
        style={{ minHeight: 200, maxHeight: 200 }}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          if (text) {
            onGenerate(text);
          } else {
            Alert.alert('Empty Text', 'Text cannot be empty.');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
