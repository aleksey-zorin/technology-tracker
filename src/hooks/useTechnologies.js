import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Кастомный хук для управления технологиями
 */
const useTechnologies = () => {
  // Начальные данные
  const initialTechnologies = [
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение базовых компонентов React и их жизненного цикла', 
      status: 'not-started',
      notes: '',
      category: 'React Basics',
      difficulty: 'Начальный',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX и его отличий от обычного HTML', 
      status: 'not-started',
      notes: '',
      category: 'React Basics',
      difficulty: 'Начальный',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 3, 
      title: 'useState Hook', 
      description: 'Работа с состоянием компонентов через useState', 
      status: 'not-started',
      notes: '',
      category: 'Hooks',
      difficulty: 'Средний',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 4, 
      title: 'useEffect Hook', 
      description: 'Побочные эффекты и жизненный цикл компонентов', 
      status: 'not-started',
      notes: '',
      category: 'Hooks',
      difficulty: 'Средний',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 5, 
      title: 'Props System', 
      description: 'Передача данных между компонентами через props', 
      status: 'not-started',
      notes: '',
      category: 'React Basics',
      difficulty: 'Начальный',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 6, 
      title: 'Conditional Rendering', 
      description: 'Условный рендеринг компонентов', 
      status: 'not-started',
      notes: '',
      category: 'Advanced',
      difficulty: 'Средний',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];

  // Получаем данные из localStorage
  const [technologies, setTechnologies] = useState(() => {
    try {
      const stored = localStorage.getItem('tech-tracker-technologies');
      return stored ? JSON.parse(stored) : initialTechnologies;
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
      return initialTechnologies;
    }
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('tech-tracker-technologies', JSON.stringify(technologies));
    } catch (error) {
      console.error('Ошибка при сохранении в localStorage:', error);
    }
  }, [technologies]);

  // Генератор ID для новых технологий
  const generateId = useCallback(() => {
    return technologies.length > 0 
      ? Math.max(...technologies.map(t => t.id)) + 1
      : 1;
  }, [technologies]);

  // Обновление статуса технологии
  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prevTechs => 
      prevTechs.map(tech => 
        tech.id === techId 
          ? { 
              ...tech, 
              status: newStatus,
              updatedAt: new Date().toISOString()
            } 
          : tech
      )
    );
  }, []);

  // Обновление заметок
  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies(prevTechs => 
      prevTechs.map(tech => 
        tech.id === techId 
          ? { 
              ...tech, 
              notes: newNotes,
              updatedAt: new Date().toISOString()
            } 
          : tech
      )
    );
  }, []);

  // Добавление новой технологии
  const addTechnology = useCallback((newTech) => {
    const techWithId = {
      ...newTech,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTechnologies(prev => [...prev, techWithId]);
    return techWithId;
  }, [generateId]);

  // Удаление технологии
  const removeTechnology = useCallback((techId) => {
    setTechnologies(prevTechs => prevTechs.filter(tech => tech.id !== techId));
  }, []);

  // Отметить все как выполненные
  const markAllCompleted = useCallback(() => {
    setTechnologies(prevTechs => 
      prevTechs.map(tech => ({
        ...tech,
        status: 'completed',
        updatedAt: new Date().toISOString()
      }))
    );
  }, []);

  // Сбросить все статусы
  const resetAllStatuses = useCallback(() => {
    setTechnologies(prevTechs => 
      prevTechs.map(tech => ({
        ...tech,
        status: 'not-started',
        updatedAt: new Date().toISOString()
      }))
    );
  }, []);

  // Удалить все технологии
  const removeTechnologies = useCallback(() => {
    setTechnologies([]);
  }, []);

  // Очистить все технологии (синоним для removeTechnologies)
  const clearAllTechnologies = useCallback(() => {
    setTechnologies([]);
  }, []);

  // Получение статистики
  const statistics = useMemo(() => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Статистика по категориям
    const categoryStats = {};
    technologies.forEach(tech => {
      if (!categoryStats[tech.category]) {
        categoryStats[tech.category] = { total: 0, completed: 0 };
      }
      categoryStats[tech.category].total++;
      if (tech.status === 'completed') {
        categoryStats[tech.category].completed++;
      }
    });

    // Статистика по сложности
    const difficultyStats = {};
    technologies.forEach(tech => {
      if (!difficultyStats[tech.difficulty]) {
        difficultyStats[tech.difficulty] = { total: 0, completed: 0 };
      }
      difficultyStats[tech.difficulty].total++;
      if (tech.status === 'completed') {
        difficultyStats[tech.difficulty].completed++;
      }
    });

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progressPercentage,
      categoryStats,
      difficultyStats
    };
  }, [technologies]);

  // Экспорт данных
  const exportData = useCallback(() => {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      technologies: technologies,
      statistics: statistics
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    return {
      data: exportObject,
      string: dataStr,
      blob: dataBlob,
      download: () => {
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };
  }, [technologies, statistics]);

  // Импорт данных
  const importData = useCallback((data) => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Проверяем валидность данных
      if (!parsedData.technologies || !Array.isArray(parsedData.technologies)) {
        throw new Error('Некорректный формат данных');
      }

      // Обновляем данные
      setTechnologies(parsedData.technologies);
      return { success: true, message: 'Данные успешно импортированы' };
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
      return { success: false, message: `Ошибка импорта: ${error.message}` };
    }
  }, []);

  return {
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
  };
};

export default useTechnologies;