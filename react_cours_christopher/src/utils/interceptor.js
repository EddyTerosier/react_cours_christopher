import axios from 'axios';

const myAxios = axios.create({
  baseURL: 'https://api.example.com',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    }
});

myAxios.interceptors.request.use(
  (config) => {
    // Add any request interceptors here
    // For example, adding an Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(
  (response) => {
    // Add any response interceptors here
    return response;
  },
  (error) => {
    // Handle any response errors here
    return Promise.reject(error);
  }
);

export default myAxios;