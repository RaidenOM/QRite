import { Linking } from 'react-native';
import validator from 'validator';

const getType = async scannedValue => {
  const normalizedScannedValue = scannedValue.trim().toLowerCase();
  let detectedType;

  if (normalizedScannedValue.startsWith('mailto:')) {
    detectedType = 'Email';
  } else if (normalizedScannedValue.startsWith('sms:')) {
    detectedType = 'SMS';
  } else if (
    normalizedScannedValue.startsWith('begin:vcard') &&
    normalizedScannedValue.endsWith('end:vcard')
  ) {
    detectedType = 'Contact';
  } else if (
    normalizedScannedValue.startsWith('begin:vcalendar') &&
    normalizedScannedValue.endsWith('end:vcalendar')
  ) {
    detectedType = 'Event';
  } else if (normalizedScannedValue.startsWith('tel:')) {
    detectedType = 'Phone';
  } else if (
    validator.isURL(normalizedScannedValue, { require_protocol: false })
  ) {
    detectedType = 'URL';
  } else if (await Linking.canOpenURL(normalizedScannedValue)) {
    detectedType = 'Link';
  } else {
    detectedType = 'Text';
  }

  return detectedType;
};

export default getType;
