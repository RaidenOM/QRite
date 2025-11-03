import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function SMSForm({ onGenerate, style }) {
  const [recipient, setRecepient] = useState('');
  const [body, setBody] = useState('');

  const data = `sms:${recipient}?body=${body}`;

  return (
    <View style={style}>
      <TextInput
        mode="outlined"
        label={'Recipient'}
        placeholder="Enter Recipient"
        value={recipient}
        onChangeText={setRecepient}
        multiline
        numberOfLines={10}
      />
      <TextInput
        mode="outlined"
        label={'Body'}
        placeholder="Enter Body"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={10}
      />

      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={async () => {
          onGenerate(data);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
