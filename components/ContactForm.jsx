import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function ContactForm({ onGenerate }) {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const data = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${organization}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=INTERNET:${email}
END:VCARD`;

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label="Full Name"
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Organization"
        placeholder="Company name"
        value={organization}
        onChangeText={setOrganization}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Phone"
        placeholder="+1-555-123-4567"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Email"
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
