import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Эффект для обновления локального состояния при изменении пропса
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Эффект для загрузки истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Сохранение в историю поиска
  const saveToHistory = (query) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 4)]; // Сохраняем последние 5 запросов
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    onSearchChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      saveToHistory(localQuery);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    setShowHistory(false);
  };

  const handleHistorySelect = (query) => {
    setLocalQuery(query);
    onSearchChange(query);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="Поиск технологий по названию, описанию, категории..."
            className="search-input"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-search-btn"
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-submit-btn">
            Найти
          </button>
        </div>
        
        {/* Подсказки поиска */}
        <div className="search-hints">
          <small>
            💡 Ищите по: <strong>названию</strong>, <strong>описанию</strong>, 
            <strong> категории</strong>, <strong>сложности</strong> или <strong>заметкам</strong>
          </small>
        </div>
      </form>

      {/* История поиска */}
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history">
          <div className="history-header">
            <span>История поиска:</span>
            <button 
              onClick={handleClearHistory}
              className="clear-history-btn"
              title="Очистить историю"
            >
              Очистить
            </button>
          </div>
          <div className="history-items">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistorySelect(query)}
                className="history-item"
              >
                <span className="history-icon">↩️</span>
                <span className="history-query">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;