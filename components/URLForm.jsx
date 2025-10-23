import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import validator from 'validator';

export default function URLForm({ onGenerate }) {
  const [url, setUrl] = useState('');
  return (
    <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'URL'}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={async () => {
          if (url.trim() && validator.isURL(url)) {
            await onGenerate(url);
          } else {
            Alert.alert('Invalid URL', 'Please enter a valid URL.');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
