import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';
import CardScreen from './screens/CardScreen';
import EditCardScreen from './screens/EditCardScreen';

enableScreens();

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const Main = createNativeStackNavigator();
export default function App(props) {
  return (
    <View style={styles.container}>
      <NavigationNativeContainer>
        <Main.Navigator>
          <Main.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Main.Screen
            name="Cards"
            component={LinksScreen}
            options={{ headerLargeTitle: true, headerBackTitle: 'Camera' }}
          />
          <Main.Screen name="Card" component={CardScreen} />
          <Main.Screen name="EditCard" component={EditCardScreen} />
        </Main.Navigator>
      </NavigationNativeContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
