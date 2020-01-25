import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { RNCamera } from 'react-native-camera'

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
        <RNCamera
          style={{
            flex: 1,
            width: '100%',
          }}
          captureAudio={false}
        >
        </RNCamera>
       </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  }
});

export default App;
