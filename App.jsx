import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  IconButton,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from 'react-native-paper';
import ScanScreen from './screens/ScanScreen';
import CreateScreen from './screens/CreateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Text } from 'react-native-paper';
import AppContextProvider from './store/AppContext';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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

export default function App() {
  const theme = useTheme();
  return (
    <PaperProvider theme={MD3LightTheme}>
      <StatusBar backgroundColor={theme.colors.primary} />
      <AppContextProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitle: 'QRite',
              headerTintColor: '#fff',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTitleStyle: { color: '#fff' },
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon={'dots-vertical'}
                  size={20}
                  iconColor={tintColor}
                />
              ),
            }}
          >
            <Stack.Screen component={HomeTabs} name="HomeTabs" />
            <Stack.Screen
              component={QRScannerScreen}
              name="QRScannerScreen"
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContextProvider>
    </PaperProvider>
  );
}
