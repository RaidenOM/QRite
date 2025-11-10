import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  List,
  Modal,
  Portal,
  RadioButton,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

export default function ContactPicker({
  contacts,
  showPicker,
  onPickerDismiss,
  onPickerSelect,
}) {
  const [searchedContacts, setSearchedContacts] = useState();
  const [pickedContact, setPickedContact] = useState();
  const [search, setSearch] = useState('');
  const theme = useTheme();

  useEffect(() => {
    setSearchedContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    if (!contacts) return;

    const timeout = setTimeout(() => {
      const normalizedSearch = search.toLowerCase().replace(/\s/g, '');
      const filtered = contacts.filter(contact =>
        contact.displayName
          .toLowerCase()
          .replace(/\s/g, '')
          .includes(normalizedSearch),
      );
      setSearchedContacts(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, contacts]);

  return (
    <Portal>
      <Modal
        visible={showPicker}
        contentContainerStyle={{
          marginHorizontal: 20,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness,
          padding: 16,
        }}
      >
        <Text
          variant="headlineMedium"
          style={{
            fontFamily: 'Poppins-ExtraLight',
            textAlign: 'center',
          }}
        >
          Select Recipient
        </Text>

        <Searchbar
          value={search}
          onChangeText={setSearch}
          icon={'magnify'}
          placeholder="Search"
          style={{ marginTop: 10 }}
        />

        <RadioButton.Group
          onValueChange={value => setPickedContact(JSON.parse(value))}
          value={pickedContact ? JSON.stringify(pickedContact) : ''}
        >
          <View style={{ maxHeight: 300, minHeight: 300, marginTop: 24 }}>
            <FlatList
              data={searchedContacts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View>
                  <List.Item title={item.displayName} />
                  <View style={{ marginLeft: 16 }}>
                    {item.phoneNumbers.map((phoneItem, index) => (
                      <List.Item
                        title={phoneItem.number}
                        key={index}
                        left={() => (
                          <RadioButton
                            value={JSON.stringify({
                              name: item.displayName || '',
                              phone: phoneItem.number || '',
                              email: item.emailAddresses?.[0]?.email || '',
                              company: item.company || '',
                            })}
                          />
                        )}
                      />
                    ))}
                  </View>
                </View>
              )}
            />
          </View>
        </RadioButton.Group>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Button onPress={onPickerDismiss}>Cancel</Button>
          <Button
            disabled={!pickedContact}
            onPress={() => onPickerSelect(pickedContact)}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
