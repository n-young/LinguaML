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
import uuid from 'uuid';
import Environment from '../config/environment';
import firebase from '../config/firebase';

function HomeScreen() {
  const [uploading, setUploading] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null);
  const cameraRef = useRef();
  const navigation = useNavigation();

  const takePicture = async () => {
    if (cameraRef.current) {
      console.log('Hurrah');
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const uploadUrl = await uploadImageAsync(data.uri);
      setUploading(true);
      try {
        const response = await submitToGoogle(uploadUrl).finally(() =>
          setUploading(false)
        );
        setGoogleResponse(response);
        console.log(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
    console.log('eeea');
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

const submitToGoogle = async image => {
  let body = JSON.stringify({
    requests: [
      {
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'LANDMARK_DETECTION', maxResults: 5 },
          { type: 'FACE_DETECTION', maxResults: 5 },
          { type: 'LOGO_DETECTION', maxResults: 5 },
          { type: 'TEXT_DETECTION', maxResults: 5 },
          { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
          { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
          { type: 'IMAGE_PROPERTIES', maxResults: 5 },
          { type: 'CROP_HINTS', maxResults: 5 },
          { type: 'WEB_DETECTION', maxResults: 5 },
        ],
        image: {
          source: {
            imageUri: image,
          },
        },
      },
    ],
  });
  console.log('Body:');
  console.log(body);
  let response = await fetch(
    'https://vision.googleapis.com/v1/images:annotate?key=' +
      Environment.GOOGLE_CLOUD_VISION_API_KEY,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    }
  );
  console.log('Response:');
  console.log(response);
  let responseJson = await response.json();
  console.log(responseJson);
  return responseJson;
};

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
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
  },
});

export default HomeScreen;
