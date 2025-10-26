import validator from 'validator';

const getType = scannedValue => {
  const normalizedScannedValue = scannedValue.trim().toLowerCase();
  let detectedType;

  if (normalizedScannedValue.startsWith('mailto:')) {
    detectedType = 'Email';
  } else if (
    normalizedScannedValue.startsWith('begin:vcard') &&
    normalizedScannedValue.endsWith('end:vcard')
  ) {
    detectedType = 'Contact';
  } else if (
    normalizedScannedValue.startsWith('begin:vevent') &&
    normalizedScannedValue.endsWith('end:vevent')
  ) {
    detectedType = 'Event';
  } else if (normalizedScannedValue.startsWith('tel:')) {
    detectedType = 'Phone';
  } else if (
    validator.isURL(normalizedScannedValue, { require_protocol: false })
  ) {
    detectedType = 'URL';
  } else {
    detectedType = 'Plaintext';
  }

  return detectedType;
};

export default getType;
