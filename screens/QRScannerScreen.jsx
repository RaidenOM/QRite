import { useContext, useState } from 'react';
import { StatusBar, StyleSheet, Vibration, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import validator from 'validator';
import LottieView from 'lottie-react-native';
import { AppContext } from '../store/AppContext';
import ScannedQRDialog from '../components/ScannedQRDialog';
import getType from '../utils/getType';

export default function QRScannerScreen() {
  const [torch, setTorch] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [value, setValue] = useState(null);
  const [type, setType] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [facing, setFacing] = useState('back');
  const { playSound, hapticFeedback } = useContext(AppContext);

  console.log({ torch });

  const device = useCameraDevice(facing);
  console.log(device);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: scannedData => {
      handleScan(scannedData);
    },
  });

  const handleScan = async scannedData => {
    if (!scanning) return;
    setScanning(false);

    playSound();
    hapticFeedback();

    let scannedValue = scannedData[0].value;
    let detectedType = await getType(scannedValue);

    if (
      detectedType === 'URL' &&
      !validator.isURL(scannedValue, { require_protocol: true })
    ) {
      scannedValue = 'http://' + scannedValue;
    }

    setValue(scannedValue);
    setType(detectedType);
    setShowDialog(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ScannedQRDialog
        onDismiss={() => setShowDialog(false)}
        visible={showDialog}
        value={value}
        type={type}
      />

      <Camera
        style={styles.camera}
        codeScanner={codeScanner}
        torch={torch ? 'on' : 'off'}
        device={device}
        isActive={true}
      />

      {scanning && (
        <LottieView
          source={require('../assets/lottie/qr_scanner_screen.json')}
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
    left: 30,
    bottom: 80,
  },
  flipButton: {
    position: 'absolute',
    right: 30,
    bottom: 80,
  },
});
