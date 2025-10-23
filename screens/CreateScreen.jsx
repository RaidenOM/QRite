import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import validator from 'validator';

const URLForm = ({ value, setValue, setDialogShown }) => {
  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'URL'}
        placeholder="Enter URL"
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          if (value && validator.isURL(value)) {
            setDialogShown(true);
          } else {
            Alert.alert('Invalid URL', 'Please enter a valid URL.');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};

const TextForm = ({ value, setValue, setDialogShown }) => {
  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'Text'}
        placeholder="Enter Text"
        value={value}
        onChangeText={setValue}
        multiline
        numberOfLines={10}
        style={{ minHeight: 200, maxHeight: 200 }}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          if (value) {
            setDialogShown(true);
          } else {
            Alert.alert('Empty Text', 'Text cannot be empty.');
          }
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};
const ContactForm = ({ value, setValue, setDialogShown }) => {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const compileData = () => {
    const data = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${organization}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=INTERNET:${email}
END:VCARD`;
    setValue(data);
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label="Full Name"
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Organization"
        placeholder="Company name"
        value={organization}
        onChangeText={setOrganization}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Phone"
        placeholder="+1-555-123-4567"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        mode="outlined"
        label="Email"
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          compileData();
          setDialogShown(true);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};
const EventForm = ({ value, setValue, setDialogShown }) => {
  const [title, setTitle] = useState('');
  const [description, setDiscription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date(Date.now()));
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now()));

  useEffect(() => {
    console.log({ startDateTime, endDateTime });
  }, [startDateTime, endDateTime]);

  const compileData = () => {
    const data = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${format(startDateTime, "yyyyMMdd'T'HHmmss'Z'")}
DTEND:${format(endDateTime, "yyyyMMdd'T'HHmmss'Z'")}
END:VEVENT
END:VCALENDAR
`;

    setValue(data);
  };

  const showStart = () => {
    DateTimePickerAndroid.open({
      value: startDateTime,
      mode: 'date',
      onChange: (event, selectedDate) => {
        const combinedDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          startDateTime.getHours(),
          startDateTime.getMinutes(),
        );

        DateTimePickerAndroid.open({
          value: combinedDateTime,
          mode: 'time',
          onChange: (event, selectedTime) => {
            const finalDateTime = new Date(
              combinedDateTime.getFullYear(),
              combinedDateTime.getMonth(),
              combinedDateTime.getDate(),
              selectedTime.getHours(),
              selectedTime.getMinutes(),
            );

            setStartDateTime(finalDateTime);
          },
        });
      },
    });
  };

  const showEnd = () => {
    DateTimePickerAndroid.open({
      value: endDateTime,
      mode: 'date',
      onChange: (event, selectedDate) => {
        if (!selectedDate) return;

        const combinedDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          endDateTime.getHours(),
          endDateTime.getMinutes(),
        );

        DateTimePickerAndroid.open({
          value: combinedDateTime,
          mode: 'time',
          onChange: (event, selectedTime) => {
            const finalDateTime = new Date(
              combinedDateTime.getFullYear(),
              combinedDateTime.getMonth(),
              combinedDateTime.getDate(),
              selectedTime.getHours(),
              selectedTime.getMinutes(),
            );

            setEndDateTime(finalDateTime);
          },
        });
      },
    });
  };

  const formatDate = date => {
    return format(date, 'P');
  };

  const formatTime = time => {
    return format(time, 'p');
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'Title'}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
        multiline
        numberOfLines={10}
      />
      <TextInput
        mode="outlined"
        label={'Description'}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDiscription}
        multiline
        numberOfLines={10}
      />
      <TextInput
        mode="outlined"
        label={'Location'}
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
        multiline
        numberOfLines={10}
      />
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, marginRight: 15 }}
          placeholder="Start Date"
          value={formatDate(startDateTime)}
          editable={false}
          mode="outlined"
          label="Start Date"
        />
        <TextInput
          style={{ flex: 1 }}
          placeholder="Start Time"
          value={formatTime(startDateTime)}
          editable={false}
          mode="outlined"
          label="Start Time"
        />
        <IconButton icon="calendar" onPress={showStart} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, marginRight: 15 }}
          placeholder="End Date"
          value={formatDate(endDateTime)}
          editable={false}
          mode="outlined"
          label="End Date"
        />
        <TextInput
          style={{ flex: 1 }}
          placeholder="End Time"
          value={formatTime(endDateTime)}
          editable={false}
          mode="outlined"
          label="End Time"
        />
        <IconButton icon="calendar" onPress={showEnd} />
      </View>
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          compileData();
          setDialogShown(true);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};
const EmailForm = ({ value, setValue, setDialogShown }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const compileData = () => {
    const data = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    setValue(data);
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'To'}
        placeholder="johndoe@email.com"
        value={to}
        onChangeText={setTo}
      />
      <TextInput
        mode="outlined"
        label={'Subject'}
        placeholder="Enter Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        mode="outlined"
        label={'Body'}
        placeholder="Enter Body"
        multiline
        numberOfLines={10}
        style={{ minHeight: 150, maxHeight: 150 }}
        value={body}
        onChangeText={setBody}
      />

      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          compileData();
          setDialogShown(true);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};
const PhoneForm = ({ value, setValue, setDialogShown }) => {
  const [phone, setPhone] = useState('');

  const compileData = () => {
    const data = `tel:${phone}`;
    setValue(data);
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <TextInput
        mode="outlined"
        label={'Phone'}
        placeholder="+1 123-456-789"
        value={phone}
        onChangeText={setPhone}
        multiline
        numberOfLines={10}
      />
      <Button
        mode="outlined"
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => {
          compileData();
          setDialogShown(true);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
};

export default function CreateScreen() {
  const [type, setType] = useState('url');
  const [dialogShown, setDialogShown] = useState(false);
  const [value, setValue] = useState('');
  const qrRef = useRef();

  console.log(value);

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
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <View>
        <Text variant="headlineMedium" style={{ margin: 10 }}>
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
              setValue('');
            }}
            buttons={[
              {
                value: 'url',
                label: 'URL',
                icon: 'link',
              },
              { value: 'text', label: 'Plain Text', icon: 'text-box-outline' },
              { value: 'event', label: 'Event', icon: 'calendar' },
              {
                value: 'contact',
                label: 'Contact',
                icon: 'contacts-outline',
              },
              { value: 'email', label: 'Email', icon: 'email-outline' },
              { value: 'phone', label: 'Phone', icon: 'phone-outline' },
            ]}
          />
        </ScrollView>
      </View>

      {/* FORM TO RENDER */}
      {type === 'url' ? (
        <URLForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      ) : type === 'contact' ? (
        <ContactForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      ) : type === 'event' ? (
        <EventForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      ) : type === 'email' ? (
        <EmailForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      ) : type === 'phone' ? (
        <PhoneForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      ) : (
        <TextForm
          value={value}
          setValue={setValue}
          setDialogShown={setDialogShown}
        />
      )}

      <Portal>
        <Dialog
          visible={dialogShown}
          onDismiss={() => setDialogShown(false)}
          dismissable={false}
        >
          <Dialog.Title style={{ textAlign: 'center' }}>
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
