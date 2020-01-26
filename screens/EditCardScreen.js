import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/core';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import useConfirm from '../confirm';
import { useSetCards } from '../store';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 16,
    width: 50,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    padding: 8,
    backgroundColor: 'white',
    color: 'black',
  },
});
export default function EditCardScreen() {
  const { card } = useRoute().params;
  const setCards = useSetCards();
  const navigation = useNavigation();
  const confirm = useConfirm('Delete', 'This can’t be undone')
  navigation.setOptions({
    title: `Edit ${card.id}`,
    headerRight: () => <Button onPress={() => { }} title="Edit" />,
  });
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>native</Text>
        <TextInput style={styles.input} value={card.native} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>foreign</Text>
        <TextInput style={styles.input} value={card.foreign} />
      </View>
      <Button
        style={styles.row}
        color="red"
        title="Delete Card"
        onPress={() =>
          confirm().then(ok => {
            if (ok) {
              setCards(cards => cards.filter(c => c.id !== card.id));
            }
          })
        }
      />
    </View>
  );
}
