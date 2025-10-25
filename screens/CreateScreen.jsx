import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';
import categoryButtons from '../constants/categoryButtons';

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
  const qrRef = useRef();

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

  const shareQR = () => {
    if (qrRef.current) {
      qrRef.current.toDataURL(async base64String => {
        const path = FileSystem.CachesDirectoryPath + '/qrcode.png';

        console.log(path);

        await FileSystem.writeFile(path, base64String, 'base64');

        await Share.open({
          url: 'file://' + path,
          type: 'image/png',
          failOnCancel: false,
        });
      });
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

      <Portal>
        <Dialog
          visible={dialogShown}
          onDismiss={() => setDialogShown(false)}
          dismissable={false}
        >
          <Dialog.Title
            style={{ textAlign: 'center', fontFamily: 'Poppins-Regular' }}
          >
            Generated QR
          </Dialog.Title>
          <Dialog.Content
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <QRCode
              value={value}
              size={200}
              getRef={c => (qrRef.current = c)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogShown(false);
              }}
            >
              Cancel
            </Button>
            <Button onPress={shareQR}>Share as PNG</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
