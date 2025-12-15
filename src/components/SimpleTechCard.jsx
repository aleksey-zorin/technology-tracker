import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';

const SimpleTechCard = ({ technology, onStatusChange, onEdit, onDelete }) => {
  const statusConfig = {
    'not-started': {
      color: 'default',
      icon: <PlayCircle />,
      label: 'Не начато',
      action: 'Начать',
      nextStatus: 'in-progress',
    },
    'in-progress': {
      color: 'primary',
      icon: <PauseCircle />,
      label: 'В процессе',
      action: 'Завершить',
      nextStatus: 'completed',
    },
    'completed': {
      color: 'success',
      icon: <CheckCircle />,
      label: 'Завершено',
      action: 'Начать заново',
      nextStatus: 'not-started',
    },
    'on-hold': {
      color: 'warning',
      icon: <PauseCircle />,
      label: 'На паузе',
      action: 'Продолжить',
      nextStatus: 'in-progress',
    },
  };

  const config = statusConfig[technology.status] || statusConfig['not-started'];
  
  const categoryColors = {
    frontend: '#1976d2',
    backend: '#d32f2f',
    mobile: '#388e3c',
    devops: '#ed6c02',
    database: '#9c27b0',
    tools: '#0288d1',
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: categoryColors[technology.category] || '#757575' }}>
            {technology.title.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <Box>
            <Tooltip title="Редактировать">
              <IconButton size="small" onClick={() => onEdit(technology)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton size="small" onClick={() => onDelete(technology.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        }
        title={
          <Typography variant="h6" component="div" noWrap>
            {technology.title}
          </Typography>
        }
        subheader={new Date(technology.createdAt).toLocaleDateString('ru-RU')}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {technology.description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={technology.category}
            size="small"
            sx={{ 
              bgcolor: `${categoryColors[technology.category] || '#757575'}20`,
              color: categoryColors[technology.category] || '#757575',
              fontWeight: 500,
            }}
          />
          
          <Chip 
            icon={config.icon}
            label={config.label}
            color={config.color}
            variant="outlined"
            size="small"
          />
        </Box>

        {technology.deadline && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Дедлайн: {new Date(technology.deadline).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
        )}

        {technology.progress !== undefined && (
          <Box sx={{ width: '100%', mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Прогресс
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {technology.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={technology.progress} 
              color={technology.progress >= 100 ? 'success' : 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={config.icon}
          onClick={() => onStatusChange(technology.id, config.nextStatus)}
          fullWidth
        >
          {config.action}
        </Button>
      </CardActions>
    </Card>
  );
};

export default SimpleTechCard;