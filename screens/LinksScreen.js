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
  return (
    <FlatList
      style={styles.container}
      data={useCards()}
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

function CardRow({ card, separators }) {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Card', { card })}
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
