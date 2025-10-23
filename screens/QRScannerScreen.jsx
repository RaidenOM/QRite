import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Snackbar,
  Text,
} from 'react-native-paper';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import validator from 'validator';
import LottieView from 'lottie-react-native';

export default function QRScannerScreen() {
  const [torch, setTorch] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [data, setData] = useState(null);
  const [type, setType] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [facing, setFacing] = useState('back');

  const device = useCameraDevice(facing);
  console.log(device);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: data => {
      handleScan(data);
    },
  });

  const getType = data => {
    const normalizedData = data.trim().toLowerCase();
    let type;

    if (normalizedData.startsWith('mailto:')) {
      type = 'Email';
    } else if (
      normalizedData.startsWith('begin:vcard') &&
      normalizedData.endsWith('end:vcard')
    ) {
      type = 'Contact';
    } else if (
      normalizedData.startsWith('begin:vevent') &&
      normalizedData.endsWith('end:vevent')
    ) {
      type = 'Event';
    } else if (normalizedData.startsWith('tel:')) {
      type = 'Phone';
    } else if (validator.isURL(normalizedData, { require_protocol: false })) {
      type = 'URL';
    } else {
      type = 'Plaintext';
    }

    return type;
  };

  const handleScan = data => {
    let value = data[0].value;
    let type = getType(value);

    if (type === 'URL' && !validator.isURL(value, { require_protocol: true })) {
      value = 'http://' + value;
    }

    setData(value);
    setType(type);
    setScanning(false);
    setShowDialog(true);
  };

  const performAction = async () => {
    if (type === 'Plaintext') {
      Clipboard.setString(data);
      setShowSnack(true);
    } else if (type === 'Contact') {
      const path = FileSystem.CachesDirectoryPath + '/contact.vcf';
      await FileSystem.writeFile(path, data);
      await Share.open({
        title: 'Add to Contacts',
        url: 'file://' + path,
        type: 'text/vcard',
      });
    } else if (type === 'Event') {
      const path = FileSystem.CachesDirectoryPath + '/event.ics';
      await FileSystem.writeFile(path, data);
      await Share.open({
        title: 'Add Event',
        url: 'file://' + path,
        type: 'text/calendar',
      });
    } else {
      Linking.openURL(data);
    }
    setShowDialog(false);
  };

  return (
    <View style={styles.container}>
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
      <Portal>
        <Dialog visible={showDialog}>
          <Dialog.Title>
            <Text style={{ textAlign: 'center' }}>Scan Result</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text>Data: {data}</Text>
            <Text>Type: {type}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button onPress={performAction}>Perform Action</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Camera
        style={styles.camera}
        codeScanner={scanning ? codeScanner : undefined}
        torch={torch ? 'on' : 'off'}
        device={device}
        isActive={true}
      />

      {scanning && (
        <LottieView
          source={require('../assets/lottie/Scanning QR Code.json')}
          style={{
            width: 250,
            height: 250,
            position: 'absolute',
            alignSelf: 'center',
          }}
          autoPlay
        />
      )}
      <IconButton
        icon={torch ? 'flashlight-off' : 'flashlight'}
        style={styles.flashButton}
        mode="contained"
        size={40}
        onPress={() => setTorch(prev => !prev)}
      />
      {!scanning && (
        <IconButton
          icon="reload"
          style={styles.reloadButton}
          mode="contained"
          size={40}
          onPress={() => setScanning(true)}
        />
      )}

      <IconButton
        icon="orbit-variant"
        style={styles.flipButton}
        mode="contained"
        size={40}
        onPress={() =>
          facing === 'back' ? setFacing('front') : setFacing('back')
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  reloadButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80,
  },
  flashButton: {
    position: 'absolute',
    left: 20,
    bottom: 80,
  },
  flipButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  grid: {
    position: 'absolute',
    alignSelf: 'center',
    top: 100,
  },
});
