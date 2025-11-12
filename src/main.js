import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './style.css'; // 若不存在可删除此行

createApp(App).use(router).mount('#app');
