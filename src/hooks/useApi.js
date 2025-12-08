import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Универсальный кастомный хук для работы с API
 * @param {string} url - URL API эндпоинта
 * @param {Object} options - Настройки fetch запроса
 * @param {boolean} manual - Запускать ли запрос автоматически
 * @param {Array} dependencies - Зависимости для повторного запроса
 */
function useApi(url, options = {}, manual = false, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);

  // Функция для выполнения запроса
  const fetchData = useCallback(async (abortController) => {
    // Отменяем предыдущий запрос, если он существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = abortController || new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Если URL пустой, не выполняем запрос
      if (!url) {
        setData(null);
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Проверяем успешность ответа
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Пытаемся распарсить JSON
      const result = await response.json();
      setData(result);

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError(err.message || 'Произошла ошибка при запросе');
        console.error('Ошибка API запроса:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Функция для ручного выполнения запроса
  const execute = useCallback((customUrl) => {
    const abortController = new AbortController();
    return fetchData(customUrl ? customUrl : url, abortController);
  }, [fetchData, url]);

  // Автоматический запрос при изменении зависимостей
  useEffect(() => {
    if (!manual && url) {
      const abortController = new AbortController();
      fetchData(abortController);

      return () => {
        abortController.abort();
      };
    }
  }, [url, manual, fetchData, ...dependencies]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Функция для сброса состояния
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData, // Для ручного обновления данных
  };
}

export default useApi;