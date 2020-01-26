import { ActionSheetIOS } from 'react-native';

export default function confirm(action, title) {
  return new Promise(resolve => {
    ActionSheetIOS.showActionSheetWithOptions(
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
