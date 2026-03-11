import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HelpAndFeedbackScreen() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
      }}
    ></View>
  );
}
