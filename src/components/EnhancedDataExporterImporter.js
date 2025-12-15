import { useState, useRef } from 'react';

function EnhancedDataExporterImporter({ technologies, onImport }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    includeNotes: true,
    includeProgress: true,
    includeDeadlines: true,
    includeStatus: true,
    compress: false
  });
  
  const [importStatus, setImportStatus] = useState('');
  const [importErrors, setImportErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Статистика для экспорта
  const exportStats = {
    totalTechnologies: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    withDeadlines: technologies.filter(t => t.deadline).length,
    withNotes: technologies.filter(t => t.notes && t.notes.trim()).length
  };

  // Подготовка данных для экспорта
  const prepareExportData = () => {
    const baseData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        application: 'Technology Tracker',
        author: 'User',
        stats: exportStats
      }
    };

    const processedTechnologies = technologies.map(tech => {
      const baseTech = {
        id: tech.id,
        title: tech.title,
        description: tech.description,
        category: tech.category,
        difficulty: tech.difficulty,
        createdAt: tech.createdAt,
        resources: tech.resources || []
      };

      // Добавляем опциональные поля
      if (exportOptions.includeStatus) {
        baseTech.status = tech.status;
        baseTech.progress = exportOptions.includeProgress ? tech.progress : undefined;
      }
      
      if (exportOptions.includeDeadlines && tech.deadline) {
        baseTech.deadline = tech.deadline;
        baseTech.daysLeft = calculateDaysLeft(tech.deadline);
      }
      
      if (exportOptions.includeNotes && tech.notes) {
        baseTech.notes = tech.notes;
        baseTech.lastUpdated = tech.updatedAt;
      }

      return baseTech;
    });

    return {
      ...baseData,
      technologies: processedTechnologies,
      exportOptions
    };
  };

  // Вычисление дней до дедлайна
  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Экспорт в JSON
  const exportToJson = () => {
    const data = prepareExportData();
    const dataStr = exportOptions.compress 
      ? JSON.stringify(data)
      : JSON.stringify(data, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const filename = `tech-tracker-${new Date().toISOString().split('T')[0]}${exportOptions.compress ? '-min' : ''}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setImportStatus(`✅ Экспортировано ${technologies.length} технологий в ${filename}`);
  };

  // Экспорт в CSV
  const exportToCsv = () => {
    const data = prepareExportData();
    const headers = [
      'ID',
      'Название',
      'Описание',
      'Категория',
      'Сложность',
      'Статус',
      'Прогресс %',
      'Дедлайн',
      'Дней осталось',
      'Заметки'
    ];

    const csvRows = [
      headers.join(','),
      ...data.technologies.map(tech => {
        const row = [
          `"${tech.id}"`,
          `"${tech.title}"`,
          `"${tech.description.replace(/"/g, '""')}"`,
          `"${tech.category}"`,
          `"${tech.difficulty}"`,
          `"${tech.status || ''}"`,
          tech.progress || '',
          tech.deadline || '',
          tech.daysLeft || '',
          `"${(tech.notes || '').replace(/"/g, '""')}"`
        ];
        return row.join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const filename = `tech-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setImportStatus(`✅ Экспортировано ${technologies.length} технологий в CSV`);
  };

  // Обработка экспорта
  const handleExport = () => {
    try {
      if (exportFormat === 'json') {
        exportToJson();
      } else if (exportFormat === 'csv') {
        exportToCsv();
      }
    } catch (error) {
      setImportStatus(`❌ Ошибка экспорта: ${error.message}`);
    }
  };

  // Валидация импортируемых данных
  const validateImportData = (data) => {
    const errors = [];
    
    if (!data) {
      errors.push('Файл пустой или содержит невалидный JSON');
      return { isValid: false, errors };
    }

    // Проверка версии
    if (!data.version) {
      errors.push('Отсутствует версия формата данных');
    }

    // Проверка наличия технологий
    if (!data.technologies || !Array.isArray(data.technologies)) {
      errors.push('Отсутствует или неверный массив технологий');
      return { isValid: false, errors };
    }

    // Проверка каждой технологии
    data.technologies.forEach((tech, index) => {
      if (!tech.id) {
        errors.push(`Технология #${index + 1}: отсутствует ID`);
      }
      
      if (!tech.title || tech.title.trim() === '') {
        errors.push(`Технология #${index + 1}: отсутствует название`);
      }
      
      if (!tech.description || tech.description.trim() === '') {
        errors.push(`Технология #${index + 1}: отсутствует описание`);
      }
      
      if (tech.title && tech.title.length > 100) {
        errors.push(`Технология "${tech.title}": название слишком длинное (макс. 100 символов)`);
      }
      
      // Валидация даты дедлайна
      if (tech.deadline) {
        try {
          const date = new Date(tech.deadline);
          if (isNaN(date.getTime())) {
            errors.push(`Технология "${tech.title}": неверный формат даты дедлайна`);
          }
        } catch {
          errors.push(`Технология "${tech.title}": неверный формат даты дедлайна`);
        }
      }
      
      // Валидация прогресса
      if (tech.progress !== undefined) {
        const progress = parseInt(tech.progress);
        if (isNaN(progress) || progress < 0 || progress > 100) {
          errors.push(`Технология "${tech.title}": прогресс должен быть от 0 до 100`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : null
    };
  };

  // Обработка импорта
  const handleImport = (file) => {
    setImportStatus('');
    setImportErrors([]);
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const parsedData = JSON.parse(fileContent);
        
        const validation = validateImportData(parsedData);
        
        if (validation.isValid && validation.data) {
          // Обработка успешного импорта
          const importedTechs = validation.data.technologies.map(tech => ({
            ...tech,
            // Добавляем недостающие поля
            resources: tech.resources || [],
            category: tech.category || 'other',
            difficulty: tech.difficulty || 'beginner',
            createdAt: tech.createdAt || new Date().toISOString(),
            // Сохраняем оригинальный ID или генерируем новый
            originalId: tech.id,
            id: Date.now() + Math.random() // Генерация нового ID для избежания конфликтов
          }));
          
          onImport(importedTechs);
          setImportStatus(`✅ Успешно импортировано ${importedTechs.length} технологий`);
          
          // Показать статистику
          setTimeout(() => {
            const stats = {
              withDeadlines: importedTechs.filter(t => t.deadline).length,
              withNotes: importedTechs.filter(t => t.notes).length,
              completed: importedTechs.filter(t => t.status === 'completed').length
            };
            
            const statsMessage = [
              `• С дедлайнами: ${stats.withDeadlines}`,
              `• С заметками: ${stats.withNotes}`,
              `• Завершено: ${stats.completed}`
            ].join('\n');
            
            setImportStatus(prev => `${prev}\n${statsMessage}`);
          }, 100);
          
        } else {
          setImportErrors(validation.errors);
          setImportStatus(`❌ Найдено ${validation.errors.length} ошибок в файле`);
        }
        
      } catch (error) {
        setImportStatus(`❌ Ошибка чтения файла: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      setImportStatus('❌ Ошибка чтения файла');
    };
    
    reader.readAsText(file);
  };

  // Обработчики drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleImport(file);
    } else {
      setImportStatus('❌ Поддерживаются только JSON файлы');
    }
  };

  // Обработчик выбора файла
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImport(file);
    }
    // Сброс input
    e.target.value = '';
  };

  // Шаблон для экспорта
  const exportTemplate = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    technologies: [
      {
        id: 1,
        title: "Пример технологии",
        description: "Описание технологии",
        category: "frontend",
        difficulty: "beginner",
        status: "not-started",
        progress: 0,
        deadline: null,
        notes: "",
        resources: ["https://example.com"],
        createdAt: new Date().toISOString()
      }
    ]
  };

  // Скачать шаблон
  const downloadTemplate = () => {
    const dataStr = JSON.stringify(exportTemplate, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tech-tracker-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setImportStatus('✅ Шаблон загружен');
  };

  return (
    <div className="enhanced-data-manager">
      <div className="manager-header">
        <h2>Управление данными</h2>
        <p className="subtitle">Экспорт и импорт данных технологий</p>
      </div>

      {/* Экспорт секция */}
      <div className="export-section">
        <h3>📤 Экспорт данных</h3>
        
        <div className="stats-panel">
          <div className="stat-card">
            <span className="stat-label">Всего технологий</span>
            <span className="stat-value">{exportStats.totalTechnologies}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Завершено</span>
            <span className="stat-value">{exportStats.completed}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">В процессе</span>
            <span className="stat-value">{exportStats.inProgress}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">С дедлайнами</span>
            <span className="stat-value">{exportStats.withDeadlines}</span>
          </div>
        </div>

        <div className="export-options">
          <div className="form-group">
            <label htmlFor="export-format">Формат экспорта</label>
            <select
              id="export-format"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="select-input"
            >
              <option value="json">JSON (рекомендуется)</option>
              <option value="csv">CSV (Excel совместимый)</option>
            </select>
          </div>

          <div className="export-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportOptions.includeNotes}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
              />
              <span className="checkmark" />
              Включить заметки
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportOptions.includeProgress}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeProgress: e.target.checked }))}
              />
              <span className="checkmark" />
              Включить прогресс
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportOptions.includeDeadlines}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeDeadlines: e.target.checked }))}
              />
              <span className="checkmark" />
              Включить дедлайны
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportOptions.includeStatus}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeStatus: e.target.checked }))}
              />
              <span className="checkmark" />
              Включить статусы
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={exportOptions.compress}
                onChange={(e) => setExportOptions(prev => ({ ...prev, compress: e.target.checked }))}
              />
              <span className="checkmark" />
              Сжатый JSON
            </label>
          </div>
        </div>

        <div className="export-actions">
          <button
            onClick={handleExport}
            disabled={technologies.length === 0}
            className="btn-export"
            title={`Экспортировать ${technologies.length} технологий`}
          >
            📥 Экспортировать данные
            {technologies.length > 0 && ` (${technologies.length})`}
          </button>
          
          <button
            onClick={downloadTemplate}
            className="btn-template"
            title="Скачать шаблон для заполнения"
          >
            📋 Скачать шаблон
          </button>
        </div>
      </div>

      {/* Импорт секция */}
      <div className="import-section">
        <h3>📤 Импорт данных</h3>
        
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Перетащите JSON файл или кликните для выбора"
        >
          <div className="drop-content">
            <div className="drop-icon">📁</div>
            <p className="drop-text">
              {isDragging ? 'Отпустите файл здесь' : 'Перетащите JSON файл сюда'}
            </p>
            <p className="drop-subtext">или кликните для выбора файла</p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="file-input-hidden"
              aria-label="Выберите JSON файл для импорта"
            />
          </div>
        </div>

        {/* Требования к файлу */}
        <div className="import-requirements">
          <h4>Требования к файлу:</h4>
          <ul>
            <li>✅ Формат: JSON</li>
            <li>✅ Обязательные поля: id, title, description</li>
            <li>✅ Макс. длина названия: 100 символов</li>
            <li>✅ Поддерживаемые статусы: not-started, in-progress, completed</li>
            <li>✅ Прогресс: от 0 до 100%</li>
          </ul>
        </div>

        {/* Статус импорта */}
        {importStatus && (
          <div className={`import-status ${importStatus.includes('✅') ? 'success' : 'error'}`}>
            <div className="status-content">
              <pre>{importStatus}</pre>
            </div>
          </div>
        )}

        {/* Список ошибок */}
        {importErrors.length > 0 && (
          <div className="import-errors">
            <h4>Найдены ошибки ({importErrors.length}):</h4>
            <div className="errors-list">
              {importErrors.slice(0, 10).map((error, index) => (
                <div key={index} className="error-item">
                  <span className="error-badge">!</span>
                  {error}
                </div>
              ))}
              {importErrors.length > 10 && (
                <div className="error-more">
                  ... и еще {importErrors.length - 10} ошибок
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Информация о совместимости */}
      <div className="compatibility-info">
        <h4>ℹ️ Информация о совместимости</h4>
        <p>
          Формат данных версии 2.0 поддерживает обратную совместимость с форматом 1.0.
          При импорте данные автоматически адаптируются к текущей структуре.
        </p>
        <div className="compatibility-badges">
          <span className="badge">JSON</span>
          <span className="badge">UTF-8</span>
          <span className="badge">Unicode</span>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDataExporterImporter;