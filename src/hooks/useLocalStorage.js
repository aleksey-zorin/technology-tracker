import { useState, useEffect } from 'react';

/**
 * Кастомный хук для работы с localStorage
 * @param {string} key - Ключ для хранения в localStorage
 * @param {any} initialValue - Начальное значение
 * @returns {[any, Function]} - Текущее значение и функция для его обновления
 */
function useLocalStorage(key, initialValue) {
  // Инициализируем состояние с проверкой localStorage
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // Если значение существует, парсим его
      if (item) {
        // Проверяем, является ли item валидным JSON
        try {
          return JSON.parse(item);
        } catch (parseError) {
          console.warn(`Невозможно распарсить значение для ключа "${key}"`, parseError);
          return item; // Возвращаем как строку, если не JSON
        }
      }
      
      // Если значение не найдено, сохраняем initialValue
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (error) {
      console.error(`Ошибка при чтении ключа "${key}" из localStorage:`, error);
      return initialValue;
    }
  });

  // Эффект для синхронизации между вкладками
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Ошибка при парсинге нового значения для ключа "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Функция для обновления значения
  const setValue = (value) => {
    try {
      // Поддерживаем функцию, как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем в состояние
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Создаем событие для синхронизации между вкладками
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore)
        }));
      }
    } catch (error) {
      console.error(`Ошибка при сохранении ключа "${key}" в localStorage:`, error);
    }
  };

  // Функция для удаления значения
  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Ошибка при удалении ключа "${key}" из localStorage:`, error);
    }
  };

  // Функция для очистки всех данных с префиксом
  const clearAllWithPrefix = (prefix) => {
    try {
      if (typeof window !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => window.localStorage.removeItem(key));
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Ошибка при очистке localStorage с префиксом "${prefix}":`, error);
    }
  };

  return [storedValue, setValue, removeValue, clearAllWithPrefix];
}

export default useLocalStorage;