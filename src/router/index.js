import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import DashBoard from "@/pages/DashBoard.vue";
import UserDetail from "@/pages/UserDetail.vue";
import MyPet from "@/pages/MyPet.vue";
import PetSitterRegister from '@/pages/PetSitterRegister.vue';
import PetSitter from '@/pages/PetSitter.vue';
import PetSitterServiceRegister from '@/pages/PetSitterServiceRegister.vue';
import PetSitterServiceForUser from '@/pages/PetSitterServiceForUser.vue';
import ManagerPage from '@/pages/ManagerPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/dashboard', component: DashBoard, meta: {requiresAuth: true} },
    { path: '/user-detail', component: UserDetail, meta: {requiresAuth: true} },
    { path: '/my-pet', component: MyPet, meta: {requiresAuth: true} },
    { path: '/pet-sitter-register', component: PetSitterRegister, meta: {requiresAuth: true} },
    { path: '/pet-sitter', component: PetSitter, meta: {requiresAuth: true} },
    { path: '/pet-sitter-service-register', component: PetSitterServiceRegister, meta: {requiresAuth: true} },
    { path: '/pet-sitter-service-for-user', component: PetSitterServiceForUser, meta: {requiresAuth: true} },
    { path: '/manager', component: ManagerPage },
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


