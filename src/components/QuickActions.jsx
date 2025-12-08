import React, { useState } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar'; // Добавляем импорт
import './QuickActions.css';

/**
 * Компонент быстрых действий для управления технологиями
 */
function QuickActions({ 
  technologies,
  onMarkAllCompleted,
  onResetAll,
  onExportData,
  onImportData,
  onClearStorage,
  statistics
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importResult, setImportResult] = useState(null);

  // Обработка экспорта
  const handleExport = () => {
    if (onExportData) {
      const exportResult = onExportData();
      if (exportResult && exportResult.download) {
        exportResult.download();
      }
      setShowExportModal(true);
    }
  };

  // Обработка импорта
  const handleImport = () => {
    if (onImportData && importData.trim()) {
      const result = onImportData(importData);
      setImportResult(result);
      
      if (result.success) {
        setTimeout(() => {
          setShowImportModal(false);
          setImportData('');
          setImportResult(null);
        }, 2000);
      }
    }
  };

  // Обработка очистки хранилища
  const handleClearStorage = () => {
    if (onClearStorage) {
      onClearStorage();
      setShowClearModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Загрузка файла для импорта
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="quick-actions">
      <h3 className="quick-actions-title">⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        {/* Действие 1: Отметить все как выполненные */}
        <button 
          className="action-btn action-complete"
          onClick={onMarkAllCompleted}
          title="Отметить все технологии как изученные"
        >
          <span className="action-icon">✅</span>
          <span className="action-text">Выполнить все</span>
        </button>

        {/* Действие 2: Сбросить все статусы */}
        <button 
          className="action-btn action-reset"
          onClick={onResetAll}
          title="Сбросить статусы всех технологий"
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Сбросить все</span>
        </button>

        {/* Действие 3: Экспорт данных */}
        <button 
          className="action-btn action-export"
          onClick={handleExport}
          title="Экспортировать данные в файл"
        >
          <span className="action-icon">📤</span>
          <span className="action-text">Экспорт</span>
        </button>

        {/* Действие 4: Импорт данных */}
        <button 
          className="action-btn action-import"
          onClick={() => setShowImportModal(true)}
          title="Импортировать данные из файла"
        >
          <span className="action-icon">📥</span>
          <span className="action-text">Импорт</span>
        </button>

        {/* Действие 5: Очистить хранилище */}
        <button 
          className="action-btn action-clear"
          onClick={() => setShowClearModal(true)}
          title="Очистить все сохраненные данные"
        >
          <span className="action-icon">🗑️</span>
          <span className="action-text">Очистить</span>
        </button>

        {/* Действие 6: Статистика */}
        <button 
          className="action-btn action-stats"
          onClick={() => setShowExportModal(true)}
          title="Просмотр статистики"
        >
          <span className="action-icon">📊</span>
          <span className="action-text">Статистика</span>
          {statistics && (
            <span className="action-badge">{statistics.progressPercentage}%</span>
          )}
        </button>
      </div>

      {/* Модальное окно экспорта/статистики */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="📊 Статистика и экспорт"
        size="lg"
      >
        <div className="export-content">
          {statistics && (
            <div className="stats-section">
              <h4>📈 Общая статистика:</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{statistics.total}</div>
                  <div className="stat-label">Всего технологий</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{statistics.completed}</div>
                  <div className="stat-label">Изучено</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{statistics.inProgress}</div>
                  <div className="stat-label">В процессе</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{statistics.notStarted}</div>
                  <div className="stat-label">Не начато</div>
                </div>
              </div>
              
              <div className="progress-section">
                <h4>🎯 Общий прогресс:</h4>
                <ProgressBar
                  progress={statistics.progressPercentage}
                  height={25}
                  variant="success"
                  animated={true}
                  showPercentage={true}
                  showValue={true}
                  striped={true}
                />
              </div>

              <div className="category-section">
                <h4>🏷️ По категориям:</h4>
                {Object.entries(statistics.categoryStats || {}).map(([category, stats]) => (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-progress">
                        {Math.round((stats.completed / stats.total) * 100)}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={(stats.completed / stats.total) * 100}
                      height={12}
                      color="#9C27B0"
                      showPercentage={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="export-buttons">
            <button 
              className="export-btn"
              onClick={handleExport}
            >
              📥 Скачать данные в JSON
            </button>
            <button 
              className="export-copy-btn"
              onClick={() => {
                if (onExportData) {
                  const data = onExportData();
                  navigator.clipboard.writeText(data.string);
                  alert('Данные скопированы в буфер обмена!');
                }
              }}
            >
              📋 Копировать JSON
            </button>
          </div>
        </div>
      </Modal> {/* Закрывающий тег Modal */}

      {/* Модальное окно импорта */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportResult(null);
        }}
        title="📥 Импорт данных"
        size="md"
      >
        <div className="import-content">
          {importResult && (
            <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
              {importResult.success ? '✅ ' : '❌ '}
              {importResult.message}
            </div>
          )}
          
          <div className="import-section">
            <h4>Загрузите JSON файл:</h4>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="file-input"
            />
            <small className="file-hint">
              Поддерживаются только файлы в формате JSON
            </small>
          </div>
          
          <div className="import-section">
            <h4>Или вставьте JSON данные:</h4>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='{"technologies": [...]}'
              rows="6"
              className="import-textarea"
            />
          </div>
          
          <div className="import-buttons">
            <button 
              onClick={handleImport}
              disabled={!importData.trim()}
              className="import-btn"
            >
              📥 Импортировать
            </button>
            <button 
              onClick={() => {
                setShowImportModal(false);
                setImportData('');
                setImportResult(null);
              }}
              className="cancel-btn"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно очистки */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="⚠️ Очистка данных"
        size="sm"
      >
        <div className="clear-content">
          <div className="warning-icon">⚠️</div>
          <h4>Вы уверены?</h4>
          <p>Это действие удалит все сохраненные данные и их нельзя будет восстановить.</p>
          
          <div className="clear-stats">
            <p>Будет удалено:</p>
            <ul>
              <li>{statistics?.total || 0} технологий</li>
              <li>Все заметки и прогресс</li>
              <li>Все настройки</li>
            </ul>
          </div>
          
          <div className="clear-buttons">
            <button 
              onClick={handleClearStorage}
              className="confirm-clear-btn"
            >
              🗑️ Да, очистить всё
            </button>
            <button 
              onClick={() => setShowClearModal(false)}
              className="cancel-clear-btn"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div> // Закрывающий тег для div.quick-actions
  );
}

export default QuickActions;