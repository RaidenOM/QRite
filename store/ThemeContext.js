import { createContext, useState } from 'react';
import {
  DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(DefaultTheme);

  const changeTheme = theme => {
    switch (theme) {
      case 'system':
        setTheme(DefaultTheme);
        break;
      case 'dark':
        setTheme(MD3DarkTheme);
        break;
      case 'light':
        setTheme(MD3LightTheme);
        break;
    }
  };

  console.log(theme);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
