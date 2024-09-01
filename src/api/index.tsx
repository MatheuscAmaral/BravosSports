import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bravos-api.onrender.com/'
});

export default api;