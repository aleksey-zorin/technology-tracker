import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const {
        technologies,
        updateStatus,
        updateNotes,
        removeTechnology
    } = useTechnologies();

    const [technology, setTechnology] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    // Загрузка технологии
    useEffect(() => {
        if (techId && technologies.length > 0) {
            const foundTech = technologies.find(tech => tech.id.toString() === techId);
            setTechnology(foundTech || null);
            setLoading(false);
        }
    }, [techId, technologies]);

    // Если технология не найдена
    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!technology) {
        return (
            <div className="tech-not-found">
                <h2>Технология не найдена</h2>
                <p>Запрошенная технология не существует или была удалена.</p>
                <Link to="/technologies" className="back-link">
                    ← Вернуться к списку
                </Link>
            </div>
        );
    }

    // Обработчики
    const handleEdit = () => {
        setEditData({
            title: technology.title,
            description: technology.description,
            category: technology.category,
            difficulty: technology.difficulty,
            notes: technology.notes
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        // Здесь будет логика сохранения изменений
        console.log('Сохраняем изменения:', editData);
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        removeTechnology(technology.id);
        setIsDeleteModalOpen(false);
        navigate('/technologies');
    };

    return (
        <div className="technology-detail">
            {/* Хлебные крошки */}
            <nav className="breadcrumbs">
                <Link to="/">Главная</Link>
                <span> / </span>
                <Link to="/technologies">Технологии</Link>
                <span> / </span>
                <span>{technology.title}</span>
            </nav>

            {/* Заголовок */}
            <div className="tech-header">
                <h1>{technology.title}</h1>
                <div className="tech-actions">
                    <button onClick={handleEdit} className="btn-edit">
                        ✏️ Редактировать
                    </button>
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)} 
                        className="btn-delete"
                    >
                        🗑️ Удалить
                    </button>
                </div>
            </div>

            {/* Статус и прогресс */}
            <div className="tech-status-section">
                <div className={`status-badge status-${technology.status}`}>
                    {technology.status === 'not-started' ? 'Не начато' :
                     technology.status === 'in-progress' ? 'В процессе' : 
                     'Завершено'}
                </div>
                <ProgressBar status={technology.status} />
            </div>

            {/* Описание */}
            <div className="tech-description-section">
                <h3>Описание</h3>
                <p>{technology.description || 'Описание отсутствует'}</p>
            </div>

            {/* Детали */}
            <div className="tech-details-grid">
                <div className="detail-card">
                    <h4>Категория</h4>
                    <p>{technology.category}</p>
                </div>
                <div className="detail-card">
                    <h4>Сложность</h4>
                    <p>{technology.difficulty}</p>
                </div>
                <div className="detail-card">
                    <h4>Дата добавления</h4>
                    <p>{new Date(technology.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="detail-card">
                    <h4>Статус</h4>
                    <p>{technology.status}</p>
                </div>
            </div>

            {/* Заметки */}
            <div className="tech-notes-section">
                <h3>Заметки</h3>
                <div className="notes-content">
                    {technology.notes ? (
                        <pre>{technology.notes}</pre>
                    ) : (
                        <p className="no-notes">Заметок пока нет</p>
                    )}
                </div>
            </div>

            {/* Модальное окно редактирования */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Редактировать технологию"
            >
                <div className="edit-form">
                    <div className="form-group">
                        <label>Название</label>
                        <input
                            type="text"
                            value={editData.title || ''}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={editData.description || ''}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label>Заметки</label>
                        <textarea
                            value={editData.notes || ''}
                            onChange={(e) => setEditData({...editData, notes: e.target.value})}
                            rows="6"
                        />
                    </div>
                    <div className="modal-actions">
                        <button onClick={handleSaveEdit} className="btn-primary">
                            Сохранить
                        </button>
                        <button onClick={() => setIsEditModalOpen(false)} className="btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Модальное окно удаления */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Подтверждение удаления"
            >
                <div className="delete-confirm">
                    <p>Вы уверены, что хотите удалить технологию <strong>"{technology.title}"</strong>?</p>
                    <p className="warning-text">Это действие нельзя отменить.</p>
                    <div className="modal-actions">
                        <button onClick={handleDelete} className="btn-danger">
                            Да, удалить
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default TechnologyDetail;