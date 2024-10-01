import axios from 'axios';

const hostName = window.location.hostname;

const api = axios.create({
    baseURL: `${hostName == "localhost" ? "http://localhost:3333" : import.meta.env.VITE_API_BASE_URL}`
});

export default api;