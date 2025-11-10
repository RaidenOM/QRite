import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { AppContext } from '../store/AppContext';
import ContactPicker from './ContactPicker';
import Contacts from 'react-native-contacts';

export default function PhoneForm({ onGenerate, style }) {
  const [phone, setPhone] = useState('');
  const theme = useTheme();
  const [pickerLoading, setPickerLoading] = useState(false);
  const { showAlert, dismissAlert } = useContext(AppContext);
  const [showPicker, setShowPicker] = useState(false);
  const [contacts, setContacts] = useState();

  const data = `tel:${phone}`;

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
    console.log(response);
    setContacts(response);
    setShowPicker(true);
    setPickerLoading(false);
  };

  const pickerDismissHandler = () => {
    setShowPicker(false);
  };

  const pickerSelectHandler = pickedContact => {
    setPhone(pickedContact.phone);
    setShowPicker(false);
  };

  return (
    <View style={style}>
      {showPicker && (
        <ContactPicker
          showPicker={showPicker}
          onPickerSelect={pickerSelectHandler}
          onPickerDismiss={pickerDismissHandler}
          contacts={contacts}
        />
      )}
      <TextInput
        mode="outlined"
        label={'Phone'}
        placeholder="+1 123-456-789"
        value={phone}
        onChangeText={setPhone}
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
