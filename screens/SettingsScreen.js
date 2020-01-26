import React from 'react';
import { View, Text, Picker, StyleSheet, Button, Platform } from 'react-native';
import { useSetCards, useLang, useSetLang } from '../store';
import useConfirm from '../confirm';
import langs from '../data/langs.json';

export default function SettingsScreen() {
  const setLang = useSetLang();
  const setCards = useSetCards();
  const confirm = useConfirm('Delete', 'This can’t be undone');

  return (
    <View style={styles.container}>
      <Text style={styles.settingsLabel}>What language are you learning?</Text>
      <Picker
        selectedValue={useLang()}
        style={[
          styles.picker,
          Platform.OS === 'ios' && { marginHorizontal: -30 },
        ]}
        onValueChange={(itemValue, itemIndex) => setLang(itemValue)}>
        {Object.entries(langs).map(([code, label]) => (
          <Picker.Item key={code} label={label} value={code} />
        ))}
      </Picker>
      <Text style={styles.settingsLabel}>Want a redo?</Text>
      <View style={{ margin: 20 }}>
        <Button
          color="red"
          onPress={() =>
            confirm().then(ok => {
              if (ok) {
                setCards([]);
              }
            })
          }
          title="Delete all cards"
        />
      </View>
    </View>
  );
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
    textAlign: 'center',
  },
  picker: {
    fontSize: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
