import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  AccessTime,
  TrendingUp,
  CalendarToday,
  Star,
  Warning,
} from '@mui/icons-material';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`dashboard-tabpanel-${index}`}
    aria-labelledby={`dashboard-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>{children}</Box>}
  </div>
);

const Dashboard = ({ technologies, onTechClick }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Статистика
  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length,
    onHold: technologies.filter(t => t.status === 'on-hold').length,
  };

  // Расчет общего прогресса
  const overallProgress = technologies.length > 0 
    ? technologies.reduce((sum, tech) => sum + (tech.progress || 0), 0) / technologies.length
    : 0;

  // Категории распределения
  const categories = [...new Set(technologies.map(t => t.category))];
  const categoryStats = categories.map(category => ({
    name: category,
    count: technologies.filter(t => t.category === category).length,
    progress: technologies
      .filter(t => t.category === category)
      .reduce((sum, tech) => sum + (tech.progress || 0), 0) / 
      Math.max(technologies.filter(t => t.category === category).length, 1),
  }));

  // Предстоящие дедлайны
  const upcomingDeadlines = technologies
    .filter(t => t.deadline && t.status !== 'completed')
    .map(t => ({
      ...t,
      daysLeft: Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
    }))
    .filter(t => t.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  // Недавние активности
  const recentActivities = technologies
    .filter(t => t.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: 'white',
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      {/* Шапка дашборда */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📊 Панель управления
          </Typography>
          
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Основное содержимое */}
      <Paper sx={{ borderRadius: 0 }}>
        {/* Табы */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Обзор" />
          <Tab label="Статистика" />
          <Tab label="Категории" />
          <Tab label="Активность" />
        </Tabs>

        {/* Вкладка обзора */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Статистические карточки */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Всего технологий"
                value={stats.total}
                icon={<TrendingUp />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Завершено"
                value={stats.completed}
                icon={<CheckCircle />}
                color="success"
                subtitle={`${stats.completed > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="В процессе"
                value={stats.inProgress}
                icon={<PlayCircle />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="На паузе"
                value={stats.onHold}
                icon={<PauseCircle />}
                color="info"
              />
            </Grid>

            {/* Общий прогресс */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Общий прогресс изучения
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          bgcolor: 'grey.100',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                      {overallProgress.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Средний прогресс по всем технологиям
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Предстоящие дедлайны */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" /> Ближайшие дедлайны
                  </Typography>
                  
                  {upcomingDeadlines.length > 0 ? (
                    <List dense>
                      {upcomingDeadlines.map((tech, index) => (
                        <React.Fragment key={tech.id}>
                          <ListItem 
                            button
                            onClick={() => onTechClick && onTechClick(tech)}
                            sx={{ 
                              borderRadius: 1,
                              mb: index < upcomingDeadlines.length - 1 ? 1 : 0,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {tech.title.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={tech.title}
                              secondary={
                                <React.Fragment>
                                  <Typography variant="body2" component="span">
                                    {new Date(tech.deadline).toLocaleDateString('ru-RU')}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    component="span" 
                                    sx={{ 
                                      ml: 1,
                                      color: tech.daysLeft <= 3 ? 'error.main' : 
                                             tech.daysLeft <= 7 ? 'warning.main' : 'success.main',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {tech.daysLeft === 0 ? 'Сегодня' : 
                                     tech.daysLeft === 1 ? 'Завтра' : 
                                     `через ${tech.daysLeft} дней`}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          {index < upcomingDeadlines.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <AccessTime sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary">
                        Нет предстоящих дедлайнов
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Последние активности */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star fontSize="small" /> Последние обновления
                  </Typography>
                  
                  {recentActivities.length > 0 ? (
                    <List dense>
                      {recentActivities.map((tech, index) => (
                        <React.Fragment key={tech.id}>
                          <ListItem
                            button
                            onClick={() => onTechClick && onTechClick(tech)}
                            sx={{ 
                              borderRadius: 1,
                              mb: index < recentActivities.length - 1 ? 1 : 0,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              }
                            }}
                          >
                            <ListItemIcon>
                              {tech.status === 'completed' ? (
                                <CheckCircle color="success" />
                              ) : tech.status === 'in-progress' ? (
                                <PlayCircle color="primary" />
                              ) : tech.status === 'on-hold' ? (
                                <PauseCircle color="warning" />
                              ) : (
                                <PauseCircle color="disabled" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={tech.title}
                              secondary={
                                <React.Fragment>
                                  <Typography variant="body2" component="span">
                                    Обновлено: {new Date(tech.updatedAt).toLocaleDateString('ru-RU')}
                                  </Typography>
                                  <Chip
                                    label={tech.status === 'completed' ? 'Завершено' : 
                                           tech.status === 'in-progress' ? 'В процессе' : 
                                           tech.status === 'on-hold' ? 'На паузе' : 'Не начато'}
                                    size="small"
                                    sx={{ ml: 1 }}
                                    color={tech.status === 'completed' ? 'success' : 
                                           tech.status === 'in-progress' ? 'primary' : 
                                           tech.status === 'on-hold' ? 'warning' : 'default'}
                                  />
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          {index < recentActivities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography color="text.secondary">
                        Нет недавней активности
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Вкладка статистики */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Распределение по статусам
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {[
                      { status: 'completed', label: 'Завершено', color: 'success' },
                      { status: 'in-progress', label: 'В процессе', color: 'primary' },
                      { status: 'on-hold', label: 'На паузе', color: 'warning' },
                      { status: 'not-started', label: 'Не начато', color: 'default' },
                    ].map(({ status, label, color }) => {
                      const count = stats[status] || 0;
                      const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      
                      return (
                        <Grid item xs={12} key={status}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                {label}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {count} ({percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={color}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Вкладка категорий */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {categoryStats.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.name}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Количество: {category.count}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={category.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Средний прогресс: {category.progress.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        // Фильтрация по категории
                        console.log(`Filter by ${category.name}`);
                      }}
                    >
                      Показать все
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Вкладка активности */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                История активности
              </Typography>
              <Typography color="text.secondary">
                Здесь будет отображаться подробная история изменений статусов, прогресса и других действий.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Dashboard;