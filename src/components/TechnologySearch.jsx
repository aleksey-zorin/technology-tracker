import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ 
  onSearch, 
  onSelectTechnology, 
  placeholder = "Поиск технологий на GitHub..." 
}) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceTimeoutRef = useRef(null);
  const searchHistoryRef = useRef([]);

  // Предзагруженные популярные технологии
  const popularTechnologies = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
    'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
    'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
    'Next.js', 'Nuxt.js', 'Svelte', 'GraphQL', 'Webpack'
  ];

  // Обработчик изменения поискового запроса
  const handleQueryChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setIsTyping(true);

    // Очищаем предыдущий таймер
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Показываем подсказки при вводе
    if (value.trim().length > 1) {
      const filteredSuggestions = popularTechnologies.filter(tech =>
        tech.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Устанавливаем таймер для debounce (500ms)
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 0) {
        onSearch(value);
        
        // Сохраняем в историю поиска
        if (!searchHistoryRef.current.includes(value)) {
          searchHistoryRef.current = [value, ...searchHistoryRef.current.slice(0, 9)];
        }
      }
      setIsTyping(false);
    }, 500);
  }, [onSearch, popularTechnologies]);

  // Обработчик выбора подсказки
  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    
    // Добавляем в историю
    if (!searchHistoryRef.current.includes(suggestion)) {
      searchHistoryRef.current = [suggestion, ...searchHistoryRef.current.slice(0, 9)];
    }
  }, [onSearch]);

  // Очистка поиска
  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  }, [onSearch]);

  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('techSearchHistory');
    if (savedHistory) {
      searchHistoryRef.current = JSON.parse(savedHistory);
    }
  }, []);

  // Сохранение истории поиска
  useEffect(() => {
    localStorage.setItem('techSearchHistory', JSON.stringify(searchHistoryRef.current));
  }, [searchHistoryRef.current]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="search-input"
            aria-label="Поиск технологий"
          />
          {query && (
            <button
              onClick={handleClear}
              className="clear-search-btn"
              aria-label="Очистить поиск"
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
          {isTyping && (
            <span className="typing-indicator">⌛</span>
          )}
        </div>

        {/* История поиска */}
        {showSuggestions && searchHistoryRef.current.length > 0 && query.length === 0 && (
          <div className="search-history">
            <div className="history-header">
              <span>История поиска:</span>
              <button 
                onClick={() => {
                  searchHistoryRef.current = [];
                  localStorage.removeItem('techSearchHistory');
                }}
                className="clear-history-btn"
              >
                Очистить
              </button>
            </div>
            {searchHistoryRef.current.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="history-item"
              >
                <span className="history-icon">↩️</span>
                <span className="history-text">{item}</span>
              </button>
            ))}
          </div>
        )}

        {/* Подсказки */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            <div className="suggestions-header">
              <span>Популярные технологии:</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                <span className="suggestion-icon">💡</span>
                <span className="suggestion-text">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Быстрые категории */}
        <div className="quick-categories">
          <span className="categories-label">Быстрый поиск:</span>
          <div className="category-buttons">
            <button
              onClick={() => handleSuggestionClick('Frontend')}
              className="category-btn frontend"
            >
              🌐 Frontend
            </button>
            <button
              onClick={() => handleSuggestionClick('Backend')}
              className="category-btn backend"
            >
              ⚙️ Backend
            </button>
            <button
              onClick={() => handleSuggestionClick('Database')}
              className="category-btn database"
            >
              🗄️ Database
            </button>
            <button
              onClick={() => handleSuggestionClick('DevOps')}
              className="category-btn devops"
            >
              🚀 DevOps
            </button>
          </div>
        </div>
      </div>

      {/* Информация о поиске */}
      <div className="search-info">
        <p className="search-hint">
          💡 Ищите технологии на GitHub. Результаты обновляются в реальном времени.
        </p>
        <div className="search-stats">
          <span className="stat-item">
            <span className="stat-icon">📚</span>
            <span className="stat-text">База: 1000+ технологий</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">Обновление: реальное время</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">🌐</span>
            <span className="stat-text">Источник: GitHub API</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TechnologySearch;