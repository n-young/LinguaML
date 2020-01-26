import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCards } from '../store';

export default function CardListScreen() {
  const cards = useCards();
  return cards.length ? (
    <FlatList
      style={styles.container}
      data={cards}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={
        Platform.OS !== 'android' &&
        (({ highlighted }) => (
          <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
        ))
      }
      renderItem={({ item, separators }) => (
        <CardRow card={item} separators={separators} />
      )}
    />
  ) : (
    <View style={styles.blankSlate}>
      <Text style={styles.blankSlateLabel}>No cards</Text>
    </View>
  );
}

CardListScreen.navigationOptions = {
  title: 'Cards',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blankSlate: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankSlateLabel: {
    fontSize: 50,
    fontWeight: '300',
    opacity: 0.33,
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
    width: 10,
    height: 10,
    transform: [{ rotateZ: '45deg' }],
  },
});

function CardRow({ card, separators }) {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Card', { id: card.id })}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.row}>
        <StatusBar hidden={false} />
        <View style={styles.rowLabels}>
          <Text style={styles.title}>{card.foreign}</Text>
          <Text style={styles.subtitle}>{card.native}</Text>
        </View>
        <DisclosureArrow />
      </View>
    </TouchableHighlight>
  );
}

function DisclosureArrow() {
  return <View style={styles.disclosureArrow} />;
}
