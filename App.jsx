import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Divider,
  IconButton,
  MD3LightTheme,
  Menu,
  PaperProvider,
  Portal,
  useTheme,
} from 'react-native-paper';
import ScanScreen from './screens/ScanScreen';
import CreateScreen from './screens/CreateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Text } from 'react-native-paper';
import AppContextProvider from './store/AppContext';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
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
  const [showMenu, setShowMenu] = useState(false);
  const iconRef = useRef();
  const [menuY, setMenuY] = useState(null);

  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);
  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    iconRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuY(pageY + height);
      console.log(pageY);
    });
  }, [iconRef]);

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
              headerTitleStyle: {
                color: '#fff',
                fontFamily: 'Michroma-Regular',
              },
              headerRight: () => (
                <>
                  <View ref={iconRef}>
                    <IconButton
                      icon="dots-vertical"
                      iconColor="#fff"
                      onPress={toggleMenu}
                    />
                  </View>
                  {showMenu && (
                    <Portal>
                      <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={toggleMenu}
                      ></Pressable>
                      <View
                        style={{
                          position: 'absolute',
                          top: menuY,
                          right: 16,
                          backgroundColor: '#f4edf9',
                          elevation: 8,
                          borderRadius: theme.roundness,
                        }}
                      >
                        <Menu.Item title="Share" leadingIcon={'share'} />
                        <Menu.Item
                          title="Rate on Google Play"
                          leadingIcon={'star'}
                        />
                        <Divider />
                        <Menu.Item title="Settings" leadingIcon={'cog'} />
                        <Menu.Item
                          title="Help and Feedback"
                          leadingIcon={'help'}
                        />
                        <Divider />
                        <Menu.Item
                          title="Close Menu"
                          leadingIcon={'close'}
                          onPress={closeMenu}
                        />
                      </View>
                    </Portal>
                  )}
                </>
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
