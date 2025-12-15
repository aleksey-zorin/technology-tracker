import React, { createContext, useState, useContext, useMemo } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext({});

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <Tooltip title={mode === 'light' ? 'Тёмная тема' : 'Светлая тема'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size="large"
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => 
    mode === 'light' ? lightTheme : darkTheme,
    [mode]
  );

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    
    // Сохранение в localStorage
    localStorage.setItem('themeMode', mode === 'light' ? 'dark' : 'light');
  };

  // Восстановление темы из localStorage при загрузке
  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode);
    }
  }, []);

  const contextValue = {
    mode,
    toggleTheme,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export { ThemeProvider, ThemeToggleButton, useTheme };