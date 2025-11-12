import { createRouter, createWebHistory } from 'vue-router';

const Login = () => import('@/views/Login.vue');

const Home = {
  template: `
    <div style="padding:24px">
      <h2>首页</h2>
      <p>已登录用户：{{ user?.username || '未知' }}</p>
      <button @click="logout">退出登录</button>
    </div>
  `,
  setup() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    };
    return { user, logout };
  },
};

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 简单的路由守卫：没有 token 就跳登录
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token && to.path !== '/login') return next('/login');
  next();
});

export default router;
