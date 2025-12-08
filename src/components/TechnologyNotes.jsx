import React, { useState, useEffect } from 'react';
import './TechnologyNotes.css';

function TechnologyNotes({ techId, notes, onNotesChange }) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [charCount, setCharCount] = useState(notes.length);
  const [lastSaved, setLastSaved] = useState(null);

  // Эффект для автосохранения с задержкой
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNotes !== notes) {
        onNotesChange(techId, localNotes);
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 500); // Задержка 500мс для автосохранения

    return () => clearTimeout(timer);
  }, [localNotes, techId, onNotesChange, notes]);

  // Эффект для обновления при изменении props
  useEffect(() => {
    setLocalNotes(notes);
    setCharCount(notes.length);
  }, [notes]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalNotes(value);
    setCharCount(value.length);
  };

  const handleSave = () => {
    onNotesChange(techId, localNotes);
    setLastSaved(new Date().toLocaleTimeString());
  };

  return (
    <div className="technology-notes">
      <div className="notes-header">
        <h4>📝 Мои заметки</h4>
        <div className="notes-stats">
          <span className="char-count">{charCount}/500 символов</span>
          {lastSaved && <span className="saved-time">Сохранено: {lastSaved}</span>}
        </div>
      </div>
      
      <textarea
        value={localNotes}
        onChange={handleChange}
        placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
        rows="4"
        maxLength="500"
        className={`notes-textarea ${charCount > 400 ? 'warning' : ''}`}
      />
      
      <div className="notes-footer">
        <div className="notes-hint">
          {charCount === 0 && '💡 Добавьте заметки для этой технологии...'}
          {charCount > 0 && charCount <= 100 && '📝 Заметка сохранена'}
          {charCount > 100 && charCount <= 300 && '📚 Подробная заметка'}
          {charCount > 300 && '⚠️ Приближаетесь к лимиту символов'}
        </div>
        <button 
          onClick={handleSave}
          className="save-notes-btn"
          disabled={localNotes === notes}
        >
          💾 Сохранить
        </button>
      </div>
    </div>
  );
}

export default TechnologyNotes;