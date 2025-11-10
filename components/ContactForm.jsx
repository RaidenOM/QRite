import { useContext, useState } from 'react';
import { Linking, PermissionsAndroid, Platform, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AppContext } from '../store/AppContext';
import ContactPicker from './ContactPicker';
import Contacts from 'react-native-contacts';

export default function ContactForm({ onGenerate, style }) {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [contacts, setContacts] = useState();
  const { showAlert, dismissAlert } = useContext(AppContext);

  const data = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${organization}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=INTERNET:${email}
END:VCARD`;

  const hasContactsPermissions = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
    return false;
  };

  const handleOpenContactPicker = async () => {
    const result = await hasContactsPermissions();
    if (!result) {
      showAlert(
        'Permission required',
        'Permission to access contact is required in order to select contact',
        [
          {
            title: 'Cancel',
            onPress: dismissAlert,
          },
          {
            title: 'Grant permission',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
              dismissAlert();
            },
          },
        ],
      );
      return;
    }
    const response = await Contacts.getAll();
    setContacts(response);
    setShowPicker(true);
  };

  const pickerDismissHandler = () => {
    setShowPicker(false);
  };

  const pickerSelectHandler = pickedContact => {
    setFullName(pickedContact.name || '');
    setEmail(pickedContact.email || '');
    setPhone(pickedContact.phone || '');
    setOrganization(pickedContact.company || '');
    setShowPicker(false);
  };

  return (
    <View style={style}>
      {showPicker && (
        <ContactPicker
          contacts={contacts}
          onPickerSelect={pickerSelectHandler}
          onPickerDismiss={pickerDismissHandler}
          showPicker={showPicker}
        />
      )}
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
      <TextInput
        mode="outlined"
        label="Organization"
        placeholder="Company name"
        value={organization}
        onChangeText={setOrganization}
        style={{ marginBottom: 8 }}
      />
      <Button style={{ marginTop: 20 }} onPress={handleOpenContactPicker}>
        Import from Contacts
      </Button>
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
