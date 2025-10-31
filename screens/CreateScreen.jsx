import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons, Text, useTheme } from 'react-native-paper';
import categoryButtons from '../constants/categoryButtons';
import GeneratedQRDialog from '../components/GeneratedQRDialog';
import URLForm from '../components/URLForm';
import TextForm from '../components/TextForm';
import ContactForm from '../components/ContactForm';
import EmailForm from '../components/EmailForm';
import EventForm from '../components/EventForm';
import PhoneForm from '../components/PhoneForm';
import { LIGHT } from '../store/ThemeContext';

export default function CreateScreen() {
  const [type, setType] = useState('URL');
  const [dialogShown, setDialogShown] = useState(false);
  const [value, setValue] = useState('');
  const theme = useTheme();

  const onGenerate = value => {
    setValue(value);
    setDialogShown(true);
  };

  const renderForm = () => {
    switch (type) {
      case 'URL':
        return (
          <URLForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
      case 'Phone':
        return (
          <PhoneForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
      case 'Email':
        return (
          <EmailForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
      case 'Event':
        return (
          <EventForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
      case 'Text':
        return (
          <TextForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
      case 'Contact':
        return (
          <ContactForm
            onGenerate={onGenerate}
            style={{ marginHorizontal: 16, marginTop: 24 }}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View>
        <Text
          variant="displaySmall"
          style={{
            fontFamily: 'Poppins',
            marginTop: 20,
            marginBottom: 30,
            marginHorizontal: 16,
            fontFamily: 'Poppins-ExtraLight',
            color: theme.colors.onBackground,
          }}
        >
          Create QR
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            fontFamily: 'Poppins',
            marginBottom: 10,
            marginHorizontal: 16,
            fontFamily: 'Poppins-Regular',
            position: 'static',
          }}
        >
          Select Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'flex-start',
            paddingHorizontal: 16,
          }}
        >
          <SegmentedButtons
            value={type}
            onValueChange={value => {
              setType(value);
            }}
            buttons={categoryButtons}
          />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {renderForm()}
      </ScrollView>

      <GeneratedQRDialog
        value={value}
        visible={dialogShown}
        onDismiss={() => setDialogShown(false)}
      />
    </View>
  );
}
