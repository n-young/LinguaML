import React, { useReducer } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import { useRoute } from '@react-navigation/core';
import FlipView from '../components/FlipView';

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    backgroundColor: 'white',
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  cardText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  wrapper: {
    flex: 1,
  },
});

export default function CardScreen() {
  const { card } = useRoute().params;
  const [flipped, flip] = useReducer(f => !f, false);
  return (
    <TouchableWithoutFeedback onPress={flip}>
      <View style={styles.wrapper}>
        <FlipView
          isFlipped={flipped}
          flipDuration={250}
          flipEasing={Easing.linear}
          front={
            <View style={styles.card}>
              <Text style={styles.cardText}>{card.foreign}</Text>
            </View>
          }
          back={
            <View style={styles.card}>
              <Text style={styles.cardText}>{card.native}</Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
