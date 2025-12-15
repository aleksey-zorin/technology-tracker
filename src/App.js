import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Импорт хуков
import useTechnologies from './hooks/useTechnologies';
import useTechnologiesApi from './hooks/useTechnologiesApi';

// Импорт компонентов
import Navigation from './components/Navigation';
import ProgressBar from './components/ProgressBar';
import Modal from './components/Modal';
import TechnologySearch from './components/TechnologySearch';
import RoadmapImporter from './components/RoadmapImporter';
import QuickActions from './components/QuickActions';
import TechnologyCard from './components/TechnologyCard';
import TechnologyNotes from './components/TechnologyNotes';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import DeadlineForm from './components/DeadlineForm';
import BulkStatusEditor from './components/BulkStatusEditor';
import EnhancedDataExporterImporter from './components/EnhancedDataExporterImporter';
// Импорт страниц
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  
  // Хук для управления технологиями из localStorage
  const {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    addTechnology,
    removeTechnology,
    markAllCompleted,
    resetAllStatuses,
    removeTechnologies,
    clearAllTechnologies,
    statistics,
    exportData,
    importData
  } = useTechnologies();

  // Хук для работы с API технологий
  const {
    searchResults,
    isSearching,
    searchError,
    popularTechnologies,
    isLoadingPopular,
    popularError,
    searchTechnologies,
    loadPopularTechnologies,
    clearSearchResults,
    searchStats
  } = useTechnologiesApi();

  // Состояния для управления приложением
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isApiSearchModalOpen, setIsApiSearchModalOpen] = useState(false);
  const [selectedApiTechnology, setSelectedApiTechnology] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Загрузка популярных технологий при запуске
  useEffect(() => {
    loadPopularTechnologies();
  }, [loadPopularTechnologies]);

  // Показ уведомлений
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Обработчик поиска в API
  const handleApiSearch = useCallback(async (query) => {
    await searchTechnologies(query);
  }, [searchTechnologies]);

  // Добавление технологии из API в трекер
  const handleAddApiTechnology = useCallback((apiTech) => {
    const newTech = {
      id: Date.now(),
      title: apiTech.title,
      description: apiTech.description || 'Технология добавлена из GitHub',
      status: 'not-started',
      notes: '',
      category: apiTech.category || 'Other',
      difficulty: apiTech.difficulty || 'Beginner',
      isExternal: true,
      externalUrl: apiTech.url,
      stars: apiTech.stars,
      language: apiTech.language,
      topics: apiTech.topics || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addTechnology(newTech);
    showNotification(`Технология "${apiTech.title}" добавлена в трекер!`, 'success');
    setIsApiSearchModalOpen(false);
    setSelectedApiTechnology(null);
  }, [addTechnology, showNotification]);

  // Обработчик импорта дорожной карты
  const handleRoadmapImport = useCallback((importedTechnologies) => {
    importedTechnologies.forEach(tech => {
      addTechnology({
        ...tech,
        id: Date.now() + Math.random(),
        status: 'not-started',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    showNotification(`Успешно импортировано ${importedTechnologies.length} технологий!`, 'success');
  }, [addTechnology, showNotification]);

  // Экспорт данных
  const handleExportData = useCallback(() => {
    const exportResult = exportData();
    exportResult.download();
    showNotification('Данные успешно экспортированы!', 'success');
  }, [exportData, showNotification]);

  // Импорт данных
  const handleImportData = useCallback((data) => {
    const result = importData(data);
    if (result.success) {
      showNotification('Данные успешно импортированы!', 'success');
    } else {
      showNotification(result.message, 'error');
    }
    return result;
  }, [importData, showNotification]);

  // Очистка хранилища
  const handleClearStorage = useCallback(() => {
    clearAllTechnologies();
    showNotification('Все данные очищены!', 'warning');
    setTimeout(() => window.location.reload(), 1000);
  }, [clearAllTechnologies, showNotification]);

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = !searchQuery || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Проверка, находится ли пользователь на главной странице
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      {/* Навигация */}
      <Navigation />
      
      {/* Уведомления */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button 
            onClick={() => setNotification(null)}
            className="notification-close"
          >
            ✕
          </button>
        </div>
      )}

      <div className="container">
        {/* Кнопка для открытия поиска API (видна на всех страницах кроме главной) */}
        {!isHomePage && (
          <button 
            onClick={() => setIsApiSearchModalOpen(true)}
            className="api-search-btn floating-btn"
            title="Поиск технологий на GitHub"
          >
            🔍 Поиск на GitHub
          </button>
        )}

        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />
          
          {/* Дашборд */}
          <Route path="/dashboard" element={
            <Dashboard 
              technologies={technologies}
              statistics={statistics}
              onStatusChange={updateStatus}
              onNotesChange={updateNotes}
              onMarkAllCompleted={markAllCompleted}
              onResetAll={resetAllStatuses}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearStorage={handleClearStorage}
            />
          } />
          
          {/* Список технологий */}
          <Route path="/technologies" element={
            <TechnologyList 
              technologies={technologies}
              filteredTechnologies={filteredTechnologies}
              searchQuery={searchQuery}
              activeFilter={activeFilter}
              onSearchChange={setSearchQuery}
              onFilterChange={setActiveFilter}
              onStatusChange={updateStatus}
              onRemoveTechnology={removeTechnology}
            />
          } />
          
          {/* Детали технологии */}
          <Route path="/technology/:id" element={
            <TechnologyDetail 
              technologies={technologies}
              onUpdateStatus={updateStatus}
              onUpdateNotes={updateNotes}
              onRemoveTechnology={removeTechnology}
            />
          } />
          
          {/* Добавление технологии */}
          <Route path="/add-technology" element={
            <AddTechnology 
              onAddTechnology={addTechnology}
              showNotification={showNotification}
            />
          } />
          
          {/* Статистика */}
          <Route path="/statistics" element={
            <Statistics 
              statistics={statistics}
              technologies={technologies}
            />
          } />

          {/* Настройки */}
          <Route path="/settings" element={
            <Settings 
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearStorage={handleClearStorage}
              showNotification={showNotification}
            />
          } />
          
          {/* Логин */}
          <Route path="/login" element={<Login />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Модальное окно поиска API */}
      <Modal
        isOpen={isApiSearchModalOpen}
        onClose={() => {
          setIsApiSearchModalOpen(false);
          setSelectedApiTechnology(null);
        }}
        title="🔍 Поиск технологий на GitHub"
        size="xl"
      >
        <div className="api-search-modal">
          {/* Поисковая строка */}
          <div className="api-search-section">
            <TechnologySearch 
              onSearch={handleApiSearch}
              onSelectTechnology={setSelectedApiTechnology}
              placeholder="Введите название технологии (React, Vue, Node.js...)"
            />
            
            {isSearching && (
              <div className="searching-indicator">
                <div className="spinner"></div>
                <span>Ищем технологии на GitHub...</span>
              </div>
            )}
            
            {searchError && (
              <div className="api-error">
                <p>❌ {searchError}</p>
                <button onClick={clearSearchResults}>Очистить</button>
              </div>
            )}
          </div>

          {/* Результаты поиска */}
          {searchResults.length > 0 && (
            <div className="api-results-section">
              <div className="section-header">
                <h3>Найдено технологий: {searchResults.length}</h3>
                <button 
                  onClick={clearSearchResults}
                  className="clear-results-btn"
                >
                  Очистить результаты
                </button>
              </div>
              
              <div className="api-results-grid">
                {searchResults.map(tech => (
                  <div 
                    key={tech.id} 
                    className={`api-tech-card ${selectedApiTechnology?.id === tech.id ? 'selected' : ''}`}
                    onClick={() => setSelectedApiTechnology(tech)}
                  >
                    <div className="api-tech-header">
                      <h4>{tech.title}</h4>
                      <span className="api-tech-stars">⭐ {tech.stars.toLocaleString()}</span>
                    </div>
                    <p className="api-tech-description">
                      {tech.description || 'Описание отсутствует'}
                    </p>
                    <div className="api-tech-meta">
                      <span className="api-tech-category">{tech.category}</span>
                      <span className="api-tech-difficulty">{tech.difficulty}</span>
                      <span className="api-tech-language">{tech.language}</span>
                    </div>
                    <div className="api-tech-topics">
                      {tech.topics?.slice(0, 3).map(topic => (
                        <span key={topic} className="api-tech-topic">{topic}</span>
                      ))}
                    </div>
                    <a 
                      href={tech.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="api-tech-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 Открыть на GitHub
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Популярные технологии */}
          <div className="api-popular-section">
            <div className="section-header">
              <h3>🔥 Популярные технологии</h3>
              <button 
                onClick={loadPopularTechnologies}
                disabled={isLoadingPopular}
                className="refresh-popular-btn"
              >
                {isLoadingPopular ? 'Загрузка...' : '🔄 Обновить'}
              </button>
            </div>
            
            {popularError && (
              <div className="api-error">
                <p>❌ {popularError}</p>
              </div>
            )}
            
            {!isLoadingPopular && popularTechnologies.length > 0 && (
              <div className="popular-techs-grid">
                {popularTechnologies.slice(0, 6).map(tech => (
                  <div 
                    key={tech.id} 
                    className="popular-tech-card"
                    onClick={() => setSelectedApiTechnology(tech)}
                  >
                    <div className="popular-tech-header">
                      <h5>{tech.title}</h5>
                      <span className="popular-tech-stars">⭐ {tech.stars?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <p className="popular-tech-description">{tech.description}</p>
                    <div className="popular-tech-meta">
                      <span>{tech.language || 'JavaScript'}</span>
                      <span>{tech.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Выбранная технология */}
          {selectedApiTechnology && (
            <div className="selected-tech-section">
              <div className="section-header">
                <h3>🎯 Выбранная технология</h3>
                <button 
                  onClick={() => setSelectedApiTechnology(null)}
                  className="clear-selection-btn"
                >
                  ✕ Очистить выбор
                </button>
              </div>
              
              <div className="selected-tech-card">
                <div className="selected-tech-header">
                  <h4>{selectedApiTechnology.title}</h4>
                  <div className="selected-tech-rating">
                    <span className="stars">⭐ {selectedApiTechnology.stars?.toLocaleString() || 'N/A'} stars</span>
                    <span className="difficulty">🎯 {selectedApiTechnology.difficulty}</span>
                  </div>
                </div>
                
                <p className="selected-tech-description">
                  {selectedApiTechnology.description || 'Описание технологии'}
                </p>
                
                <div className="selected-tech-details">
                  <div className="detail-item">
                    <span className="detail-label">Категория:</span>
                    <span className="detail-value">{selectedApiTechnology.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Язык:</span>
                    <span className="detail-value">{selectedApiTechnology.language || 'JavaScript'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Сложность:</span>
                    <span className="detail-value">{selectedApiTechnology.difficulty}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ссылка:</span>
                    <a 
                      href={selectedApiTechnology.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="detail-value link"
                    >
                      GitHub репозиторий
                    </a>
                  </div>
                </div>
                
                {selectedApiTechnology.topics && selectedApiTechnology.topics.length > 0 && (
                  <div className="selected-tech-topics">
                    <span className="topics-label">Темы:</span>
                    <div className="topics-list">
                      {selectedApiTechnology.topics.map(topic => (
                        <span key={topic} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="selected-tech-actions">
                  <button 
                    onClick={() => handleAddApiTechnology(selectedApiTechnology)}
                    className="add-to-tracker-btn primary"
                  >
                    ✅ Добавить в трекер
                  </button>
                  <a 
                    href={selectedApiTechnology.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="add-to-tracker-btn secondary"
                  >
                    🔗 Открыть на GitHub
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Импорт дорожной карты */}
          <div className="api-roadmap-section">
            <div className="section-header">
              <h3>🗺️ Быстрый импорт дорожных карт</h3>
            </div>
            <RoadmapImporter onImportComplete={handleRoadmapImport} />
          </div>

          {/* Информация о API */}
          <div className="api-info-section">
            <div className="api-info-card">
              <h4>ℹ️ Информация о поиске</h4>
              <ul className="api-info-list">
                <li>🔍 Поиск осуществляется через GitHub API</li>
                <li>⭐ Рейтинг основан на количестве звезд репозитория</li>
                <li>🔄 Данные обновляются в реальном времени</li>
                <li>⚠️ Из-за ограничений GitHub API возможны задержки</li>
                <li>📚 Используются самые популярные репозитории</li>
              </ul>
              <div className="api-stats">
                <div className="api-stat">
                  <span className="stat-label">Технологий в базе:</span>
                  <span className="stat-value">1000+</span>
                </div>
                <div className="api-stat">
                  <span className="stat-label">Обновление:</span>
                  <span className="stat-value">реальное время</span>
                </div>
                <div className="api-stat">
                  <span className="stat-label">Источник:</span>
                  <span className="stat-value">GitHub API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Главный компонент App с Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;