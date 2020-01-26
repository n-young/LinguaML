import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import Environment from '../config/environment';
import { orange, green } from '../constants';
import { useSetCards } from '../store';
import uuid from 'uuid/v4';

function HomeScreen() {
  const [loadState, setLoadState] = useState('idle');
  const cameraRef = useRef();
  const navigation = useNavigation();
  const setCards = useSetCards();
  const borderPulseRef = useRef();
  if (!borderPulseRef.current) {
    borderPulseRef.current = new Animated.Value(0);
  }

  const loadStateRef = useRef();
  loadStateRef.current = loadState;

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      setLoadState('loading');
      const anim = Animated.loop(
        Animated.timing(borderPulseRef.current, { toValue: 1, duration: 1500 })
      );
      let cb = () => {};
      setTimeout(() =>
        anim.start(function check() {
          if (loadStateRef.current === 'loading') {
            anim.start(check);
          } else {
            anim.stop();
            requestAnimationFrame(cb);
          }
        })
      );
      await new Promise(r => setTimeout(r, 5000));
      const data = await cameraRef.current.takePictureAsync(options);
      try {
        const promise = callGoogleVisionApi(data.base64);
        promise
          .then(
            () => (cb = () => setLoadState('ok')),
            () => (cb = () => setLoadState('err'))
          )
          .finally(() => setTimeout(() => setLoadState('idle'), 5000));
        const response = await promise;
        setCards(cards =>
          cards.concat({
            image: data.base64,
            id: uuid(),
            native: response,
            foreign: response,
          })
        );
      } catch (error) {
        console.log(error);
      }
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
        captureAudio={false}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.75}>
            <Text style={styles.listButton}>⚙&#xfe0e;</Text>
          </TouchableOpacity>
<<<<<<< Updated upstream
          <Animated.View
            style={[
              styles.shutterBorder,
              styles[`shutterBorder_${loadState}`],
              loadState === 'loading' && {
                padding: borderPulseRef.current.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [5, 0, 5],
                }),
                borderWidth: borderPulseRef.current.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [5, 10, 5],
                }),
                borderColor: borderPulseRef.current.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [orange, '#fff', orange],
                }),
              },
            ]}>
=======
          <View style={[styles.shutterBorder]}>
>>>>>>> Stashed changes
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

/*
const translateText = async text => {
  let translation = await translate.translate(text, this.state.foreignLanguage);
  console.log('Translations:', translation);
};
*/

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

  const data = await googleVisionRes.json().catch(error => console.log(error));
  console.log(data);

  if (data) {
    const ret = data.responses[0].labelAnnotations[0].description;
    console.log('LABEL: ', ret);
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
  shutterBorder_loading: {},
  shutterBorder_ok: { borderColor: green },
  shutterBorder_err: { borderColor: 'salmon' },
  shutterButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  listButton: {
    width: 50,
    color: 'white',
    fontSize: 50,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default HomeScreen;
