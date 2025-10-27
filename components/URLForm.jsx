import { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import validator from 'validator';
import { AppContext } from '../store/AppContext';

export default function URLForm({ onGenerate, style }) {
  const [url, setUrl] = useState('');
  const { showAlert } = useContext(AppContext);

  return (
    <View style={style}>
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
            showAlert('Invalid URL', 'Please enter a valid URL');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
