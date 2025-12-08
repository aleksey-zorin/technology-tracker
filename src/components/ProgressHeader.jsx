
import './ProgressHeader.css';

function ProgressHeader({ technologies = [] }) {
  // Расчет статистики
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  
  // Процент выполнения
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <div className="header-top">
        <h1>🚀 Трекер изучения технологий</h1>
        <p className="subtitle">Отслеживайте ваш прогресс в обучении</p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number total">{total}</div>
          <div className="stat-label">Всего технологий</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number completed">{completed}</div>
          <div className="stat-label">Изучено</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number in-progress">{inProgress}</div>
          <div className="stat-label">В процессе</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number not-started">{notStarted}</div>
          <div className="stat-label">Не начато</div>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-info">
          <span>Общий прогресс</span>
          <span className="percentage">{progressPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
// Внутри компонента ProgressHeader, после прогресс-бара, добавьте:
<div className="detailed-stats">
  <div className="stat-detail">
    <span className="stat-emoji">⏳</span>
    <span className="stat-count">{notStarted}</span>
    <span className="stat-label">Не начато</span>
  </div>
  <div className="stat-detail">
    <span className="stat-emoji">🔄</span>
    <span className="stat-count">{inProgress}</span>
    <span className="stat-label">В процессе</span>
  </div>
  <div className="stat-detail">
    <span className="stat-emoji">✅</span>
    <span className="stat-count">{completed}</span>
    <span className="stat-label">Выполнено</span>
  </div>
</div>

export default ProgressHeader;