import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from 'react-native-paper';
import ScanScreen from './screens/ScanScreen';
import CreateScreen from './screens/CreateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Text } from 'react-native-paper';
import AppContextProvider, { AppContext } from './store/AppContext';
import { StatusBar } from 'react-native';
import SettingsScreen from './screens/SettingsScreen';
import CustomMenu from './components/CustomMenu';
import { useContext } from 'react';
import ThemeContextProvider from './store/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { userSettings } = useContext(AppContext);
  const isDark = userSettings.theme === 'dark';
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      <Tab.Screen
        component={ScanScreen}
        name="ScanScreen"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialDesignIcons name="qrcode-scan" color={color} size={size} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text variant="labelSmall" style={{ color: color }}>
              Scan
            </Text>
          ),
        }}
      />
      <Tab.Screen
        component={CreateScreen}
        name="CreateScreen"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialDesignIcons
              name="plus-circle-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text variant="labelSmall" style={{ color: color }}>
              Create
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function MainApp() {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={
          theme.dark ? theme.colors.surface : theme.colors.primary
        }
      />
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: theme.dark
              ? theme.colors.surface
              : theme.colors.primary,
          },
          headerTitleStyle: {
            color: '#fff',
            fontFamily: 'Michroma-Regular',
          },

          animation: 'slide_from_right',
          animationTypeForReplace: 'pop',
        })}
      >
        <Stack.Screen
          component={HomeTabs}
          name="HomeTabs"
          options={({ navigation }) => ({
            headerRight: () => <CustomMenu navigation={navigation} />,
            headerTitle: 'QRite',
          })}
        />
        <Stack.Screen
          component={QRScannerScreen}
          name="QRScannerScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={SettingsScreen}
          name="SettingsScreen"
          options={{
            headerTitle: 'Settings',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  const theme = useTheme();

  return (
    <ThemeContextProvider>
      <AppContextProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </AppContextProvider>
    </ThemeContextProvider>
  );
}
