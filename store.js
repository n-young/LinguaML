import React, { useState, useContext } from 'react';
import { AsyncStorage } from 'react-native';
import { useRoute } from '@react-navigation/core';

const cardContext = React.createContext([]);
const cardSetterContext = React.createContext(() => { });
const langContext = React.createContext('');
const langSetterContext = React.createContext(() => '');

// create a function that saves your data asyncronously
_storeCard = async (card) => {
  try {
    let cardData = {};
    cardData.image = card.image;
    cardData.id = card.id;
    cardData.native = card.native;
    cardData.foreign = card.foreign;
    await AsyncStorage.setItem(card.id, JSON.stringify(cardData));
  } catch (error) {
    // Error saving data
    throw (error);
  }
}

export async function storeCard(card) {
  try {
    let cardData = {};
    cardData.image = card.image;
    cardData.id = card.id;
    cardData.native = card.native;
    cardData.foreign = card.foreign;
    await AsyncStorage.setItem(card.id, JSON.stringify(cardData));
  } catch (error) {
    // Error saving data
    throw (error);
  }
}

_retrieveCard = async (card_id) => {
  try {
    const value = await AsyncStorage.getItem(card_id);
    if (value !== null) {
      // Our data is fetched successfully
      return value;
    }
  } catch (error) {
    // Error retrieving data
  }
}

export async function retrieveCard(card_id) {
  try {
    const value = await AsyncStorage.getItem(card_id);
    if (value !== null) {
      // Our data is fetched successfully
      let out = JSON.parse(value);
      return out;
    }
  } catch (error) {
    // Error retrieving data
    throw (error);
  }
}

export async function retrieveAllCards() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let cards = [];
    for (const key of keys) {
      let card = await retrieveCard(key);
      cards.push(card);
    }
    return cards;
  } catch (error) {
    throw error;
  }
}

export function Provider({ children }) {
  const [cards, setCards] = useState([]);
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
