import React from 'react';
import './ProgressBar.css';

/**
 * Универсальный компонент прогресс-бара
 * @param {number} progress - Прогресс от 0 до 100
 * @param {string} label - Подпись прогресс-бара
 * @param {string} description - Описание прогресса
 * @param {string} color - Цвет прогресс-бара
 * @param {number} height - Высота в пикселях
 * @param {boolean} showPercentage - Показывать ли процент
 * @param {boolean} showValue - Показывать ли числовое значение
 * @param {boolean} animated - Анимировать ли заполнение
 * @param {string} variant - Вариант стиля (default, success, warning, danger, info)
 * @param {boolean} striped - Полосатый стиль
 * @param {boolean} rounded - Закругленные края
 */
function ProgressBar({
  progress = 0,
  label = '',
  description = '',
  color = '',
  height = 20,
  showPercentage = true,
  showValue = false,
  animated = true,
  variant = 'default',
  striped = false,
  rounded = true,
  className = ''
}) {
  // Ограничиваем прогресс в пределах 0-100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  // Определяем цвет в зависимости от варианта
  const getVariantColor = () => {
    switch (variant) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      case 'info': return '#17a2b8';
      case 'primary': return '#007bff';
      default: return color || '#667eea';
    }
  };

  // Форматируем значение прогресса
  const formatProgress = (value) => {
    if (showValue) {
      return `${value.toFixed(1)}`;
    }
    return `${Math.round(value)}%`;
  };

  const barColor = getVariantColor();
  const barHeight = `${height}px`;

  return (
    <div className={`progress-bar-container ${className}`}>
      {/* Заголовок прогресс-бара */}
      {(label || showPercentage || description) && (
        <div className="progress-bar-header">
          <div className="progress-bar-title">
            {label && <span className="progress-bar-label">{label}</span>}
            {(showPercentage || showValue) && (
              <span className="progress-bar-value">{formatProgress(normalizedProgress)}</span>
            )}
          </div>
          {description && (
            <div className="progress-bar-description">{description}</div>
          )}
        </div>
      )}

      {/* Сам прогресс-бар */}
      <div 
        className="progress-bar-outer"
        style={{ 
          height: barHeight,
          borderRadius: rounded ? '10px' : '0'
        }}
        role="progressbar"
        aria-valuenow={normalizedProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || 'Прогресс'}
      >
        <div
          className={`progress-bar-inner ${striped ? 'progress-bar-striped' : ''} ${animated ? 'progress-bar-animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: barColor,
            transition: animated ? 'width 0.6s ease' : 'none',
            borderRadius: rounded ? '10px' : '0'
          }}
        >
          {/* Текст внутри прогресс-бара (только если достаточно места) */}
          {height >= 25 && (
            <span className="progress-bar-inner-text">
              {formatProgress(normalizedProgress)}
            </span>
          )}
        </div>
      </div>

      {/* Дополнительная информация под прогресс-баром */}
      <div className="progress-bar-footer">
        <div className="progress-bar-min">0%</div>
        <div className="progress-bar-mid">50%</div>
        <div className="progress-bar-max">100%</div>
      </div>
    </div>
  );
}

export default ProgressBar;