import { useState, useEffect } from 'react';

function DeadlineForm({ technologies, onUpdateDeadlines, onCancel }) {
  const [deadlines, setDeadlines] = useState({});
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация состояний при загрузке
  useEffect(() => {
    const initialDeadlines = {};
    technologies.forEach(tech => {
      initialDeadlines[tech.id] = tech.deadline || '';
    });
    setDeadlines(initialDeadlines);
  }, [technologies]);

  // Валидация отдельных дат
  const validateDate = (techId, date) => {
    const newErrors = { ...errors };
    
    if (!date) {
      delete newErrors[techId];
      setErrors(newErrors);
      return true; // Пустая дата допустима
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors[techId] = 'Дата не может быть в прошлом';
      setErrors(newErrors);
      return false;
    }
    
    // Проверка на слишком далекое будущее (2 года)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    
    if (selectedDate > maxDate) {
      newErrors[techId] = 'Дата не может быть больше 2 лет вперед';
      setErrors(newErrors);
      return false;
    }

    delete newErrors[techId];
    setErrors(newErrors);
    return true;
  };

  // Глобальная валидация формы
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    Object.entries(deadlines).forEach(([techId, date]) => {
      if (!date) return; // Пропускаем пустые даты
      
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors[techId] = 'Дата не может быть в прошлом';
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors && Object.keys(newErrors).length === 0;
  };

  // Обработчик изменения даты
  const handleDateChange = (techId, date) => {
    setDeadlines(prev => ({
      ...prev,
      [techId]: date
    }));
    
    // Валидация в реальном времени
    validateDate(techId, date);
    setGlobalError('');
  };

  // Установить всем одну дату
  const setAllDeadlines = (date) => {
    const newDeadlines = {};
    technologies.forEach(tech => {
      newDeadlines[tech.id] = date;
    });
    setDeadlines(newDeadlines);
    
    // Валидировать все даты
    technologies.forEach(tech => {
      validateDate(tech.id, date);
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGlobalError('');

    if (!validateForm()) {
      setIsSubmitting(false);
      setGlobalError('Исправьте ошибки в датах');
      return;
    }

    try {
      // Фильтруем только измененные даты
      const updates = technologies
        .filter(tech => deadlines[tech.id] !== tech.deadline)
        .map(tech => ({
          id: tech.id,
          deadline: deadlines[tech.id] || null
        }));

      await onUpdateDeadlines(updates);
      
      // Показать сообщение об успехе
      setGlobalError('Сроки успешно обновлены!');
      setTimeout(() => {
        if (onCancel) onCancel();
      }, 1500);
      
    } catch (error) {
      setGlobalError(`Ошибка обновления: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Быстрые опции дат
  const quickDateOptions = [
    { label: 'Через неделю', days: 7 },
    { label: 'Через месяц', days: 30 },
    { label: 'Через 3 месяца', days: 90 },
    { label: 'Через полгода', days: 180 }
  ];

  // Рассчитать дату
  const calculateDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="deadline-form" noValidate>
      <div className="form-header">
        <h2>Установка сроков изучения</h2>
        <p className="form-subtitle">
          Установите дедлайны для {technologies.length} технологий
        </p>
      </div>

      {/* Быстрые действия */}
      <div className="quick-actions">
        <h3>Быстрая установка:</h3>
        <div className="quick-buttons">
          {quickDateOptions.map(option => (
            <button
              key={option.label}
              type="button"
              onClick={() => setAllDeadlines(calculateDate(option.days))}
              className="btn-quick"
              title={`Установить всем ${option.label.toLowerCase()}`}
            >
              {option.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAllDeadlines('')}
            className="btn-quick btn-clear"
            title="Очистить все даты"
          >
            Очистить все
          </button>
        </div>
      </div>

      {/* Список технологий с полями дат */}
      <div className="deadlines-list">
        <div className="list-header">
          <span className="header-tech">Технология</span>
          <span className="header-date">Дата изучения</span>
          <span className="header-status">Статус</span>
        </div>

        {technologies.map(tech => {
          const deadlineError = errors[tech.id];
          const currentDate = deadlines[tech.id] || '';
          
          // Вычисляем оставшееся время
          let timeLeft = '';
          let timeClass = '';
          
          if (currentDate) {
            const today = new Date();
            const deadline = new Date(currentDate);
            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
              timeLeft = `Просрочено на ${Math.abs(diffDays)} дн.`;
              timeClass = 'overdue';
            } else if (diffDays === 0) {
              timeLeft = 'Сегодня';
              timeClass = 'today';
            } else if (diffDays <= 7) {
              timeLeft = `Осталось ${diffDays} дн.`;
              timeClass = 'urgent';
            } else if (diffDays <= 30) {
              timeLeft = `Осталось ${Math.floor(diffDays / 7)} нед.`;
              timeClass = 'soon';
            } else {
              timeLeft = `Осталось ${Math.floor(diffDays / 30)} мес.`;
              timeClass = 'normal';
            }
          }

          return (
            <div key={tech.id} className="deadline-item">
              <div className="tech-info">
                <span className="tech-title">{tech.title}</span>
                <span className="tech-category">{tech.category}</span>
              </div>
              
              <div className="date-input-group">
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => handleDateChange(tech.id, e.target.value)}
                  className={`date-input ${deadlineError ? 'error' : ''}`}
                  aria-label={`Дата изучения для ${tech.title}`}
                  aria-describedby={deadlineError ? `error-${tech.id}` : undefined}
                  min={new Date().toISOString().split('T')[0]}
                />
                {deadlineError && (
                  <span 
                    id={`error-${tech.id}`} 
                    className="error-message" 
                    role="alert"
                  >
                    {deadlineError}
                  </span>
                )}
              </div>
              
              <div className={`time-left ${timeClass}`}>
                {currentDate ? timeLeft : 'Не установлен'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Глобальная ошибка/успех */}
      {globalError && (
        <div 
          className={`global-message ${globalError.includes('успешно') ? 'success' : 'error'}`}
          role={globalError.includes('успешно') ? 'status' : 'alert'}
        >
          {globalError}
        </div>
      )}

      {/* Статистика */}
      <div className="deadline-stats">
        <div className="stat-item">
          <span className="stat-label">Установлено дат:</span>
          <span className="stat-value">
            {Object.values(deadlines).filter(date => date).length} / {technologies.length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">С ошибками:</span>
          <span className="stat-value error">
            {Object.keys(errors).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ближайший дедлайн:</span>
          <span className="stat-value">
            {(() => {
              const validDates = Object.values(deadlines)
                .filter(date => date && !errors[Object.keys(deadlines).find(key => deadlines[key] === date)])
                .map(date => new Date(date));
              
              if (validDates.length === 0) return 'Нет';
              
              const nearest = new Date(Math.min(...validDates));
              return nearest.toLocaleDateString('ru-RU');
            })()}
          </span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="btn-primary"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить сроки'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Отмена
        </button>
      </div>

      {/* Информация для доступности */}
      <div className="accessibility-info" role="note">
        <p>Используйте клавишу Tab для навигации между полями ввода дат.</p>
        <p>Для быстрой установки дат используйте кнопки "Быстрая установка".</p>
      </div>
    </form>
  );
}

export default DeadlineForm;