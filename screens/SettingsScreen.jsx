import { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import {
  Dialog,
  Divider,
  List,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { AppContext } from '../store/AppContext';
import { Dropdown } from 'react-native-element-dropdown';
import themeOptions from '../constants/themeOptions';
import DeviceInfo from 'react-native-device-info';

export default function SettingsScreen() {
  const { toggleSound, toggleVibrate, changeThemeSetting, userSettings } =
    useContext(AppContext);
  const theme = useTheme();
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const trackColor = theme.dark
    ? {
        false: theme.colors.surfaceVariant,
        true: theme.colors.primaryContainer,
      }
    : { false: theme.colors.outline, true: theme.colors.primaryContainer };

  const soundThumbColor = theme.dark
    ? userSettings.sound
      ? theme.colors.primary
      : theme.colors.outline
    : userSettings.sound
    ? theme.colors.primary
    : theme.colors.surfaceVariant;

  const vibrateThumbColor = theme.dark
    ? userSettings.vibrate
      ? theme.colors.primary
      : theme.colors.outline
    : userSettings.vibrate
    ? theme.colors.primary
    : theme.colors.surfaceVariant;

  const renderItem = (item, selected) => {
    console.log(item);
    return (
      <List.Item
        title={item.label}
        style={{
          borderBottomWidth: item._index !== 2 ? 0.5 : 0,
          borderBottomColor: theme.colors.onSurfaceDisabled,
        }}
        right={() =>
          selected && (
            <List.Icon
              icon="check"
              color={theme.dark ? '#00ff33ff' : '#009a1fff'}
            />
          )
        }
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
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
                QRite is a cross platform compatible app that allows scanning
                and generation of QR codes.
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
      <ScrollView>
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Appearance"
            description="Choose theme for app"
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
                  <List.Icon
                    icon="chevron-down"
                    color={theme.colors.onSurface}
                  />
                )}
                renderItem={renderItem}
              />
            )}
            disabled
          />
          <List.Item
            title="Sound"
            description="Enable sound after a successsful scan"
            right={() => (
              <Switch
                value={userSettings.sound}
                onValueChange={toggleSound}
                trackColor={trackColor}
                thumbColor={soundThumbColor}
              />
            )}
          />
          <List.Item
            title="Haptic Feedback"
            description="Enable vibration after a successsful scan"
            right={() => (
              <Switch
                value={userSettings.vibrate}
                onValueChange={toggleVibrate}
                trackColor={trackColor}
                thumbColor={vibrateThumbColor}
              />
            )}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & Feedback"
            description="View help articles or contact support"
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>App</List.Subheader>
          <List.Item title="About" onPress={() => setShowAboutDialog(true)} />

          <List.Item title="Version" description={DeviceInfo.getVersion()} />
          <List.Item
            title="Check for Updates"
            description="Check if a newer version is available"
          />
          <List.Item
            title="Rate on Google Play"
            description="Consider rating the app if you like it :)"
          />
        </List.Section>
      </ScrollView>
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
