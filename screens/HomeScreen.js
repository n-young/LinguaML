import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Vibration,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import Environment from '../config/environment';
import { red, orange, green } from '../constants';
import { useCards, useSetCards, useLang, useSetLang } from '../store';
import uuid from 'uuid/v4';
import Translator from './Translate';

function HomeScreen() {
  const [loadState, setLoadState] = useState('idle');
  const cameraRef = useRef();
  const navigation = useNavigation();
  const setCards = useSetCards();
  const cards = useCards();
  const lang = useLang();

  const loadStateRef = useRef();
  loadStateRef.current = loadState;

  const addCard = card => {
    setCards(cards => cards.concat(card));
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
        console.log(translate[0]["translations"][0]["text"]);

        try {
          const finalCardTranslate = translate[0]["translations"][0]["text"];
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
              { type: 'LABEL_DETECTION', maxResults: 1 },
              { type: 'TEXT_DETECTION', maxResults: 1 },
            ],
          },
        ],
      }),
    }
  );

  const data = await googleVisionRes.json();
  console.log(data);

  if (data) {
    const ret = data.responses[0].labelAnnotations[0].description;
    //console.log('LABEL: ', ret);
    // translate(ret, { from: 'en', to: this.state.foreignLanguage }).then(
    //   text => {
    //     console.log(text);
    //   }
    // );
    return ret;
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
