import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('tech-tracker-auth') === 'true'
  );

  const navLinks = [
    { to: '/', label: '🏠 Главная', icon: '🏠' },
    { to: '/dashboard', label: '📊 Дашборд', icon: '📊' },
    { to: '/technologies', label: '📚 Технологии', icon: '📚' },
    { to: '/statistics', label: '📈 Статистика', icon: '📈' },
    { to: '/settings', label: '⚙️ Настройки', icon: '⚙️' },
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('tech-tracker-auth', 'true');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('tech-tracker-auth');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Бренд и логотип */}
        <div className="nav-brand">
          <NavLink to="/" className="brand-link">
            <div className="brand-content">
              <span className="brand-icon">🚀</span>
              <h1 className="brand-title">TechTracker</h1>
              <span className="brand-subtitle">Трекер технологий</span>
            </div>
          </NavLink>
          
          {/* Кнопка мобильного меню */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Основное меню */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Кнопки авторизации */}
          <div className="auth-section">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="user-greeting">👤 Привет, пользователь!</span>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text">Выйти</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="login-btn"
              >
                <span className="login-icon">🔐</span>
                <span className="login-text">Войти</span>
              </button>
            )}
          </div>

          {/* Информация о версии */}
          <div className="nav-footer">
            <div className="version-info">
              <span className="version-icon">📱</span>
              <span className="version-text">v1.0.0</span>
            </div>
            <div className="nav-hint">
              <span className="hint-icon">💡</span>
              <span className="hint-text">Изучайте технологии эффективно!</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;