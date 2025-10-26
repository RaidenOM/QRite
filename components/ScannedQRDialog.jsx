import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Dialog, Portal, Snackbar, Text } from 'react-native-paper';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';

export default function ScannedQRDialog({ visible, onDismiss, value, type }) {
  const [showSnack, setShowSnack] = useState(false);

  const copyHandler = () => {
    Clipboard.setString(value);
    setShowSnack(true);
  };

  const actionHandler = async () => {
    try {
      if (type === 'Contact') {
        const path = FileSystem.CachesDirectoryPath + '/contact.vcf';
        await FileSystem.writeFile(path, value);
        await Share.open({
          title: 'Add to Contacts',
          url: 'file://' + path,
          type: 'text/vcard',
        });
      } else if (type === 'Event') {
        const path = FileSystem.CachesDirectoryPath + '/event.ics';
        await FileSystem.writeFile(path, value);
        await Share.open({
          title: 'Add Event',
          url: 'file://' + path,
          type: 'text/calendar',
        });
      } else {
        Linking.openURL(value);
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  return (
    <Portal>
      <Portal>
        <Snackbar
          visible={showSnack}
          onDismiss={() => setShowSnack(false)}
          action={{
            label: 'OK',
            onPress: () => setShowSnack(false),
          }}
        >
          Text Copied to Clipboard!
        </Snackbar>
      </Portal>
      <Dialog visible={visible}>
        <Dialog.Title
          style={{ textAlign: 'center', fontFamily: 'Poppins-Regular' }}
        >
          Scan Result
        </Dialog.Title>
        <Dialog.Content>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="bodyMedium">Data: </Text>
            <Text variant="bodyMedium">{value}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="bodyMedium">Type: </Text>
            <Text variant="bodyMedium">{type}</Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'space-between' }}>
          <Button onPress={onDismiss}>Cancel</Button>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={copyHandler}>Copy</Button>
            {type !== 'Text' && (
              <Button onPress={actionHandler}>Perform Action</Button>
            )}
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
