import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.43.180:3300'
})

export default api;