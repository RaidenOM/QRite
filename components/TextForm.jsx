import { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AppContext } from '../store/AppContext';

export default function ({ onGenerate, style }) {
  const [text, setText] = useState('');
  const { showAlert } = useContext(AppContext);

  return (
    <View style={style}>
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
          if (text.trim()) {
            onGenerate(text);
          } else {
            showAlert('Empty text', 'Text cannot be empty');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
