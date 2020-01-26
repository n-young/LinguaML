import React, { useReducer } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Easing,
  Button,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import FlipView from '../components/FlipView';
import { useCard, useLang } from '../store';
import Tts from 'react-native-tts';
import Card from '../components/Card';

Tts.setIgnoreSilentSwitch('ignore');

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
              Tts.setDefaultLanguage(flipped ? 'en' : card.lang);
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

  try {
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
          <View style={styles.imageWrap}>
            <Image
              style={styles.image}
              source={{ uri: `data:image/jpg;base64,${card.image}` }}
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  } catch (e) {
    console.log(e);
    console.log('Card has been deleted');
    return (
      <View style={styles.blankSlate}>
        <Text style={styles.blankSlateLabel}>No card</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: { marginHorizontal: 8 },
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    flex: 1,
    margin: 16,
    marginTop: 200 + 32 + 16,
    display: 'flex',
  },
  image: {
    height: '100%',
    borderRadius: 8,
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
});
