import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function addToHistory(type, value) {
  try {
    const storedDataString = await AsyncStorage.getItem('history');
    const storedData = storedDataString ? JSON.parse(storedDataString) : [];
    console.log(storedData);
    const newData = [
      { type, value, data: new Date().toISOString() },
      ...storedData,
    ];
    await AsyncStorage.setItem('history', JSON.stringify(newData));
  } catch (error) {
    Alert.alert('Error', 'Error adding to history');
  }
}
