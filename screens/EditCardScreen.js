import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, View, Text, TextInput, Button, AsyncStorage } from 'react-native';
import useConfirm from '../confirm';
import { useCard, useSetCards } from '../store';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 32,
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
  const card = useCard();
  const setCards = useSetCards();
  const navigation = useNavigation();
  const confirm = useConfirm('Delete', 'This can’t be undone');
  navigation.setOptions({ title: 'Edit Card' });
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>native</Text>
        <TextInput
          style={styles.input}
          value={card.native}
          onChange={e =>
            setCards(cards => {
              const idx = cards.findIndex(c => c.id === card.id);
              return [
                ...cards.slice(0, idx),
                { ...cards[idx], native: e.nativeEvent.text },
                ...cards.slice(idx + 1),
              ];
            })
          }
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>foreign</Text>
        <TextInput
          style={styles.input}
          value={card.foreign}
          onChange={e =>
            setCards(cards => {
              const idx = cards.findIndex(c => c.id === card.id);
              return [
                ...cards.slice(0, idx),
                { ...cards[idx], foreign: e.nativeEvent.text },
                ...cards.slice(idx + 1),
              ];
            })
          }
        />
      </View>
      <View style={[styles.row, { justifyContent: 'center' }]}>
        <Button
          color="red"
          title="Delete Card"
          onPress={() =>
            confirm().then(ok => {
              if (ok) {
                setCards(cards => cards.filter(c => c.id !== card.id));
                navigation.navigate({ key: 'card-list' });
              }
            })
          }
        />
      </View>
    </View>
  );
}
