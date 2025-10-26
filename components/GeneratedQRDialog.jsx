import { useRef } from 'react';
import { Button, Dialog, Portal } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';

export default function GeneratedQRDialog({ value, visible, onDismiss }) {
  const qrRef = useRef(null);

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
    <Portal>
      <Dialog visible={visible}>
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
          <QRCode value={value} size={200} getRef={c => (qrRef.current = c)} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={shareQR}>Share as PNG</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
