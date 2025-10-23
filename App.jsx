import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Appbar, Icon, MD2Colors, PaperProvider } from 'react-native-paper';
import ScanScreen from './screens/ScanScreen';
import CreateScreen from './screens/CreateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Text } from 'react-native-paper';

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
            <Text
              variant="labelSmall"
              style={{ color: color, fontFamily: 'Poppins-Regular' }}
            >
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
            <Text
              variant="labelSmall"
              style={{ color: color, fontFamily: 'Poppins-Regular' }}
            >
              Create
            </Text>
          ),
        }}
      />
      {/* <Tab.Screen
        component={HistoryScreen}
        name="HistoryScreen"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name={"history"} color={color} size={size} />
          ),
          tabBarLabel: "History",
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={HomeTabs} name="HomeTabs" />
          <Stack.Screen component={QRScannerScreen} name="QRScannerScreen" />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
