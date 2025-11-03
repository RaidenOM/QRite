import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useContext, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  useWindowDimensions,
  Vibration,
  View,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
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
  const { playSound, showAlert, dismissAlert, hapticFeedback } =
    useContext(AppContext);
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const handleGalleryPick = async () => {
    try {
      const response = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        freeStyleCropEnabled: true,
      });

      if (!response) return;

      const result = await QRKit.decodeQR(response.path);
      console.log(result);

      if (!result.success) throw new Error(result.message);

      if (!result.data.trim())
        throw new Error('QR Code does not contain any data');

      console.log(result);
      playSound();
      hapticFeedback();

      let scannedValue = result.data;
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
    } catch (error) {
      let message;
      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        message =
          'Permission to access library is required in order to scan photos';
        showAlert('Permission required', message, [
          {
            title: 'Cancel',
            onPress: dismissAlert,
          },
          {
            title: 'Grant Permissions',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
              dismissAlert();
            },
          },
        ]);
        return;
      }
      message = error.message
        ? error.message
        : 'Something went wrong while scanning';
      if (message !== 'User cancelled image selection')
        showAlert('Error', message);
    }
  };

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        showAlert(
          'Permission required',
          'Permission to access camera is required in order to scan',
          [
            {
              title: 'Cancel',
              onPress: dismissAlert,
            },
            {
              title: 'Grant Permissions',
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
    }
    navigation.navigate('QRScannerScreen');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
      }}
    >
      <ScannedQRDialog
        onDismiss={() => setShowDialog(false)}
        visible={showDialog}
        type={type}
        value={value}
      />

      <ScrollView>
        <View style={{ alignSelf: 'center', width: '100%' }}>
          <LottieView
            source={require('../assets/lottie/scan_screen.json')}
            style={{
              height: height * 0.4,
            }}
            autoPlay
          />
        </View>
        <Text
          variant="displaySmall"
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
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
              textAlign: 'center',
            }}
          >
            Scan a new image from Camera or an existing one from Gallery, or
            create your own QR!
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
    </View>
  );
}
