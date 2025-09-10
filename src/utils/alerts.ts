import { Alert } from "react-native";

interface Error {
  message: string;
  [id: string]: any;
}

export function errorAlert(title: string, error: Error) {
  Alert.alert(title, error.message, undefined, { cancelable: true });
}

export function infoAlert(title: string, message: string) {
  Alert.alert(title, message, undefined, { cancelable: true });
}

export function confirmationAlert(
  title: string,
  message: string,
  onConfirm: () => void,
) {
  Alert.alert(title, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "OK",
      onPress: onConfirm,
    },
  ]);
}
