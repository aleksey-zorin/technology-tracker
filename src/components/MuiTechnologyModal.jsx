import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  FormHelperText,
  Autocomplete,
  Slider,
  Typography,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const MuiTechnologyModal = ({ open, onClose, technology, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner',
    status: 'not-started',
    deadline: '',
    resources: [''],
    notes: '',
    progress: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'frontend',
    'backend',
    'mobile',
    'devops',
    'database',
    'tools',
    'cloud',
    'ai-ml',
    'other',
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' },
    { value: 'expert', label: 'Эксперт' },
  ];

  const statusOptions = [
    { value: 'not-started', label: 'Не начато' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'on-hold', label: 'На паузе' },
    { value: 'completed', label: 'Завершено' },
  ];

  useEffect(() => {
    if (technology) {
      setFormData({
        title: technology.title || '',
        description: technology.description || '',
        category: technology.category || 'frontend',
        difficulty: technology.difficulty || 'beginner',
        status: technology.status || 'not-started',
        deadline: technology.deadline || '',
        resources: technology.resources || [''],
        notes: technology.notes || '',
        progress: technology.progress || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'frontend',
        difficulty: 'beginner',
        status: 'not-started',
        deadline: '',
        resources: [''],
        notes: '',
        progress: 0,
      });
    }
    setErrors({});
  }, [technology, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...formData,
        resources: formData.resources.filter(r => r.trim() !== ''),
        progress: formData.status === 'completed' ? 100 : formData.progress,
      };
      
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({ ...prev, resources: newResources }));
  };

  const addResourceField = () => {
    setFormData(prev => ({ ...prev, resources: [...prev.resources, ''] }));
  };

  const removeResourceField = (index) => {
    if (formData.resources.length > 1) {
      const newResources = formData.resources.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, resources: newResources }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="span">
            {technology ? 'Редактирование технологии' : 'Добавление новой технологии'}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название технологии *"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                disabled={isSubmitting}
                placeholder="Например: React, Docker, TypeScript"
                variant="outlined"
                size="medium"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание *"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                disabled={isSubmitting}
                placeholder="Опишите технологию, её назначение и почему вы хотите её изучить..."
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category}
                  label="Категория"
                  onChange={(e) => handleChange('category', e.target.value)}
                  disabled={isSubmitting}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Сложность</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Сложность"
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                  disabled={isSubmitting}
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formData.status}
                  label="Статус"
                  onChange={(e) => handleChange('status', e.target.value)}
                  disabled={isSubmitting}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Дедлайн изучения"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                error={!!errors.deadline}
                helperText={errors.deadline}
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  input: {
                    min: new Date().toISOString().split('T')[0],
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Прогресс изучения
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.progress}
                  onChange={(_, value) => handleChange('progress', value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' },
                  ]}
                  disabled={isSubmitting || formData.status === 'completed'}
                />
              </Box>
              {formData.status === 'completed' && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Для завершенных технологий прогресс автоматически установлен на 100%
                </Alert>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Ресурсы для изучения
              </Typography>
              
              {formData.resources.map((resource, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    type="url"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    placeholder="https://example.com/learning-resource"
                    variant="outlined"
                    size="small"
                    disabled={isSubmitting}
                  />
                  {formData.resources.length > 1 && (
                    <Tooltip title="Удалить ресурс">
                      <IconButton
                        size="small"
                        onClick={() => removeResourceField(index)}
                        disabled={isSubmitting}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addResourceField}
                variant="outlined"
                size="small"
                disabled={isSubmitting}
              >
                Добавить ресурс
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Заметки"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={isSubmitting}
                placeholder="Личные заметки, идеи, важные моменты..."
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          variant="outlined"
          size="large"
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          size="large"
          startIcon={isSubmitting ? null : null}
        >
          {isSubmitting ? 'Сохранение...' : technology ? 'Обновить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MuiTechnologyModal;