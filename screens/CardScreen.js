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
import { useNavigation } from '@react-navigation/core';
import FlipView from '../components/FlipView';
import { useCard, useLang } from '../store';
import useDeviceOrientation from '@rnhooks/device-orientation';
import Tts from 'react-native-tts';

Tts.setIgnoreSilentSwitch('ignore');

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
  const card = useCard();
  const navigation = useNavigation();
  const lang = useLang();
  const [flipped, flip] = useReducer(f => !f, false);

  navigation.setOptions({
    title: '',
    headerRight: () => (
      <>
        <View style={styles.toolbar}>
          <Button
            onPress={() => navigation.navigate('EditCard', { id: card.id })}
            title="Edit"
          />
        </View>
        <View style={styles.toolbar}>
          <Button
            onPress={() => {
              Tts.stop();
              Tts.setDefaultLanguage(flipped ? 'en' : lang);
              Tts.speak(flipped ? card.native : card.foreign);
            }}
            title="Speak"
          />
        </View>
        <View style={styles.toolbar}>
          <Button
            onPress={() => navigation.navigate('ShowQR', { id: card.id })}
            title="Share"
          />
        </View>
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
    elevation: 12,
  },
  portraitCard: {
    height: 200,
  },
  landscapeCard: {
    flex: 1,
  },
  toolbar: { marginHorizontal: 8 },
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
