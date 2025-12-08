import React from 'react';
import './TechnologyCard.css';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  category, 
  difficulty,
  onStatusChange 
}) {
  const getStatusInfo = () => {
    switch (status) {
      case 'completed':
        return { icon: '✅', color: 'completed', text: 'Изучено' };
      case 'in-progress':
        return { icon: '🔄', color: 'in-progress', text: 'В процессе' };
      case 'not-started':
        return { icon: '⏳', color: 'not-started', text: 'Не начато' };
      default:
        return { icon: '❓', color: 'unknown', text: 'Неизвестно' };
    }
  };

  const statusInfo = getStatusInfo();

  const handleStatusClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  return (
    <div 
      className={`technology-card ${statusInfo.color}`}
      onClick={handleStatusClick}
      title="Кликните для смены статуса"
    >
      <div className="card-header">
        <div className="tech-meta">
          <span className="tech-category">{category}</span>
          <span className={`tech-difficulty ${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        </div>
        <span className="status-badge">
          {statusInfo.icon} {statusInfo.text}
        </span>
      </div>
      
      <h3 className="technology-title">{title}</h3>
      <p className="technology-description">{description}</p>
      
      <div className="card-footer">
        <div className="tech-info">
          <span className="tech-id">ID: {id}</span>
          <span className="status-indicator"></span>
        </div>
        <small>Кликните для смены статуса</small>
      </div>
    </div>
  );
}

export default TechnologyCard;