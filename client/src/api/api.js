import axios from 'axios';

const isProduction = import.meta.env.PROD;

if (isProduction) {
  // В продакшене возвращаем заглушку, которая имитирует API, но не делает реальных запросов
  const mockApi = {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
    defaults: { baseURL: '' },
    interceptors: { request: { use: () => {} }, response: { use: () => {} } }
  };
  export default mockApi;
} else {
  // В разработке используем реальный axios
  const API = axios.create({ baseURL: 'http://localhost:5000/api' });
  export default API;
}