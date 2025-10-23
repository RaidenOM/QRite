import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getHistory() {
  try {
    const storedDataString = await AsyncStorage.getItem('history');
    const storedData = storedDataString ? JSON.parse(storedDataString) : [];
    return storedData;
  } catch (error) {
    Alert.alert('Error', 'Error retreiving history');
  }
}
