import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import ScanScreen from './screens/ScanScreen';
import CreateScreen from './screens/CreateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Text } from 'react-native-paper';
import AppContextProvider from './store/AppContext';
import { StatusBar, useWindowDimensions } from 'react-native';
import SettingsScreen from './screens/SettingsScreen';
import CustomMenu from './components/CustomMenu';
import ThemeContextProvider from './store/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          elevation: 6,
          backgroundColor: theme.dark
            ? '#282828ff'
            : theme.colors.elevation.level1,
          height: 65,
          paddingTop: 4,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          borderTopWidth: 0,
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
            <Text variant="bodyMedium" style={{ color: color }}>
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
            <MaterialDesignIcons name="pencil" size={size} color={color} />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text variant="bodyMedium" style={{ color: color }}>
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
        backgroundColor={theme.dark ? '#282828ff' : theme.colors.primary}
      />
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: theme.dark ? '#282828ff' : theme.colors.primary,
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
