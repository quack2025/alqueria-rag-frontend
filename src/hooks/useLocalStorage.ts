// useLocalStorage.ts - Hook personalizado para manejar localStorage

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage
      const item = window.localStorage.getItem(key);
      // Parsear el JSON almacenado o devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error, devolver valor inicial
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el estado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}