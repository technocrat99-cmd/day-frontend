// src/api/http.js
import axios from 'axios'

const isDev = import.meta.env.DEV

// 1. 统一 baseURL + timeout
const http = axios.create({
  baseURL: isDev
    ? '/api'                           // 开发环境：走 Vite 代理
    : 'https://your-domain.com/api',   // 生产环境：改成你自己的 HTTPS 域名
  timeout: 3000,                       // 通用请求 3s 超时
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. 请求拦截：除了登录/验证码，其余请求都自动带 token
http.interceptors.request.use((config) => {
  const noAuthPaths = ['/login', '/login/captcha']  // 登录 & 验证码不带 token
  const url = config.url || ''

  if (!noAuthPaths.includes(url)) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

// 3. 响应拦截：按规范处理 { code, msg, data }，顺便把错误码挂到 Error 上
http.interceptors.response.use(
  (res) => {
    const resp = res.data

    // 后端按规范返回 { code, msg, data }
    if (resp && typeof resp === 'object' && 'code' in resp) {
      // 成功：code === 0 或 'OK'
      if (resp.code === 0 || resp.code === 'OK') {
        return res
      }

      // 业务错误：抛出带 code 的 Error，前端可以用 code 做本地化/分类
      const err = new Error(resp.msg || '请求失败')
      err.code = resp.code           // 比如 AUTH_401、AUTH_403、USER_4001 ...
      err.data = resp.data
      throw err
    }

    // 非规范返回（比如某些旧接口），直接放行
    return res
  },
  (error) => {
    // 网络层/HTTP 层错误（4xx/5xx）
    if (error.response) {
      const { status, data } = error.response
      const err = new Error(data?.msg || error.message || '请求失败')
      err.code = data?.code || `HTTP_${status}`  // 比如 HTTP_500 / HTTP_404
      err.data = data?.data
      return Promise.reject(err)
    }

    // 没有响应（超时 / 断网等）
    if (error.code === 'ECONNABORTED') {
      const err = new Error('请求超时，请稍后重试')
      err.code = 'NET_TIMEOUT'
      return Promise.reject(err)
    }

    return Promise.reject(error)
  }
)

/**
 * 4. 规范中的几个通用 API 封装
 */

// 登录：POST /api/login，超时 1s
export function loginApi(payload) {
  return http.post('/login', payload, { timeout: 1000 })
}

// 登出：POST /api/logout
export function logoutApi() {
  return http.post('/logout')
}

// 查询会话：GET /api/session
export function getSessionApi() {
  return http.get('/session')
}

export default http
