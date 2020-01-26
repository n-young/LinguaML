import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';
import CardScreen from './screens/CardScreen';
import EditCardScreen from './screens/EditCardScreen';

enableScreens();

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

HomeScreen.navigationOptions = {
  tabBarLabel: 'Home',
};

HomeScreen.path = '';

const LinksStack = createNativeStackNavigator();
function LinksStackScreen() {
  return (
    <LinksStack.Navigator>
      <LinksStack.Screen
        name="Cards"
        component={LinksScreen}
        options={{ headerLargeTitle: true }}
      />
      <LinksStack.Screen name="Card" component={CardScreen} />
      <LinksStack.Screen name="EditCard" component={EditCardScreen} />
    </LinksStack.Navigator>
  );
}

const Main = createNativeStackNavigator();

export default function App(props) {
  return (
    <View style={styles.container}>
      <NavigationNativeContainer>
        <Main.Navigator>
          <Main.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />
          <Main.Screen name="Cards" component={LinksStackScreen} />
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
