import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, View } from 'react-native';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  MD2Colors,
  Menu,
  Portal,
  Text,
} from 'react-native-paper';
import { useCameraPermission } from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';

export default function ScanScreen() {
  const navigation = useNavigation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [showMenu, setShowMenu] = useState(false);

  console.log({ showMenu });

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
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Text
          variant="bodyLarge"
          style={{
            marginHorizontal: 30,
            marginTop: 20,
            fontFamily: 'Poppins-Regular',
          }}
        >
          To open camera and scan a QR Code press the button below. Or click on
          'Create' in bottom tab bar to generate a QR Code.
        </Text>
        <Button
          mode="outlined"
          icon="camera-outline"
          style={{ marginBottom: 20, alignSelf: 'center' }}
          onPress={handleOpenCamera}
        >
          <Text style={{ fontFamily: 'Poppins-Regular' }}>Open Camera</Text>
        </Button>
      </View>
    </LinearGradient>
  );
}
