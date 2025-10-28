import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Divider,
  IconButton,
  Menu,
  Portal,
  useTheme,
} from 'react-native-paper';

export default function CustomNavigationBar({ navigation }) {
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const iconRef = useRef();
  const [menuY, setMenuY] = useState(null);

  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  const toggleMenu = () => {
    if (!showMenu && iconRef.current) {
      iconRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuY(pageY + height);
        setShowMenu(true);
      });
    } else {
      setShowMenu(false);
    }
  };

  const handleMenuPress = (value, navigation) => {
    switch (value) {
      case 'settings':
        navigation.navigate('SettingsScreen');
        closeMenu();
    }
  };

  return (
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
            onPress={toggleMenu}
            style={StyleSheet.absoluteFill}
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
            <Menu.Item title="Rate on Google Play" leadingIcon={'star'} />
            <Divider />
            <Menu.Item
              title="Settings"
              leadingIcon={'cog'}
              onPress={() => handleMenuPress('settings', navigation)}
            />
            <Menu.Item title="Help and Feedback" leadingIcon={'help'} />
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
  );
}
