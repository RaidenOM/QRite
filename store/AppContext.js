import React, { createContext, useState, useEffect, useContext } from 'react';
import { Vibration } from 'react-native';
import Sound from 'react-native-sound';
import AlertDialog from '../components/AlertDialog';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import { ThemeContext } from './ThemeContext';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    content: '',
    buttons: [],
  });
  const [bootSplashHidden, setBootSplashHidden] = useState(false);
  const { changeTheme } = useContext(ThemeContext);
  const [userSettings, setUserSettings] = useState({
    theme: 'system',
    sound: true,
    vibrate: true,
  });

  // auto save when settings change
  useEffect(() => {
    const save = setTimeout(() => {
      AsyncStorage.setItem('userSettings', JSON.stringify(userSettings));
    }, 300);

    return () => clearTimeout(save);
  }, [userSettings]);

  // init app and hide bootsplash
  useEffect(() => {
    const init = async () => {
      const settingsString = await AsyncStorage.getItem('userSettings');
      let settingsJson = {};
      try {
        settingsJson = settingsString ? JSON.parse(settingsString) : {};
      } catch (e) {
        console.log(e);
      }
      setUserSettings(prev => ({ ...prev, ...settingsJson }));

      Sound.setCategory('Playback');
      const soundFile = new Sound('scanner_sound', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(error);
          return;
        }
        setSound(soundFile);
      });

      await RNBootSplash.hide();
      setBootSplashHidden(true);
    };

    init();

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  // sync theme with theme provider
  useEffect(() => {
    changeTheme(userSettings.theme);
  }, [userSettings.theme]);

  // change user settings
  const changeThemeSetting = selectedTheme => {
    setUserSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        theme: selectedTheme,
      };
      return newSettings;
    });
  };
  const toggleSound = () => {
    setUserSettings(prevSettings => {
      const newSettings = { ...prevSettings, sound: !prevSettings.sound };
      return newSettings;
    });
  };

  const toggleVibrate = () => {
    setUserSettings(prevSettings => {
      const newSettings = { ...prevSettings, vibrate: !prevSettings.vibrate };
      return newSettings;
    });
  };

  useEffect(() => {
    if (bootSplashHidden) {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  }, [bootSplashHidden]);

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

  // haptic feedback and sounds
  const playSound = () => {
    if (sound && userSettings.sound) {
      sound.play();
    }
  };
  const hapticFeedback = () => {
    if (userSettings.vibrate) {
      Vibration.vibrate(100);
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <AppContext.Provider
      value={{
        sound,
        loading,
        playSound,
        hapticFeedback,
        showAlert,
        dismissAlert,
        userSettings,
        changeThemeSetting,
        toggleSound,
        toggleVibrate,
      }}
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
