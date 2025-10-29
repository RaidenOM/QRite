import { useContext, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { Dialog, List, Portal, Text, useTheme } from 'react-native-paper';
import { AppContext } from '../store/AppContext';
import { Dropdown } from 'react-native-element-dropdown';
import themeOptions from '../constants/themeOptions';

export default function SettingsScreen() {
  const { toggleSound, toggleVibrate, changeThemeSetting, userSettings } =
    useContext(AppContext);
  const theme = useTheme();
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : '#fff',
        paddingHorizontal: 16,
      }}
    >
      <Portal>
        <Dialog
          visible={showAboutDialog}
          onDismiss={() => setShowAboutDialog(false)}
        >
          <Dialog.Title
            style={{ textAlign: 'center', fontFamily: 'Poppins-Regular' }}
          >
            About
          </Dialog.Title>
          <Dialog.Content>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/logo.png')}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{ fontFamily: 'Michroma-Regular', marginTop: 8 }}
                variant="bodyLarge"
              >
                QRite
              </Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: 'center', marginTop: 16 }}
              >
                QRite is a cross platform compatible QR code app that allows
                scanning and generation of QR codes.
              </Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: 'center', marginTop: 16 }}
              >
                Designed by Om Kumar {'\n'}
                ©2025
              </Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <List.Section>
        <List.Subheader style={{ paddingHorizontal: 0 }}>
          General
        </List.Subheader>
        <List.Item
          title="About"
          left={() => <List.Icon icon="information-outline" />}
          onPress={() => setShowAboutDialog(true)}
        />
        <List.Item
          title="Appearance"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => (
            <Dropdown
              style={[
                styles.dropdown,
                { backgroundColor: theme.colors.surface },
              ]}
              placeholderStyle={{ color: theme.colors.onSurface }}
              selectedTextStyle={{ color: theme.colors.onSurface }}
              containerStyle={{
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                overflow: 'hidden',
              }}
              activeColor={theme.colors.surfaceVariant}
              itemTextStyle={{ color: theme.colors.onSurface }}
              data={themeOptions}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Select theme"
              value={userSettings.theme}
              onChange={item => {
                changeThemeSetting(item.value);
              }}
              renderRightIcon={() => (
                <List.Icon icon="chevron-down" color={theme.colors.onSurface} />
              )}
            />
          )}
          disabled
        />
        <List.Item
          title="Haptic Feedback"
          left={() => <List.Icon icon="vibrate" />}
          right={() => (
            <Switch
              value={userSettings.vibrate}
              onValueChange={toggleVibrate}
            />
          )}
        />
        <List.Item
          title="Sound"
          left={() => <List.Icon icon="volume-high" />}
          right={() => (
            <Switch value={userSettings.sound} onValueChange={toggleSound} />
          )}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
  },
});
