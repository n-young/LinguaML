import { useActionSheet } from '@expo/react-native-action-sheet'

export default function useConfirm(action, title) {
  const { showActionSheetWithOptions } = useActionSheet();
  return () => new Promise(resolve => {
    showActionSheetWithOptions(
      {
        options: ['Cancel', action],
        title,
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      idx => {
        resolve(!!idx);
      }
    );
  });
}
