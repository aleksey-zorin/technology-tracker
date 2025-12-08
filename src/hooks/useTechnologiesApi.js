// src/hooks/useTechnologiesApi.js
import { useState, useCallback } from 'react';

const useTechnologiesApi = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [popularTechnologies, setPopularTechnologies] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState(null);

  const searchTechnologies = useCallback(async (query) => {
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Заглушка для демонстрации
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Моковые данные
      const mockResults = [
        {
          id: 1,
          title: 'React',
          description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
          category: 'Frontend',
          difficulty: 'Средний',
          stars: 200000,
          language: 'JavaScript',
          topics: ['react', 'javascript', 'ui'],
          url: 'https://github.com/facebook/react'
        },
        {
          id: 2,
          title: 'Vue.js',
          description: 'Прогрессивный фреймворк для создания пользовательских интерфейсов',
          category: 'Frontend',
          difficulty: 'Средний',
          stars: 180000,
          language: 'JavaScript',
          topics: ['vue', 'javascript', 'framework'],
          url: 'https://github.com/vuejs/vue'
        },
        {
          id: 3,
          title: 'Node.js',
          description: 'Среда выполнения JavaScript на стороне сервера',
          category: 'Backend',
          difficulty: 'Продвинутый',
          stars: 95000,
          language: 'JavaScript',
          topics: ['nodejs', 'javascript', 'backend'],
          url: 'https://github.com/nodejs/node'
        }
      ];
      
      setSearchResults(mockResults.filter(tech => 
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      setSearchError('Ошибка при поиске технологий');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const loadPopularTechnologies = useCallback(async () => {
    setIsLoadingPopular(true);
    setPopularError(null);
    
    try {
      // Заглушка для демонстрации
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Моковые данные
      const mockPopular = [
        {
          id: 1,
          title: 'React',
          description: 'Библиотека для создания пользовательских интерфейсов',
          category: 'Frontend',
          stars: 200000,
          language: 'JavaScript'
        },
        {
          id: 2,
          title: 'TypeScript',
          description: 'Типизированное надмножество JavaScript',
          category: 'Language',
          stars: 88000,
          language: 'TypeScript'
        },
        {
          id: 3,
          title: 'Next.js',
          description: 'React фреймворк для production',
          category: 'Fullstack',
          stars: 110000,
          language: 'JavaScript'
        },
        {
          id: 4,
          title: 'Tailwind CSS',
          description: 'CSS фреймворк для быстрой разработки',
          category: 'CSS',
          stars: 68000,
          language: 'CSS'
        }
      ];
      
      setPopularTechnologies(mockPopular);
    } catch (error) {
      setPopularError('Ошибка при загрузке популярных технологий');
      console.error(error);
    } finally {
      setIsLoadingPopular(false);
    }
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    popularTechnologies,
    isLoadingPopular,
    popularError,
    searchTechnologies,
    loadPopularTechnologies,
    clearSearchResults,
    searchStats: {
      total: searchResults.length,
      byCategory: {},
      byLanguage: {}
    }
  };
};

export default useTechnologiesApi;