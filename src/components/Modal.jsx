import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Универсальный компонент модального окна
 * @param {boolean} isOpen - Открыто ли модальное окно
 * @param {Function} onClose - Функция закрытия модального окна
 * @param {string} title - Заголовок модального окна
 * @param {React.ReactNode} children - Содержимое модального окна
 * @param {string} size - Размер модального окна (sm, md, lg, xl)
 * @param {boolean} closeOnEsc - Закрывать ли по клавише Escape
 * @param {boolean} closeOnOutsideClick - Закрывать ли при клике вне окна
 * @param {string} className - Дополнительные CSS классы
 */
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  className = ''
}) {
  // Эффект для обработки клавиши Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Блокируем скролл
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Разблокируем скролл
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Обработчик клика на фон
  const handleBackgroundClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Если модальное окно закрыто - не рендерим
  if (!isOpen) return null;

  // Определяем класс размера
  const sizeClass = `modal-${size}`;

  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className={`modal-container ${sizeClass} ${className}`}>
        {/* Шапка модального окна */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
        </div>

        {/* Содержимое модального окна */}
        <div className="modal-content">
          {children}
        </div>

        {/* Подвал модального окна (опционально) */}
        <div className="modal-footer">
          <button 
            className="modal-footer-btn close-btn" 
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;