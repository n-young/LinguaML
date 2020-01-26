import React, { useState, useContext } from 'react';
import { AsyncStorage } from 'react-native';
import { useRoute } from '@react-navigation/core';

const cardContext = React.createContext([]);
const cardSetterContext = React.createContext(() => { });
const langContext = React.createContext('');
const langSetterContext = React.createContext(() => '');

export async function putCards(elt) {
  try {
    await AsyncStorage.setItem('cards', JSON.stringify(elt));
    console.log("successfully saved cards");
  } catch (error) {
    console.log(error);
  }
};

export async function pullCards() {
  try {
    const value = await AsyncStorage.getItem('cards');
    if (value !== null) {
      console.log(value);
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(err);
  }
  return [];
};

export function Provider({ children }) {
  const [cards, setCards] = useState(() => pullCards());
  const [language, setLanguage] = useState('fr');

  return (
    <cardContext.Provider value={cards}>
      <cardSetterContext.Provider value={setCards}>
        <langContext.Provider value={language}>
          <langSetterContext.Provider value={setLanguage}>
            {children}
          </langSetterContext.Provider>
        </langContext.Provider>
      </cardSetterContext.Provider>
    </cardContext.Provider>
  );
}

export function useCards() {
  return useContext(cardContext);
}

export function useCard() {
  const { id } = useRoute().params;
  return useCards().find(c => c.id === id);
}

export function useSetCards() {
  return useContext(cardSetterContext);
}

export function useLang() {
  return useContext(langContext);
}

export function useSetLang() {
  return useContext(langSetterContext);
}
