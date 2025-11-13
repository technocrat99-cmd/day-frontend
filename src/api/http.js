import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'                      // 开发环境：走 Vite 代理
    : 'http://localhost:8080/api' // 生产环境：你以后可以换成正式后端地址
})

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
