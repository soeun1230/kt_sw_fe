<script setup>
import api from "../axios.js"
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { handleLogout } from '../axios.js';

function logout() {
  handleLogout();
}

const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");
const userCode = ref(localStorage.getItem("userCode"));
const message = ref("");
const router = useRouter();

// 사용자 코드 가져오기
const fetchUserCode = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await api.get(`http://localhost:8080/api/users/code/${userId}`);
    localStorage.setItem('userCode', response.data.userCode); // 응답으로 받은 userCode를 localStorage에 저장
  } catch (error) {
    console.error("사용자 코드 조회 실패:", error);
  }
};

const goToUserDetail = () => {
  router.push('/user-detail'); // 마이펫 페이지로 이동
};

const goToMyPet = () => {
  router.push('/my-pet');
}

const goToDashboard = () => {
  router.push('/dashboard');
}

const goToPetSitterRegister = () => {
  router.push('/pet-sitter-register');
}

const goToPetSitterPage = () => {
  router.push('/pet-sitter'); // 펫시터 페이지로 이동
}

const goToPetSitterServiceRegister = () => {
  router.push('/pet-sitter-service-register');
}

const goToPetSitterServiceForUser = () => {
  router.push('/pet-sitter-service-for-user');
}

const goToPetSitterServiceForPetSitter = () => {
  router.push('/pet-sitter-service-for-pet-sitter');
}

onMounted(fetchUserCode);

// userCode가 변경될 때마다 업데이트
onMounted(() => {
    userCode.value = localStorage.getItem('userCode');
});
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
      <span class="menu-item" @click="goToPetSitterServiceRegister">펫시터 서비스 신청</span>
      <span class="menu-item" @click="goToPetSitterServiceForUser">펫시터 서비스 신청 목록</span>

      <!-- userCode에 따라 다른 버튼 표시 -->
      <span v-if="userCode === '0'" class="menu-item" @click="goToPetSitterRegister">펫시터 등록</span>
      <span v-else-if="userCode === '1'" class="menu-item" @click="goToPetSitterPage">펫시터 페이지</span>

      <!-- 펫시터인 경우에만 보이는 메뉴 -->
      <span v-if="userCode === '1'" class="menu-item" @click="goToPetSitterServiceForPetSitter">펫시터 예약 관리</span>
    </div>

    <!-- 오른쪽: 로그아웃 버튼 -->
    <div class="buttons">
      <button class="logout-btn" @click="logout">로그아웃</button>
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