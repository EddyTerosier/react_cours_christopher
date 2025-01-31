import axios from 'axios';
import Cookies from 'js-cookie';

const myAxios = axios.create({
    // baseURL: 'http://reactnativeaws-env.eba-5bsvutew.eu-north-1.elasticbeanstalk.com',
    baseURL: 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    },
});

myAxios.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

myAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove('token');
        }
        return Promise.reject(error);
    }
);

export default myAxios;