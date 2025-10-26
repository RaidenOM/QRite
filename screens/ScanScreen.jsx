import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useContext, useState } from 'react';
import { Alert, ScrollView, Vibration, View } from 'react-native';
import { Button, MD2Colors, Text } from 'react-native-paper';
import { useCameraPermission } from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import QRKit from 'react-native-qr-kit';
import getType from '../utils/getType';
import validator from 'validator';
import ScannedQRDialog from '../components/ScannedQRDialog';
import { AppContext } from '../store/AppContext';
import ImagePicker from 'react-native-image-crop-picker';

export default function ScanScreen() {
  const navigation = useNavigation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [value, setValue] = useState('');
  const [type, setType] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const { playSound } = useContext(AppContext);

  const handleGalleryPick = async () => {
    try {
      const response = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        freeStyleCropEnabled: true,
      });

      if (!response) return;

      const result = await QRKit.decodeQR(response.path);
      playSound();
      Vibration.vibrate(100);

      let scannedValue = result.data;
      let detectedType = getType(scannedValue);

      if (
        detectedType === 'URL' &&
        !validator.isURL(scannedValue, { require_protocol: true })
      ) {
        scannedValue = 'http://' + scannedValue;
      }

      setValue(scannedValue);
      setType(detectedType);
      setShowDialog(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Permission to access Camera is required in order to scan.',
        );
        return;
      }
    }
    navigation.navigate('QRScannerScreen');
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={['#fac7ffff', '#fff']}
    >
      <ScannedQRDialog
        onDismiss={() => setShowDialog(false)}
        visible={showDialog}
        type={type}
        value={value}
      />

      <View
        style={{
          height: 70,
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Text
          variant="headlineMedium"
          style={{
            color: MD2Colors.purple400,
            textAlign: 'center',
            flex: 1,
          }}
        >
          QRite
        </Text>
      </View>
      <ScrollView>
        <View style={{ alignSelf: 'center' }}>
          <LottieView
            source={require('../assets/lottie/QR Code.json')}
            style={{
              width: 300,
              height: 300,
            }}
            autoPlay
          />
        </View>
        <Text
          variant="displaySmall"
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-SemiBold',
            marginHorizontal: 20,
          }}
        >
          Welcome to QRite!
        </Text>
        <View>
          <Text
            variant="bodyLarge"
            style={{
              marginHorizontal: 30,
              marginTop: 10,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Scan from Camera or Gallery, or create your own QR!
          </Text>
          <View style={{ paddingVertical: 20 }}>
            <Button
              mode="outlined"
              icon="camera-outline"
              style={{ alignSelf: 'center', marginBottom: 20 }}
              onPress={handleOpenCamera}
            >
              Open Camera
            </Button>
            <Button
              mode="contained"
              icon="image-multiple-outline"
              style={{ alignSelf: 'center' }}
              onPress={handleGalleryPick}
            >
              Pick from Gallery
            </Button>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
