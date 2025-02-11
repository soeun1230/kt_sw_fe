import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import DashBoard from "@/pages/DashBoard.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/dashboard', component: DashBoard, meta: {requiresAuth: true} },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const accessToken = localStorage.getItem('access_token');
    console.log(accessToken);

    if (to.meta.requiresAuth && !accessToken) {
        next('/login'); // 로그아웃 후 대시보드 접근 시 로그인 페이지로 이동
    } else {
        next();
    }
});

export default router;


