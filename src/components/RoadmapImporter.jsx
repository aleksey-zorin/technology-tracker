// src/components/RoadmapImporter.js
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function RoadmapImporter() {
  const { addTechnology } = useTechnologiesApi();
  const [importing, setImporting] = useState(false);

  const handleExampleImport = async () => {
    try {
      setImporting(true);
      
      // Имитация загрузки дорожной карты (как в задании)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Примерные данные для импорта
      const roadmapData = {
        technologies: [
          {
            title: 'HTML/CSS',
            description: 'Основы веб-разработки',
            category: 'frontend',
            difficulty: 'beginner',
            resources: ['https://developer.mozilla.org/ru/docs/Web/HTML']
          },
          {
            title: 'JavaScript',
            description: 'Язык программирования для веба',
            category: 'frontend',
            difficulty: 'beginner',
            resources: ['https://learn.javascript.ru/']
          },
          {
            title: 'Git',
            description: 'Система контроля версий',
            category: 'tools',
            difficulty: 'beginner',
            resources: ['https://git-scm.com/']
          }
        ]
      };
      
      // Добавляем каждую технологию из дорожной карты
      for (const tech of roadmapData.technologies) {
        await addTechnology(tech);
      }
      
      alert(`Успешно импортировано ${roadmapData.technologies.length} технологий`);
      
    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>
      
      <div className="import-actions">
        <button 
          onClick={handleExampleImport}
          disabled={importing}
          className="import-button"
        >
          {importing ? 'Импорт...' : 'Импорт пример дорожной карты'}
        </button>
      </div>

      <p className="import-hint">Добавит базовые технологии для изучения веб-разработки</p>
    </div>
  );
}

export default RoadmapImporter;