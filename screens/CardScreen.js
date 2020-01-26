import React, { useReducer } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Easing,
  Button,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/core';
import FlipView from '../components/FlipView';
import { useNavigation } from '@react-navigation/native';
import useDeviceOrientation from '@rnhooks/device-orientation';
import Tts from 'react-native-tts';

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
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    margin: 16,
    marginTop: 200 + 32 + 16,
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
  const navigation = useNavigation();
  const [flipped, flip] = useReducer(f => !f, false);
  navigation.setOptions({
    headerRight: () => (
      <>
        <Button
          onPress={() => navigation.navigate('EditCard', { card })}
          title="Edit"
          style={{ marginRight: 16 }}
        />
        <Button onPress={() => Tts.speak(flipped ? card.native : card.foreign)} title="Speak" />
      </>
    ),
  });
  return (
    <TouchableWithoutFeedback onPress={flip}>
      <View style={styles.wrapper}>
        <FlipView
          isFlipped={flipped}
          flipDuration={250}
          style={{ zIndex: 1 }}
          flipEasing={Easing.linear}
          front={<Card label={card.foreign} />}
          back={<Card label={card.native} />}
        />
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpg;base64,${card.image}` }}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
