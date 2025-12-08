import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import TechnologyCard from '../components/TechnologyCard';
import QuickActions from '../components/QuickActions';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import useTechnologies from '../hooks/useTechnologies';
import './Dashboard.css';

function Dashboard() {
  const { 
    technologies, 
    updateStatus, 
    statistics,
    markAllCompleted,
    resetAllStatuses,
    exportData,
    clearAllTechnologies
  } = useTechnologies();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentTechnologies, setRecentTechnologies] = useState([]);

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    // Поиск
    const matchesSearch = !searchQuery || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтрация по статусу
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Получаем недавно добавленные технологии
  useEffect(() => {
    const sortedByDate = [...technologies]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    setRecentTechnologies(sortedByDate);
  }, [technologies]);

  // Технологии в работе
  const inProgressTechs = technologies.filter(tech => tech.status === 'in-progress');

  return (
    <div className="dashboard-page">
      {/* Заголовок и статистика */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">📊 Ваш дашборд</h1>
          <p className="dashboard-subtitle">
            Обзор вашего прогресса в изучении технологий
          </p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{statistics.total}</div>
              <div className="stat-label">Всего технологий</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{statistics.completed}</div>
              <div className="stat-label">Изучено</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-number">{statistics.inProgress}</div>
              <div className="stat-label">В процессе</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{statistics.progressPercentage}%</div>
              <div className="stat-label">Общий прогресс</div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          {/* Быстрые действия */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">⚡ Быстрые действия</h3>
            <QuickActions 
              technologies={technologies}
              onMarkAllCompleted={markAllCompleted}
              onResetAll={resetAllStatuses}
              onExportData={exportData}
              onClearStorage={clearAllTechnologies}
              statistics={statistics}
            />
          </div>

          {/* Недавно добавленные */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">🆕 Недавно добавленные</h3>
            <div className="recent-techs">
              {recentTechnologies.map(tech => (
                <Link 
                  key={tech.id}
                  to={`/technology/${tech.id}`}
                  className="recent-tech-item"
                >
                  <div className="recent-tech-icon">
                    {tech.status === 'completed' ? '✅' : 
                     tech.status === 'in-progress' ? '🔄' : '⏳'}
                  </div>
                  <div className="recent-tech-info">
                    <div className="recent-tech-title">{tech.title}</div>
                    <div className="recent-tech-category">{tech.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Прогресс по категориям */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">🏷️ Прогресс по категориям</h3>
            <div className="category-progress">
              {Object.entries(statistics.categoryStats || {}).map(([category, stats]) => (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    <span className="category-percentage">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={(stats.completed / stats.total) * 100}
                    height={8}
                    showPercentage={false}
                    variant="info"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          {/* Основной прогресс */}
          <div className="main-section">
            <div className="section-header">
              <h2 className="section-title">🎯 Общий прогресс</h2>
              <Link to="/statistics" className="view-all-link">
                Подробная статистика →
              </Link>
            </div>
            <ProgressBar
              progress={statistics.progressPercentage}
              label="Общий прогресс обучения"
              height={30}
              variant="success"
              animated={true}
              striped={true}
              showValue={true}
            />
          </div>

          {/* Технологии в работе */}
          <div className="main-section">
            <div className="section-header">
              <h2 className="section-title">🔄 Технологии в работе</h2>
              <Link to="/technologies" className="view-all-link">
                Все технологии →
              </Link>
            </div>
            {inProgressTechs.length > 0 ? (
              <div className="in-progress-grid">
                {inProgressTechs.slice(0, 3).map(tech => (
                  <TechnologyCard
                    key={tech.id}
                    {...tech}
                    onStatusChange={() => updateStatus(tech.id, 'completed')}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Нет технологий в работе. Начните изучать что-то новое!</p>
                <Link to="/add-technology" className="btn btn-primary">
                  Добавить технологию
                </Link>
              </div>
            )}
          </div>

          {/* Поиск и фильтрация */}
          <div className="main-section">
            <div className="section-header">
              <h2 className="section-title">🔍 Поиск технологий</h2>
              <span className="results-count">
                Найдено: {filteredTechnologies.length}
              </span>
            </div>
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <FilterTabs 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Список технологий */}
          <div className="main-section">
            <div className="technologies-list">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <TechnologyCard
                    key={tech.id}
                    {...tech}
                    onStatusChange={(id) => {
                      const statusOrder = ['not-started', 'in-progress', 'completed'];
                      const currentIndex = statusOrder.indexOf(tech.status);
                      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                      updateStatus(id, nextStatus);
                    }}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>Технологий не найдено. Попробуйте изменить поисковой запрос.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                    className="btn btn-outline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;