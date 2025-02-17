<script setup>
import api from "../axios.js";
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LogoutButton from '../components/LoginButton.vue';
import NavBar from "@/components/NavBar.vue";

import PaymentTest from "@/components/PaymentTest.vue";

const router = useRouter();
const userCode = ref(localStorage.getItem('userCode'));

const menuCards = computed(() => {
    const baseMenus = [
        {
            title: '내 정보',
            path: '/user-detail',
            icon: '👤',
            color: '#FF9ECD'
        },
        {
            title: '반려동물 관리',
            path: '/my-pet',
            icon: '🐾',
            color: '#FFB992'
        }
    ];

    // 서비스 관련 메뉴 추가
    if (userCode.value === '0') {
        // 일반 사용자 메뉴
        baseMenus.push(
            {
                title: '서비스 신청',
                path: '/pet-sitter-service-register',
                icon: '✏️',
                color: '#94B9FF'
            },
            {
                title: '신청 내역',
                path: '/pet-sitter-service-for-user',
                icon: '📋',
                color: '#98E4FF'
            },
            {
                title: '펫시터 등록',
                path: '/pet-sitter-register',
                icon: '✨',
                color: '#B4FF9F'
            }
        );
    } else if (userCode.value === '1') {
        // 펫시터 메뉴
        baseMenus.push(
            {
                title: '펫시터 페이지',
                path: '/pet-sitter',
                icon: '🏠',
                color: '#FFD93D'
            },
            {
                title: '서비스 신청',
                path: '/pet-sitter-service-register',
                icon: '✏️',
                color: '#94B9FF'
            },
            {
                title: '신청 내역',
                path: '/pet-sitter-service-for-user',
                icon: '📋',
                color: '#98E4FF'
            },
            {
                title: '펫시터 예약 관리',
                path: '/pet-sitter-service-for-pet-sitter',
                icon: '💼',
                color: '#B4FF9F'
            }
        );
    }

    return baseMenus;
});
</script>

<template>
  <header class="page-header">
    <NavBar />
  </header>
  <div class="container">
    <div class="dashboard-content">
      <h1 class="welcome-text">환영합니다! 👋</h1>
      <div class="menu-grid">
        <div v-for="menu in menuCards" 
             :key="menu.path" 
             class="menu-card"
             :style="{ backgroundColor: menu.color }"
             @click="router.push(menu.path)">
          <div class="card-icon">{{ menu.icon }}</div>
          <h2 class="card-title">{{ menu.title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-content {
    width: 100%;
    max-width: 1200px;
    text-align: center;
}

.welcome-text {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 3rem;
    font-weight: 700;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 1rem;
}

.menu-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.menu-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.card-title {
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
}

@media (max-width: 768px) {
    .welcome-text {
        font-size: 2rem;
    }

    .menu-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .menu-card {
        padding: 1.5rem;
    }
}
</style>
