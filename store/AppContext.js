const { createContext, useState, useEffect } = require('react');
import { Alert, StatusBar, View } from 'react-native';
import Sound from 'react-native-sound';
import AlertDialog from '../components/AlertDialog';
import RNBootSplash from 'react-native-bootsplash';
import { Text } from 'react-native-paper';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    content: '',
    buttons: [],
  });
  const [bootSplashHidden, setBootSplashHidden] = useState(false);

  useEffect(() => {
    RNBootSplash.hide();
    setBootSplashHidden(true);
  }, []);

  useEffect(() => {
    if (bootSplashHidden) {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  }, [bootSplashHidden]);

  function SplashScreen() {
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
          }}
        >
          QRite
        </Text>
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

  const showAlert = (title, content, buttons = []) => {
    setAlert({
      visible: true,
      title: title,
      content: content,
      buttons: buttons,
    });
  };

  const dismissAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  Sound.setCategory('Playback');

  useEffect(() => {
    const soundFile = new Sound('scanner_sound', Sound.MAIN_BUNDLE, error => {
      if (error) {
        Alert.alert('Error Initializing Asset', error);
        return;
      }
      setSound(soundFile);
    });

    return () => {
      sound?.release();
    };
  }, []);

  const playSound = () => {
    if (sound) {
      sound.play();
    }
  };

  const stopSound = () => {
    if (sound) {
      sound.stop();
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <AppContext.Provider
      value={{ sound, loading, playSound, stopSound, showAlert, dismissAlert }}
    >
      {children}
      <AlertDialog
        visible={alert.visible}
        title={alert.title}
        buttons={alert.buttons}
        content={alert.content}
        onDismiss={dismissAlert}
      />
    </AppContext.Provider>
  );
}
