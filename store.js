import React, { useState, useContext } from 'react';

const valueContext = React.createContext([]);
const setterContext = React.createContext(() => {});

export function Provider({ children }) {
  const [cards, setCards] = useState([]);
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
