import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TechnologyDetail.css';

const TechnologyDetail = ({ technologies, onUpdateStatus, onUpdateNotes, onRemoveTechnology }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Находим технологию по ID
  const technology = technologies.find(tech => tech.id.toString() === id);
  
  if (!technology) {
    return (
      <div className="tech-detail not-found">
        <h2>🚫 Технология не найдена</h2>
        <p>Технология с ID {id} не существует или была удалена.</p>
        <button 
          onClick={() => navigate('/technologies')}
          className="back-btn primary"
        >
          ← Вернуться к списку технологий
        </button>
      </div>
    );
  }
  
  // Статус в читаемом виде
  const statusText = {
    'not-started': 'Не начата',
    'in-progress': 'В процессе',
    'completed': 'Завершена'
  };
  
  // Сложность в читаемом виде
  const difficultyText = {
    'beginner': '👶 Начинающий',
    'intermediate': '🚀 Средний',
    'advanced': '🔥 Продвинутый',
    'expert': '🏆 Экспертный'
  };
  
  // Обработчики
  const handleStatusChange = (newStatus) => {
    onUpdateStatus(technology.id, newStatus);
  };
  
  const handleSaveNotes = () => {
    onUpdateNotes(technology.id, notes);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить "${technology.title}"?`)) {
      onRemoveTechnology(technology.id);
      navigate('/technologies');
    }
  };
  
  return (
    <div className="tech-detail-container">
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        <button onClick={() => navigate('/dashboard')} className="breadcrumb-link">Дашборд</button>
        <span className="breadcrumb-separator">/</span>
        <button onClick={() => navigate('/technologies')} className="breadcrumb-link">Технологии</button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{technology.title}</span>
      </div>
      
      {/* Заголовок и действия */}
      <div className="tech-detail-header">
        <div className="header-left">
          <button 
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Назад
          </button>
          <h1 className="tech-title">{technology.title}</h1>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => navigate('/add-technology')}
            className="action-btn secondary"
          >
            + Добавить новую
          </button>
          <button 
            onClick={handleDelete}
            className="action-btn danger"
          >
            🗑️ Удалить
          </button>
        </div>
      </div>
      
      <div className="tech-detail-content">
        {/* Основная информация */}
        <div className="main-info-section">
          <div className="tech-card overview">
            <div className="card-header">
              <h3>📋 Обзор технологии</h3>
              <div className={`status-badge ${technology.status}`}>
                {statusText[technology.status]}
              </div>
            </div>
            
            <div className="card-body">
              <p className="tech-description">{technology.description || 'Описание отсутствует'}</p>
              
              <div className="tech-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span className="meta-value category">{technology.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Сложность:</span>
                  <span className="meta-value difficulty">
                    {difficultyText[technology.difficulty?.toLowerCase()] || technology.difficulty}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Дата создания:</span>
                  <span className="meta-value">
                    {new Date(technology.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Последнее обновление:</span>
                  <span className="meta-value">
                    {new Date(technology.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {technology.externalUrl && (
                  <div className="meta-item">
                    <span className="meta-label">Ссылка:</span>
                    <a 
                      href={technology.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="meta-value link"
                    >
                      🔗 Перейти к ресурсу
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Статус */}
          <div className="tech-card status-card">
            <div className="card-header">
              <h3>📊 Статус изучения</h3>
            </div>
            
            <div className="card-body">
              <div className="status-buttons">
                <button 
                  onClick={() => handleStatusChange('not-started')}
                  className={`status-btn not-started ${technology.status === 'not-started' ? 'active' : ''}`}
                >
                  <div className="status-icon">⏸️</div>
                  <div className="status-info">
                    <span className="status-title">Не начата</span>
                    <span className="status-desc">Еще не приступали</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleStatusChange('in-progress')}
                  className={`status-btn in-progress ${technology.status === 'in-progress' ? 'active' : ''}`}
                >
                  <div className="status-icon">🚀</div>
                  <div className="status-info">
                    <span className="status-title">В процессе</span>
                    <span className="status-desc">Активно изучаю</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleStatusChange('completed')}
                  className={`status-btn completed ${technology.status === 'completed' ? 'active' : ''}`}
                >
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <span className="status-title">Завершена</span>
                    <span className="status-desc">Полностью изучена</span>
                  </div>
                </button>
              </div>
              
              <div className="progress-section">
                <div className="progress-header">
                  <span>Прогресс</span>
                  <span className="progress-percent">
                    {technology.status === 'completed' ? '100%' : 
                     technology.status === 'in-progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${technology.status}`}
                    style={{
                      width: technology.status === 'completed' ? '100%' : 
                             technology.status === 'in-progress' ? '50%' : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Заметки */}
        <div className="tech-card notes-card">
          <div className="card-header">
            <h3>📝 Заметки</h3>
            <div className="notes-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSaveNotes} className="action-btn primary">💾 Сохранить</button>
                  <button onClick={() => { setIsEditing(false); setNotes(technology.notes || ''); }} className="action-btn secondary">❌ Отмена</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="action-btn primary">✏️ Редактировать</button>
              )}
            </div>
          </div>
          
          <div className="card-body">
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-textarea"
                placeholder="Добавьте заметки по изучению технологии..."
                rows={6}
              />
            ) : (
              <div className="notes-content">
                {technology.notes ? (
                  <pre>{technology.notes}</pre>
                ) : (
                  <p className="empty-notes">Заметок пока нет. Нажмите "Редактировать" чтобы добавить.</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Теги */}
        {technology.topics && technology.topics.length > 0 && (
          <div className="tech-card tags-card">
            <div className="card-header">
              <h3>🏷️ Теги и темы</h3>
            </div>
            <div className="card-body">
              <div className="tags-list">
                {technology.topics.map((topic, index) => (
                  <span key={index} className="tag">{topic}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Быстрые действия */}
        <div className="quick-actions-section">
          <h3>⚡ Быстрые действия</h3>
          <div className="actions-grid">
            <button 
              onClick={() => navigate(`/add-technology?duplicate=${technology.id}`)}
              className="action-card"
            >
              <span className="action-icon">📋</span>
              <span className="action-title">Дублировать</span>
              <span className="action-desc">Создать копию</span>
            </button>
            
            {technology.externalUrl && (
              <a 
                href={technology.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-card"
              >
                <span className="action-icon">🔗</span>
                <span className="action-title">Открыть ресурс</span>
                <span className="action-desc">Перейти по ссылке</span>
              </a>
            )}
            
            <button 
              onClick={() => window.print()}
              className="action-card"
            >
              <span className="action-icon">🖨️</span>
              <span className="action-title">Распечатать</span>
              <span className="action-desc">Версия для печати</span>
            </button>
            
            <button 
              onClick={() => navigate('/statistics')}
              className="action-card"
            >
              <span className="action-icon">📊</span>
              <span className="action-title">Статистика</span>
              <span className="action-desc">Посмотреть прогресс</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyDetail;