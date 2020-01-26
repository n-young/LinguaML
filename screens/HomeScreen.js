import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Vibration,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import Environment from '../config/environment';
import { red, orange, green } from '../constants';
import { useCards, useSetCards, useLang, useSetLang, putCards, pullCards } from '../store';
import uuid from 'uuid/v4';
import Translator from './Translate';
import Card from '../components/Card';

function HomeScreen() {
  const [loadState, setLoadState] = useState('idle');
  const [cardLabel, setCardLabel] = useState('');
  const cameraRef = useRef();
  const navigation = useNavigation();
  const setCards = useSetCards();
  const cards = useCards();
  const lang = useLang();
  const valueRef = useRef(new Animated.Value(0));

  const loadStateRef = useRef();
  loadStateRef.current = loadState;

  const addCard = card => {
    setCards(cards => cards.concat(card));
    setTimeout(() => {
      setLoadState('ok');
      setTimeout(() => setLoadState('idle'), 1500);
      Vibration.vibrate();
    }, 180);
    setCardLabel(card.foreign);
    Animated.sequence([
      Animated.timing(valueRef.current, {
        toValue: 1,
        duration: 1500,
      }),
      Animated.timing(valueRef.current, {
        toValue: 0,
        duration: 1,
      }),
    ]).start();
    putCards(cards);
    setLoadState('ok');
    setTimeout(() => setLoadState('idle'), 1500);
    Vibration.vibrate();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, doNotSave: true, base64: true };
      setLoadState('loading');
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        const promise = callGoogleVisionApi(data.base64);
        const response = await promise;
        const translate = await Translator(response, lang);
        console.log(response);
        console.log(translate[0].translations[0].text);

        try {
          const finalCardTranslate = translate[0].translations[0].text;
          typeof finalCardTranslate !== 'undefined';
          addCard({
            image: data.base64,
            id: uuid(),
            native: response,
            foreign: finalCardTranslate,
          });
        } catch (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
        setLoadState('err');
        setTimeout(() => setLoadState('idle'), 1500);
      }
    }
  };

  const barcodeRecognized = ({ data }) => {
    try {
      const obj = JSON.parse(data);
      if (
        obj.key === 'LinguaML_Vocab' &&
        !cards.some(x => x.native === obj.native && x.foreign === obj.foreign)
      ) {
        addCard({ id: uuid(), native: obj.native, foreign: obj.foreign });
      }
    } catch {
      console.log('invalid', data);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <RNCamera
        ref={cameraRef}
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        captureAudio={false}
        onBarCodeRead={barcodeRecognized}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.75}>
            <Text style={styles.listButton}>⚙&#xfe0e;</Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.shutterBorder,
              styles[`shutterBorder_${loadState}`],
            ]}>
            <TouchableOpacity
              onPress={takePicture}
              activeOpacity={0.75}
              style={styles.capture}>
              <View style={styles.shutterButton} />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate({ name: 'Cards', key: 'card-list' })
            }
            activeOpacity={0.75}>
            <Text style={styles.listButton}>☰</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
      <View style={styles.spinner} pointerEvents="none">
        <ActivityIndicator animating={loadState === 'loading'} size="large" />
      </View>
      <Animated.View
        style={{
          width: '100%',
          position: 'absolute',
          opacity: valueRef.current.interpolate({
            inputRange: [0, 0.25, 0.8, 1],
            outputRange: [0.5, 1, 1, 0],
          }),
          top: 0,
          transform: [
            {
              translateX: valueRef.current.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 0, Dimensions.get('window').width * 0.4],
              }),
            },
            {
              translateY: valueRef.current.interpolate({
                inputRange: [0, 0.25, 1],
                outputRange: [-50, 0, Dimensions.get('window').height - 170],
              }),
            },
            {
              scale: valueRef.current.interpolate({
                inputRange: [0, 0.25, 0.8, 1],
                outputRange: [0, 1, 1, 0.1],
              }),
            },
          ],
        }}>
        <Card label={cardLabel} />
      </Animated.View>
    </View>
  );
}

async function callGoogleVisionApi(base64) {
  let googleVisionRes = await fetch(
    'https://vision.googleapis.com/v1/images:annotate?key=' +
    Environment.GOOGLE_CLOUD_VISION_API_KEY,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64,
            },
            features: [
              { type: 'OBJECT_LOCALIZATION', maxResults: 1 },
              { type: 'LABEL_DETECTION', maxResults: 1 }
            ],
          },
        ],
      }),
    }
  );

  const data = await googleVisionRes.json();
  console.log(data.responses[0].localizedObjectAnnotations[0]);
  console.log(data.responses[0].labelAnnotations[0]);

  if (data) {
    const objRes = data.responses[0].localizedObjectAnnotations[0];
    const labRes = data.responses[0].labelAnnotations[0];
    if (objRes.score > labRes.score) {
      return objRes.name;
    }
    return labRes.description;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 30,
  },
  shutterBorder: {
    borderWidth: 5,
    padding: 5,
    borderRadius: 100,
  },
  shutterBorder_idle: { borderColor: orange },
  shutterBorder_loading: { borderColor: 'rgba(255, 255, 255, 0.5)' },
  shutterBorder_ok: { borderColor: green },
  shutterBorder_err: { borderColor: red },
  shutterButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  spinner: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  listButton: {
    width: 50,
    color: 'white',
    fontSize: 50,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
});

export default HomeScreen;
