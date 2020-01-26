import React, { useState, useContext } from 'react';

const cardContext = React.createContext([]);
const cardSetterContext = React.createContext(() => {});
const langContext = React.createContext('');
const langSetterContext = React.createContext(() => '');

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

export function useSetCards() {
  return useContext(cardSetterContext);
}

export function useLang() {
  return useContext(langContext);
}

export function useSetLang() {
  return useContext(langSetterContext);
}
