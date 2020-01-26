import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Share,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import Environment from '../config/environment';
import firebase from '../config/firebase';
import { orange } from '../constants';
import { useCards, useSetCards } from '../store';
import uuid from 'uuid/v4';

function HomeScreen() {
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef();
  const navigation = useNavigation();
  const setCards = useSetCards();

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setUploading(true);
      try {
        const response = await callGoogleVisionApi(data.base64).finally(() =>
          setUploading(false)
        );
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
          <View style={{ width: 50 }} />
          <View style={styles.shutterBorder}>
            <TouchableOpacity
              onPress={takePicture}
              activeOpacity={0.75}
              style={styles.capture}>
              <View style={styles.shutterButton} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cards')}
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
    borderColor: orange,
    padding: 5,
    borderRadius: 40,
  },
  shutterButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
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
