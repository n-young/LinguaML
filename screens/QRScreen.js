import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import qrcode from 'yaqrcode';
import { useCard } from '../store';

export default function QRScreen() {
  const card = useCard();
  const navigation = useNavigation();
  navigation.setOptions({ title: '' });
  return (
    <View style={styles.wrapper}>
      <Image
        style={styles.qr}
        source={{
          uri: qrcode(
            JSON.stringify({
              key: 'LinguaML_Vocab',
              native: card.native,
              foreign: card.foreign,
            })
          ),
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr: {
    flex: 1,
    width: 200,
    height: 200,
  },
});
