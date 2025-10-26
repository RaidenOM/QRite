import { Button, Dialog, Portal, Text } from 'react-native-paper';

export default function AlertDialog({
  visible,
  onDismiss,
  title,
  content,
  buttons,
}) {
  return (
    <Portal>
      <Dialog visible={visible} dismissable={false}>
        <Dialog.Title style={{ fontFamily: 'Poppins-Regular' }}>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {buttons.length == 0 ? (
            <Button onPress={onDismiss}>OK</Button>
          ) : (
            buttons.map((button, index) => (
              <Button onPress={button.onPress} key={index}>
                {button.title}
              </Button>
            ))
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
