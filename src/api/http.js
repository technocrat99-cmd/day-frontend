import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // 根据后端习惯可再细化
    const msg = err?.response?.data?.message || err.message || '请求失败';
    return Promise.reject(new Error(msg));
  }
);

export default http;
