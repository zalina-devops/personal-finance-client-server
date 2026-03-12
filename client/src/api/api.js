import axios from 'axios';

const isProduction = import.meta.env.PROD;

let API;

if (isProduction) {
  console.log('Using mock API');
  API = {
    get: (url, config) => {
      console.log('Mock GET:', url, config);
      return Promise.resolve({ data: [] });
    },
    post: (url, data, config) => {
      console.log('Mock POST:', url, data, config);
      return Promise.resolve({ data: {} });
    },
    put: (url, data, config) => {
      console.log('Mock PUT:', url, data, config);
      return Promise.resolve({ data: {} });
    },
    delete: (url, config) => {
      console.log('Mock DELETE:', url, config);
      return Promise.resolve({ data: {} });
    },
    defaults: { baseURL: '' },
    interceptors: { request: { use: () => {} }, response: { use: () => {} } }
  };
} else {
  API = axios.create({ baseURL: 'http://192.168.0.55:5000/api' });
}

export default API;