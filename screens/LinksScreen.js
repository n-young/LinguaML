import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Platform,
} from 'react-native';
import { withNavigation } from 'react-navigation';

export default function CardListScreen() {
  return (
    <FlatList
      style={styles.container}
      data={[
        { image: 'id-e-f-g', id: '1', native: 'abc', foreign: 'def' },
        { image: 'id-e-f-g', id: '2', native: 'abc', foreign: 'def' },
        { image: 'id-e-f-g', id: '3', native: 'abc', foreign: 'def' },
      ]}
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

const CardRow = withNavigation(_CardRow);
/** @type {{navigation: import('react-navigation').NavigationScreenProp }} */
function _CardRow({ navigation, card, separators }) {
  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Card', { card })}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.row}>
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

export function CardView({ card }) {
  return <Text>lo and behold</Text>;
}
