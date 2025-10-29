import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const scheme = useColorScheme();

  const [mode, setMode] = useState('system');
  const [theme, setTheme] = useState(
    scheme === 'dark' ? MD3DarkTheme : MD3LightTheme,
  );

  useEffect(() => {
    if (mode === 'system')
      setTheme(scheme === 'dark' ? MD3DarkTheme : MD3LightTheme);
  }, [scheme]);

  const changeTheme = selectedTheme => {
    switch (selectedTheme) {
      case 'system':
        setTheme(scheme === 'dark' ? MD3DarkTheme : MD3LightTheme);
        break;
      case 'dark':
        setTheme(MD3DarkTheme);
        break;
      case 'light':
        setTheme(MD3LightTheme);
        break;
    }
    setMode(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
