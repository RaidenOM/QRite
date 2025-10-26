import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import categoryButtons from '../constants/categoryButtons';
import GeneratedQRDialog from '../components/GeneratedQRDialog';
import URLForm from '../components/URLForm';
import TextForm from '../components/TextForm';
import ContactForm from '../components/ContactForm';
import EmailForm from '../components/EmailForm';
import EventForm from '../components/EventForm';
import PhoneForm from '../components/PhoneForm';

export default function CreateScreen() {
  const [type, setType] = useState('URL');
  const [dialogShown, setDialogShown] = useState(false);
  const [value, setValue] = useState('');

  const onGenerate = value => {
    setValue(value);
    setDialogShown(true);
  };

  const renderForm = () => {
    switch (type) {
      case 'URL':
        return <URLForm onGenerate={onGenerate} />;
      case 'Phone':
        return <PhoneForm onGenerate={onGenerate} />;
      case 'Email':
        return <EmailForm onGenerate={onGenerate} />;
      case 'Event':
        return <EventForm onGenerate={onGenerate} />;
      case 'PlainText':
        return <TextForm onGenerate={onGenerate} />;
      case 'Contact':
        return <ContactForm onGenerate={onGenerate} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View>
        <Text
          variant="displaySmall"
          style={{
            fontFamily: 'Poppins',
            marginVertical: 30,
            marginHorizontal: 16,
            fontFamily: 'Poppins-Regular',
          }}
        >
          Select Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'flex-start',
            paddingHorizontal: 10,
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

      {renderForm()}

      <GeneratedQRDialog
        value={value}
        visible={dialogShown}
        onDismiss={() => setDialogShown(false)}
      />
    </View>
  );
}
