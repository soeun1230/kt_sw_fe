<script setup>
import api from "../axios.js"
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { handleLogout } from '../axios.js';

function logout() {
  handleLogout();
}

const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");
const message = ref("");
const router = useRouter();

const goToUserDetail = () => {
  router.push('/user-detail'); // 마이펫 페이지로 이동
};

const goToMyPet = () => {
  router.push('/my-pet');
}

const goToDashboard = () => {
  router.push('/dashboard');
}

</script>

<template>
  <nav class="navbar">
    <!-- 왼쪽: 프로필 이미지 & 유저 정보 -->
    <div class="user-profile" @click="goToUserDetail">
      <img src="@/assets/mypetlogo.png" alt="프로필" class="profile-img" />
      <div class="user-info">
        <h3>{{ userName }}</h3>
        <p>{{ userEmail }}</p>
      </div>
    </div>

    <div class="nav-menu">
      <span class="menu-item" @click="goToDashboard">메인</span>
      <span class="menu-item" @click="goToMyPet">마이펫</span>
    </div>

    <!-- 오른쪽: 로그아웃 & 회원탈퇴 버튼 -->
    <div class="buttons">
      <button class="logout-btn" @click="logout"> 로그아웃 </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.user-info p {
  font-size: 0.9rem;
  color: #777;
  margin: 0;
}

/* 중앙: 메뉴 */
.nav-menu {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.menu-item {
  font-size: 0.8rem;
  color: #4a4a4a; /* 은은한 회색 */
  cursor: pointer;
  font-weight: bold;
  padding: 12px 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

.menu-item:hover {
  color: #5733FF;/* 주황색 */
  transform: scale(1.1); /* 살짝 확대 */
}


.logout-btn {
  background-color: #5733FF;
  color: white;
  border: none;
  padding: 10px;
  font-size: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn:hover {
  background-color: #4529d3;
}
</style>