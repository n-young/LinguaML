import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useDeviceOrientation from '@rnhooks/device-orientation';

export default function Card({ label }) {
  return (
    <View
      style={[
        styles.card,
        useDeviceOrientation() === 'landscape'
          ? styles.landscapeCard
          : styles.portraitCard,
      ]}>
      <Text style={styles.cardText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    elevation: 12,
  },
  portraitCard: {
    height: 200,
  },
  landscapeCard: {
    flex: 1,
  },
  cardText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
