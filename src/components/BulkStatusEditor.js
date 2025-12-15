import { useState, useMemo, useEffect } from 'react';

function BulkStatusEditor({ technologies, onUpdateStatuses, onClose }) {
  const [selectedTechs, setSelectedTechs] = useState(new Set());
  const [newStatus, setNewStatus] = useState('');
  const [updateStrategy, setUpdateStrategy] = useState('replace');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Статусы для выбора
  const statusOptions = [
    { value: 'not-started', label: 'Не начато', color: '#f44336', icon: '⏳' },
    { value: 'in-progress', label: 'В процессе', color: '#ff9800', icon: '🔄' },
    { value: 'on-hold', label: 'На паузе', color: '#9c27b0', icon: '⏸️' },
    { value: 'completed', label: 'Завершено', color: '#4caf50', icon: '✅' },
    { value: 'dropped', label: 'Брошено', color: '#607d8b', icon: '❌' }
  ];

  // Получение данных о статусе
  const getStatusInfo = (statusValue) => {
    return statusOptions.find(opt => opt.value === statusValue) || statusOptions[0];
  };

  // Фильтрация технологий
  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      // Поиск по названию и описанию
      const matchesSearch = searchQuery === '' || 
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Фильтр по категории
      const matchesCategory = categoryFilter === 'all' || tech.category === categoryFilter;
      
      // Фильтр по статусу
      const matchesStatus = statusFilter === 'all' || tech.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [technologies, searchQuery, categoryFilter, statusFilter]);

  // Выбор/снятие всех
  const toggleSelectAll = () => {
    if (selectedTechs.size === filteredTechnologies.length) {
      setSelectedTechs(new Set());
    } else {
      const allIds = new Set(filteredTechnologies.map(tech => tech.id));
      setSelectedTechs(allIds);
    }
  };

  // Выбор/снятие конкретной технологии
  const toggleTechSelection = (techId) => {
    const newSelected = new Set(selectedTechs);
    if (newSelected.has(techId)) {
      newSelected.delete(techId);
    } else {
      newSelected.add(techId);
    }
    setSelectedTechs(newSelected);
  };

  // Статистика выбранных элементов
  const selectionStats = useMemo(() => {
    const selectedTechsArray = Array.from(selectedTechs);
    const selectedTechsData = technologies.filter(tech => 
      selectedTechsArray.includes(tech.id)
    );
    
    const statusCounts = {};
    selectedTechsData.forEach(tech => {
      statusCounts[tech.status] = (statusCounts[tech.status] || 0) + 1;
    });
    
    return {
      total: selectedTechsArray.length,
      statusCounts
    };
  }, [selectedTechs, technologies]);

  // Обработчик отправки
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedTechs.size === 0 || !newStatus) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updates = Array.from(selectedTechs).map(techId => ({
        id: techId,
        oldStatus: technologies.find(t => t.id === techId)?.status,
        newStatus: newStatus,
        strategy: updateStrategy,
        updatedAt: new Date().toISOString()
      }));

      await onUpdateStatuses(updates);
      
      // Показать сообщение об успехе и закрыть через 1.5 секунды
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Ошибка обновления статусов:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Генерация предварительного просмотра изменений
  const getPreviewChanges = () => {
    if (!newStatus || selectedTechs.size === 0) return null;
    
    const statusInfo = getStatusInfo(newStatus);
    
    return {
      count: selectedTechs.size,
      status: statusInfo.label,
      color: statusInfo.color,
      icon: statusInfo.icon
    };
  };

  // Эффект для выбора статуса по умолчанию
  useEffect(() => {
    if (!newStatus && statusOptions.length > 0) {
      setNewStatus(statusOptions[0].value);
    }
  }, []);

  // Получение уникальных категорий
  const categories = useMemo(() => {
    const uniqueCategories = new Set(technologies.map(tech => tech.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [technologies]);

  return (
    <div className="bulk-status-editor">
      <div className="editor-header">
        <h2>Массовое редактирование статусов</h2>
        <button 
          onClick={onClose}
          className="close-button"
          aria-label="Закрыть редактор"
        >
          ✕
        </button>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="filter-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск технологий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Поиск технологий"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
            aria-label="Фильтр по категории"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Все категории' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
            aria-label="Фильтр по статусу"
          >
            <option value="all">Все статусы</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.icon} {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Информация о выборе */}
      <div className="selection-info">
        <div className="selection-stats">
          <span>Всего технологий: <strong>{technologies.length}</strong></span>
          <span>Найдено: <strong>{filteredTechnologies.length}</strong></span>
          <span>Выбрано: <strong>{selectionStats.total}</strong></span>
        </div>

        <button
          type="button"
          onClick={toggleSelectAll}
          className="btn-select-all"
          disabled={filteredTechnologies.length === 0}
        >
          {selectedTechs.size === filteredTechnologies.length ? 
            'Снять все' : 'Выбрать все'}
        </button>
      </div>

      {/* Список технологий */}
      <div className="tech-list-container">
        {filteredTechnologies.length === 0 ? (
          <div className="empty-state">
            <p>Технологии не найдены. Измените параметры поиска или фильтры.</p>
          </div>
        ) : (
          <div className="tech-list">
            {filteredTechnologies.map(tech => {
              const isSelected = selectedTechs.has(tech.id);
              const currentStatus = getStatusInfo(tech.status);
              
              return (
                <div 
                  key={tech.id} 
                  className={`tech-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleTechSelection(tech.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleTechSelection(tech.id);
                    }
                  }}
                >
                  <div className="tech-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="checkbox-input"
                      id={`tech-${tech.id}`}
                    />
                    <label 
                      htmlFor={`tech-${tech.id}`} 
                      className="checkbox-label"
                    />
                  </div>

                  <div className="tech-content">
                    <div className="tech-header">
                      <h3 className="tech-title">{tech.title}</h3>
                      <span 
                        className="tech-status-badge"
                        style={{ backgroundColor: currentStatus.color }}
                      >
                        {currentStatus.icon} {currentStatus.label}
                      </span>
                    </div>

                    <p className="tech-description">{tech.description}</p>

                    <div className="tech-meta">
                      <span className="tech-category">
                        Категория: <strong>{tech.category}</strong>
                      </span>
                      {tech.deadline && (
                        <span className="tech-deadline">
                          Дедлайн: {new Date(tech.deadline).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Панель редактирования */}
      <div className="edit-panel">
        <div className="edit-section">
          <h3>Настройка обновления</h3>
          
          <div className="form-group">
            <label htmlFor="new-status">Новый статус</label>
            <div className="status-options">
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  type="button"
                  className={`status-option ${newStatus === status.value ? 'selected' : ''}`}
                  onClick={() => setNewStatus(status.value)}
                  style={{ 
                    borderColor: status.color,
                    backgroundColor: newStatus === status.value ? `${status.color}20` : 'white'
                  }}
                  aria-label={`Выбрать статус: ${status.label}`}
                >
                  <span className="status-icon">{status.icon}</span>
                  <span className="status-label">{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="update-strategy">Стратегия обновления</label>
            <select
              id="update-strategy"
              value={updateStrategy}
              onChange={(e) => setUpdateStrategy(e.target.value)}
              className="strategy-select"
              aria-label="Стратегия обновления статусов"
            >
              <option value="replace">Заменить текущий статус</option>
              <option value="progress">Переместить к следующему статусу (если возможно)</option>
              <option value="reset">Сбросить до "Не начато"</option>
            </select>
            <p className="help-text">
              {updateStrategy === 'replace' && 'Полностью заменит текущий статус'}
              {updateStrategy === 'progress' && 'Переместит на следующий этап (например, "Не начато" → "В процессе")'}
              {updateStrategy === 'reset' && 'Сбросит прогресс для выбранных технологий'}
            </p>
          </div>
        </div>

        {/* Предварительный просмотр */}
        {getPreviewChanges() && (
          <div className="preview-section">
            <h3>Предварительный просмотр</h3>
            <div className="preview-content">
              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="stat-label">Будет обновлено:</span>
                  <span className="stat-value">{getPreviewChanges().count} техн.</span>
                </div>
                <div className="preview-stat">
                  <span className="stat-label">Новый статус:</span>
                  <span 
                    className="stat-value status-badge"
                    style={{ backgroundColor: getPreviewChanges().color }}
                  >
                    {getPreviewChanges().icon} {getPreviewChanges().status}
                  </span>
                </div>
              </div>
              
              <div className="current-status-distribution">
                <h4>Текущее распределение выбранных:</h4>
                <div className="distribution-chart">
                  {Object.entries(selectionStats.statusCounts).map(([status, count]) => {
                    const statusInfo = getStatusInfo(status);
                    const percentage = (count / selectionStats.total) * 100;
                    
                    return (
                      <div key={status} className="distribution-item">
                        <div className="distribution-bar">
                          <div 
                            className="bar-fill"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: statusInfo.color
                            }}
                          />
                        </div>
                        <div className="distribution-label">
                          <span className="status-dot" style={{ backgroundColor: statusInfo.color }} />
                          <span>{statusInfo.label}: {count} ({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="action-buttons">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedTechs.size === 0 || !newStatus || isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Обновление...' : `Обновить ${selectedTechs.size} технологий`}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkStatusEditor;