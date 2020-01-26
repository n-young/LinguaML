import React, { useState, useContext } from 'react';

const valueContext = React.createContext([]);
const setterContext = React.createContext(() => { });

export function Provider({ children }) {
  const [cards, setCards] = useState([
    { image: 'id-e-f-g', id: '1', native: 'Hello', foreign: 'Bonjour' },
    { image: 'id-e-f-g', id: '2', native: 'Bye', foreign: 'Au reviour' },
    { image: 'id-e-f-g', id: '3', native: 'Eat', foreign: 'Manger' },
  ]);
  return (
    <valueContext.Provider value={cards}>
      <setterContext.Provider value={setCards}>
        {children}
      </setterContext.Provider>
    </valueContext.Provider>
  );
}

export function useCards() {
  return useContext(valueContext);
}

export function useSetCards() {
  return useContext(setterContext);
}
