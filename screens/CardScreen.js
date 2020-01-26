import React, { useReducer } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Easing,
  Button,
} from 'react-native';
import { useRoute } from '@react-navigation/core';
import FlipView from '../components/FlipView';
import { useNavigation } from '@react-navigation/native';
import useDeviceOrientation from '@rnhooks/device-orientation';

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 16,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
  },
  portraitCard: {
    height: 200,
  },
  landscapeCard: {
    flex: 1,
  },
  cardText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  wrapper: {
    flex: 1,
  },
});

function Card({ label }) {
  return (
    <View
      style={[
        styles.card,
        useDeviceOrientation() === 'landscape'
          ? styles.landscapeCard
          : styles.portraitCard,
      ]}>
      <Text style={styles.cardText}>{label}</Text>
    </View>
  );
}

export default function CardScreen() {
  const { card } = useRoute().params;
  const [flipped, flip] = useReducer(f => !f, false);
  useNavigation().setOptions({
    headerRight: () => <Button onPress={() => {}} title="Edit" />,
  });
  return (
    <TouchableWithoutFeedback onPress={flip}>
      <View style={styles.wrapper}>
        <FlipView
          isFlipped={flipped}
          flipDuration={250}
          flipEasing={Easing.linear}
          front={<Card label={card.foreign} />}
          back={<Card label={card.native} />}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
