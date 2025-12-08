import React from 'react';
import './FilterTabs.css';

function FilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'Все', emoji: '📋' },
    { id: 'not-started', label: 'Не начато', emoji: '⏳' },
    { id: 'in-progress', label: 'В процессе', emoji: '🔄' },
    { id: 'completed', label: 'Выполнено', emoji: '✅' }
  ];

  return (
    <div className="filter-tabs">
      <h3>Фильтр по статусу:</h3>
      <div className="tabs-container">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`tab-button ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <span className="tab-emoji">{filter.emoji}</span>
            <span className="tab-label">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterTabs;