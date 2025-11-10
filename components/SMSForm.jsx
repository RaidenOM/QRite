import { useContext, useState } from 'react';
import { Linking, PermissionsAndroid, Platform, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import Contacts from 'react-native-contacts';
import ContactPicker from './ContactPicker';
import { ActivityIndicator } from 'react-native';
import { AppContext } from '../store/AppContext';

export default function SMSForm({ onGenerate, style }) {
  const [recipient, setRecepient] = useState('');
  const [body, setBody] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [pickerLoading, setPickerLoading] = useState(false);
  const theme = useTheme();
  const { showAlert, dismissAlert } = useContext(AppContext);

  const data = `sms:${encodeURIComponent(recipient)}?body=${encodeURIComponent(
    body,
  )}`;

  const hasContactsPermissions = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
    return false;
  };

  const handleOpenContactPicker = async () => {
    setPickerLoading(true);
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

      setPickerLoading(false);
      return;
    }
    const response = await Contacts.getAll();
    setContacts(response);
    setShowPicker(true);
    setPickerLoading(false);
  };

  const pickerDismissHandler = () => {
    setShowPicker(false);
  };

  const pickerSelectHandler = pickedContact => {
    setRecepient(pickedContact.phone);
    setShowPicker(false);
  };

  return (
    <View style={style}>
      {showPicker && (
        <ContactPicker
          contacts={contacts}
          showPicker={showPicker}
          onPickerSelect={pickerSelectHandler}
          onPickerDismiss={pickerDismissHandler}
        />
      )}
      <TextInput
        mode="outlined"
        label={'Recipient'}
        placeholder="Enter Recipient"
        value={recipient}
        onChangeText={setRecepient}
        multiline
        numberOfLines={10}
        right={
          pickerLoading ? (
            <TextInput.Icon
              icon={() => <ActivityIndicator color={theme.colors.primary} />}
            />
          ) : (
            <TextInput.Icon
              icon="contacts-outline"
              onPress={handleOpenContactPicker}
            />
          )
        }
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
