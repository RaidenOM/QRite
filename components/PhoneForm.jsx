import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function PhoneForm({ onGenerate }) {
  const [phone, setPhone] = useState('');

  const data = `tel:${phone}`;

  return (
    <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'Phone'}
        placeholder="+1 123-456-789"
        value={phone}
        onChangeText={setPhone}
        multiline
        numberOfLines={10}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          onGenerate(data);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
