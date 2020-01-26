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
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

function HomeScreen() {
  const [uploading, setUploading] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null);
  const cameraRef = useRef();
  const navigation = useNavigation();

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const pickerResult = await this.camera.takePictureAsync(options);
      this.callGoogleVisionApi(pickerResult.base64);
    }
  };

  callGoogleVisionApi = async base64 => {
    let googleVisionRes = await fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        Environment['GOOGLE_CLOUD_VISION_API_KEY'],
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

    await googleVisionRes
      .json()
      .then(googleVisionRes => {
        //console.log(googleVisionRes);
        if (googleVisionRes) {
          this.setState({
            googleVisionDetection: googleVisionRes.responses[0],
          });
          console.log('RESPONSE: ', this.state.googleVisionDetection);
          console.log(
            'LABEL: ',
            this.state.googleVisionDetection.labelAnnotations[0].description
          );
          const ret = this.state.googleVisionDetection.labelAnnotations[0]
            .description;
          translate(ret, { from: 'en', to: this.state.foreignLanguage }).then(
            text => {
              console.log(text);
            }
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.front}
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
            activeOpacity={0.75}
            style={styles.listButton}>
            <Text>Lists</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    </View>
  );
}

translateText = async text => {
  let translation = await translate.translate(text, this.state.foreignLanguage);
  console.log('Translations:', translation);
};

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
    borderColor: 'white',
    padding: 5,
    borderRadius: 40,
  },
  shutterButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  listButton: {
    width: 50,
    color: 'white',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default HomeScreen;
