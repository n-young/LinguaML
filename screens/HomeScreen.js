import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { RNCamera } from 'react-native-camera';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={this.styles.container}>
        <StatusBar hidden />
        <RNCamera
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          captureAudio={false}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={this.styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </RNCamera>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });
}

export default HomeScreen;
