import { useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import {
  Divider,
  IconButton,
  Menu,
  Portal,
  useTheme,
} from 'react-native-paper';
import Share from 'react-native-share';

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

  const rateApp = () => {
    const packageName = 'com.whatsapp';
    Linking.openURL(`market://details?id=${packageName}`).catch(() => {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${packageName}`,
      );
    });
  };

  const shareApp = async () => {
    try {
      await Share.open({
        title: 'Share QRite',
        message: 'Download QRite: QR Scanner & Generator',
        url: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      });
    } catch (err) {
      console.log(err);
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
              backgroundColor: theme.colors.surface,
              elevation: 8,
              borderRadius: theme.roundness,
            }}
          >
            <Menu.Item
              title="Share"
              leadingIcon={'share'}
              onPress={() => shareApp()}
            />
            <Menu.Item
              title="Rate on Google Play"
              leadingIcon={'star'}
              onPress={() => rateApp()}
            />
            <Menu.Item
              title="Settings"
              leadingIcon={'cog'}
              onPress={() => handleMenuPress('settings', navigation)}
            />
          </View>
        </Portal>
      )}
    </>
  );
}
