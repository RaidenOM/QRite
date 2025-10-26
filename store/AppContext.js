const { createContext, useState, useEffect } = require('react');
import { Alert } from 'react-native';
import Sound from 'react-native-sound';
import AlertDialog from '../components/AlertDialog';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    content: '',
    buttons: [],
  });

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
