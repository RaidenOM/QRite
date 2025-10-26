import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function EmailForm({ onGenerate }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const data = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

  return (
    <View style={{ marginTop: 40, paddingHorizontal: 16 }}>
      <TextInput
        mode="outlined"
        label={'To'}
        placeholder="johndoe@email.com"
        value={to}
        onChangeText={setTo}
      />
      <TextInput
        mode="outlined"
        label={'Subject'}
        placeholder="Enter Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        mode="outlined"
        label={'Body'}
        placeholder="Enter Body"
        multiline
        numberOfLines={10}
        style={{ minHeight: 150, maxHeight: 150 }}
        value={body}
        onChangeText={setBody}
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
