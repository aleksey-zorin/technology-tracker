import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const features = [
    {
      icon: '📊',
      title: 'Отслеживание прогресса',
      description: 'Визуализируйте ваш прогресс в изучении технологий'
    },
    {
      icon: '📝',
      title: 'Умные заметки',
      description: 'Сохраняйте важные заметки для каждой технологии'
    },
    {
      icon: '🎯',
      title: 'Постановка целей',
      description: 'Ставьте цели и отслеживайте их выполнение'
    },
    {
      icon: '📈',
      title: 'Аналитика',
      description: 'Получайте детальную статистику вашего обучения'
    },
    {
      icon: '🔄',
      title: 'Автосохранение',
      description: 'Все данные сохраняются автоматически'
    },
    {
      icon: '📱',
      title: 'Доступность',
      description: 'Работает на всех устройствах'
    }
  ];

  return (
    <div className="home-page">
      {/* Герой секция */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Добро пожаловать в <span className="highlight">TechTracker</span>
          </h1>
          <p className="hero-subtitle">
            Самый эффективный инструмент для отслеживания вашего прогресса 
            в изучении технологий и фреймворков
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              🚀 Начать отслеживание
            </Link>
            <Link to="/technologies" className="btn btn-outline btn-lg">
              📚 Посмотреть технологии
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-elements">
            <div className="floating-icon react">⚛️</div>
            <div className="floating-icon node">🟢</div>
            <div className="floating-icon js">📜</div>
            <div className="floating-icon css">🎨</div>
            <div className="floating-icon html">🌐</div>
            <div className="floating-icon db">🗄️</div>
          </div>
        </div>
      </section>

      {/* Особенности */}
      <section className="features-section">
        <h2 className="section-title">Почему выбирают TechTracker?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Статистика */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Технологий</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Доступность</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Бесплатно</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">⚡</div>
            <div className="stat-label">Мгновенная синхронизация</div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Готовы начать?</h2>
          <p className="cta-text">
            Присоединяйтесь к тысячам разработчиков, которые уже используют 
            TechTracker для эффективного изучения технологий
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-xl">
            🎯 Начать обучение прямо сейчас
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;