<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="onSubmit">
      <h2>登录</h2>

      <div class="form-item">
        <label>用户名</label>
        <input
          v-model.trim="form.username"
          type="text"
          placeholder="请输入用户名"
          autocomplete="username"
          :disabled="loading"
          required
        />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
          :disabled="loading"
          required
        />
      </div>

      <div class="form-item row">
        <label class="row">
          <input type="checkbox" v-model="form.remember" :disabled="loading" />
          <span>记住我</span>
        </label>
        <a class="link" href="javascript:;" @click="quickFill" v-if="!loading">一键填充(演示)</a>
      </div>

      <button class="primary" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import http from '@/api/http';

const form = reactive({
  username: '',
  password: '',
  remember: true,
});

const loading = ref(false);
const errorMsg = ref('');

const onSubmit = async () => {
  errorMsg.value = '';
  if (!form.username || !form.password) {
    errorMsg.value = '请输入用户名和密码';
    return;
  }

  try {
    const { data } = await http.post('/auth/login', {
  username: form.username,
  password: form.password,
});

    // 期望后端返回 { token, user }
    const token = data?.token;
    const user = data?.user;

    if (!token) throw new Error('登录返回缺少 token');

    // 记住会话
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user || {}));

    // 简单跳转：无路由就刷新页面，有路由就 push 到主页
    // window.location.href = '/'; // 无路由方案
    // 有路由时：
    window.location.href = '/home';
  } catch (e) {
    errorMsg.value = e.message || '登录失败';
  } finally {
    loading.value = false;
  }
};

const quickFill = () => {
  form.username = 'admin';
  form.password = '123456';
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f5f6fa;
  padding: 24px;
}
.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 14px;
  padding: 24px 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
h2 {
  margin: 0 0 18px;
  font-weight: 700;
  text-align: center;
}
.form-item {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}
.form-item.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input[type="text"],
input[type="password"] {
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
}
input:disabled {
  background: #f3f3f3;
}
button.primary {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
button.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #e11d48;
  margin-top: 10px;
  text-align: center;
}
.link {
  color: #3b82f6;
  text-decoration: none;
  cursor: pointer;
}
</style>
