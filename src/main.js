import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';


const app = createApp(App); //앱 인스턴스를 먼저 생성
app.use(router); //라우터 등록
app.use(createPinia()); //Pinia 상태관리 추가
app.mount('#app');
