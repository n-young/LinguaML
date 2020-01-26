import React, { useState } from 'react';
import {
  View,
  Text,
  Picker,
  StyleSheet,
  Button,
} from 'react-native';
import { useCards, useSetCards, useLang, useSetLang } from '../store';
import useConfirm from '../confirm';

export default function SettingsScreen() {
  const langSetter = useSetLang();
  const cardSetter = useSetCards();
  const confirm = useConfirm('Delete', 'This can’t be undone');

  return (
    <View style={styles.container}>
      <Text style={styles.settingsLabel}>What language are you learning?</Text>
      <Picker
        selectedValue={useLang()}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) =>
          langSetter(itemValue)
        }>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="French" value="fr" />
        <Picker.Item label="Spanish" value="es" />
        <Picker.Item label="Japanese" value="ja" />
        <Picker.Item label="Chinese" value="zh" />
        <Picker.Item label="Korean" value="ko" />
      </Picker>
      <Text style={styles.settingsLabel}>Want a redo?</Text>
      <Button onPress={() =>
        confirm().then(ok => {
          if (ok) { cardSetter([]) }
        })
      } title="Delete all cards" />
    </View >
  )
}



SettingsScreen.navigationOptions = {
  title: 'Settings',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  settingsLabel: {
    fontSize: 25,
    fontWeight: '300',
  },
  picker: {
    fontSize: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  rowLabels: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 15,
  },

  disclosureArrow: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    width: 15,
    height: 15,
    transform: [{ rotateZ: '45deg' }],
  },
});