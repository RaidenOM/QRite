import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';

export default function EventForm({ onGenerate, style }) {
  const [title, setTitle] = useState('');
  const [description, setDiscription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date(Date.now()));
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now()));

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

  const showStart = () => {
    DateTimePickerAndroid.open({
      value: startDateTime,
      mode: 'date',
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed') return;
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
        if (event.type === 'dismissed') return;

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
    <View style={style}>
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
        onPress={async () => {
          onGenerate(data);
        }}
      >
        Generate QR
      </Button>
    </View>
  );
}
