import LottieView from 'lottie-react-native';
import { StatusBar, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Michroma-Regular',
          fontSize: 48,
          zIndex: 10,
        }}
      >
        QRite
      </Text>
      <LottieView
        source={require('../assets/lottie/splash_screen.json')}
        style={{ width: 450, height: 450, position: 'absolute', zIndex: 0 }}
        autoPlay
      />
      <Text
        style={{
          fontFamily: 'Michroma-Regular',
          fontSize: 15,
          position: 'absolute',
          bottom: 50,
          color: '#9E9E9E',
        }}
      >
        Designed by Om Kumar
      </Text>
    </View>
  );
}
