import React, { createContext, useState, useContext, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Box,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const NotificationContext = createContext({});

const SlideTransition = (props) => <Slide {...props} direction="left" />;

const NotificationProvider = ({ children, maxNotifications = 3 }) => {
  const [notifications, setNotifications] = useState([]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon fontSize="small" />;
      case 'error': return <ErrorIcon fontSize="small" />;
      case 'warning': return <WarningIcon fontSize="small" />;
      case 'info': return <InfoIcon fontSize="small" />;
      default: return <InfoIcon fontSize="small" />;
    }
  };

  const showNotification = useCallback((options) => {
    const {
      message,
      severity = 'info',
      title = '',
      duration = 6000,
      action = null,
      showIcon = true,
      variant = 'filled',
      anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
      persist = false,
    } = options;

    const id = Date.now();
    
    const newNotification = {
      id,
      open: true,
      message,
      severity,
      title,
      duration,
      action,
      showIcon,
      variant,
      anchorOrigin,
      persist,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Ограничиваем количество отображаемых уведомлений
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      return updated;
    });

    // Автоматическое закрытие если не persist
    if (!persist && duration > 0) {
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, open: false } : notif
          )
        );
        
        // Удаление из массива после анимации закрытия
        setTimeout(() => {
          setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 300);
      }, duration);
    }

    return id;
  }, [maxNotifications]);

  const closeNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, open: false } : notif
      )
    );
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  }, []);

  const closeAllNotifications = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, open: false })));
    setTimeout(() => setNotifications([]), 300);
  }, []);

  const contextValue = {
    showNotification,
    closeNotification,
    closeAllNotifications,
    notifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
        }}
      >
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={notification.open}
            autoHideDuration={null}
            onClose={() => closeNotification(notification.id)}
            TransitionComponent={SlideTransition}
            anchorOrigin={notification.anchorOrigin}
            sx={{ position: 'static', transform: 'none !important' }}
          >
            <Alert
              severity={notification.severity}
              variant={notification.variant}
              onClose={() => closeNotification(notification.id)}
              icon={notification.showIcon ? getSeverityIcon(notification.severity) : false}
              action={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {notification.action && (
                    <Box sx={{ mr: 1 }}>
                      {notification.action}
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => closeNotification(notification.id)}
                    color="inherit"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              sx={{
                width: '100%',
                boxShadow: 3,
                '& .MuiAlert-message': {
                  flex: 1,
                },
              }}
            >
              {notification.title && (
                <AlertTitle sx={{ mb: 0.5 }}>
                  {notification.title}
                </AlertTitle>
              )}
              <Typography variant="body2">
                {notification.message}
              </Typography>
            </Alert>
          </Snackbar>
        ))}
        
        {notifications.length > 1 && (
          <Alert
            severity="info"
            variant="outlined"
            sx={{ mt: 1 }}
            action={
              <Button
                size="small"
                color="inherit"
                onClick={closeAllNotifications}
              >
                Закрыть все
              </Button>
            }
          >
            <Typography variant="caption">
              Показано {notifications.length} уведомлений
            </Typography>
          </Alert>
        )}
      </Box>
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  
  const { showNotification, closeNotification, closeAllNotifications } = context;
  
  // Утилитарные методы для разных типов уведомлений
  const showSuccess = useCallback((message, options = {}) => {
    return showNotification({ 
      message, 
      severity: 'success',
      title: 'Успешно!',
      ...options 
    });
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    return showNotification({ 
      message, 
      severity: 'error',
      title: 'Ошибка!',
      ...options 
    });
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return showNotification({ 
      message, 
      severity: 'warning',
      title: 'Внимание!',
      ...options 
    });
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return showNotification({ 
      message, 
      severity: 'info',
      title: 'Информация',
      ...options 
    });
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification,
    closeAllNotifications,
  };
};

export { NotificationProvider, useNotification };