import axios from 'axios';

const isProduction = import.meta.env.PROD;

let API;

if (isProduction) {
  // Заглушка для продакшена (GitHub Pages)
  console.log('Using mock API');
  API = {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
    defaults: { baseURL: '' },
    interceptors: { request: { use: () => {} }, response: { use: () => {} } }
  };
} else {
  // Реальный API для разработки
  API = axios.create({ baseURL: 'http://localhost:5000/api' } );

  // Добавляем перехватчик для токена
  API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if ( token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default API;