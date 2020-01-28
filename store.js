import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute } from '@react-navigation/core';

const cardContext = React.createContext();
const cardSetterContext = React.createContext();
const langContext = React.createContext();
const langSetterContext = React.createContext();

async function put(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

async function pull(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {
      console.log("Pull");
      console.log(value);
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
  }
}

export function Provider({ children }) {
  const [cards, setCards] = useState(null);
  const [lang, setLang] = useState('fr');
  useEffect(() => {
    pull('cards').then(c => setCards(c || []));
    pull('lang').then(l => setLang(l || 'fr'));
  }, []);
  useEffect(() => {
    if (cards) {
      put('cards', cards);
    }
  }, [cards]);
  useEffect(() => {
    if (lang) {
      put('lang', lang);
    }
  }, [lang]);

  return (
    <cardContext.Provider value={cards || []}>
      <cardSetterContext.Provider value={setCards}>
        <langContext.Provider value={lang}>
          <langSetterContext.Provider value={setLang}>
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
