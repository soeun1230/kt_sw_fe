<script setup>
import api from "../axios.js";
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LogoutButton from '../components/LoginButton.vue';
import NavBar from "@/components/NavBar.vue";

const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");
const userPhone = localStorage.getItem("userPhone");
const message = ref("");

const password = ref("");
const phone = ref("");
const name = ref("");
const userId = localStorage.getItem("userId");


const router = useRouter();

const modalType = ref("");
const modalValue = computed({
  get() {
    if (modalType.value === 'name') {
      return name.value;
    } else if (modalType.value === 'phone') {
      return phone.value;
    } else if (modalType.value === 'password') {
      return password.value;
    }
    return ''; // Default if no valid modalType is set
  },
  set(value) {
    if (modalType.value === 'name') {
      name.value = value;
    } else if (modalType.value === 'phone') {
      phone.value = value;
    } else if (modalType.value === 'password') {
      password.value = value;
    }
  }
});

const userWithdraw = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await api.patch(`http://localhost:8080/api/users/${userId}`, { userId });

    message.value = response.data.message;
    alert(response.data.message);
    await router.push({ path: '/' });
  } catch (error) {
    message.value = "회원 탈퇴 실패: " + (error.response?.data?.message || error.message);
  }
};

const updateUserInfo = async (type) => {
  try {
    const userUpdateDto = {
      userId: type === "userId" ? Number(userId.value) : Number(userId),
      userName: type === 'name' ? name.value : null,
      userPhone: type === 'phone' ? phone.value : null,
      password: type === 'password' ? password.value : null,
    };

    if (userUpdateDto.userName !== null && userUpdateDto.userName !== undefined && userUpdateDto.userName !== "") {
      localStorage.setItem("userName", userUpdateDto.userName);
      const response = await api.patch("http://localhost:8080/api/users/update", userUpdateDto);
      message.value = response.data.message;
      location.reload();
    }
    if (userUpdateDto.userPhone !== null && userUpdateDto.userPhone !== undefined && userUpdateDto.userPhone !== "") {
      const response = await api.patch("http://localhost:8080/api/users/update", userUpdateDto);
      message.value = response.data.message;
      localStorage.setItem("userPhone", userUpdateDto.userPhone);
      location.reload();
    }
    if (userUpdateDto.password !== null && userUpdateDto.password !== undefined && userUpdateDto.password !== "") {
      const response = await api.patch("http://localhost:8080/api/users/update", userUpdateDto);
      message.value = response.data.message;
      localStorage.setItem("userPassword", userUpdateDto.password);
      location.reload();
    }
  } catch (error) {
    message.value = "업데이트 실패: " + (error.response?.data?.message || error.message);
  }
};
</script>

<template>
  <header class="page-header">
    <NavBar />
  </header>

  <div class="container">
    <div class="profile-card">
      <div class="user-info">
        <!-- Displaying user details -->
        <div class="user-details">
          <p class="user-info-item">이름: {{ userName }}</p>
          <p class="user-info-item">이메일: {{ userEmail }}</p>
          <p class="user-info-item">전화번호: {{ userPhone }}</p>
        </div>
      </div>

      <div class="user-edit">

        <!-- Name Update Section -->
        <div>
          <button @click="modalType = 'name'" class="update-btn">이름 수정</button>
        </div>
        <!-- Modal for Name Update -->
        <div v-if="modalType === 'name'" class="modal">
          <div class="modal-content">
            <h3 class="modal-content-2">새로운 이름을 입력하세요</h3>
            <input
                v-model="modalValue" type="text" placeholder="새 이름을 입력하세요" class="input-field"/>
            <button @click="updateUserInfo('name')" class="ok-btn">확인</button>
            <button @click="modalType = ''" class="cancel-btn">취소</button>
          </div>
        </div>


        <!-- Phone Update Section -->
        <div>
          <button @click="modalType = 'phone'" class="update-btn">전화번호 수정</button>
        </div>
        <div v-if="modalType === 'phone'" class="modal">
          <div class="modal-content">
            <h3 class="modal-content-2">새로운 번호를 입력하세요</h3>
            <input
                v-model="modalValue" type="text" placeholder="새 이름을 입력하세요" class="input-field"/>
            <button @click="updateUserInfo('phone')" class="ok-btn">확인</button>
            <button @click="modalType = ''" class="cancel-btn">취소</button>
          </div>
        </div>


        <!-- Password Update Section -->
        <div>
          <button @click="modalType = 'password'" class="update-btn">비밀번호 수정</button>
        </div>
        <div v-if="modalType === 'password'" class="modal">
          <div class="modal-content">
            <h3 class="modal-content-2">새로운 패스워드를 입력하세요</h3>
            <input
                v-model="modalValue" type="text" placeholder="새 이름을 입력하세요" class="input-field"/>
            <button @click="updateUserInfo('password')" class="ok-btn">확인</button>
            <button @click="modalType = ''" class="cancel-btn">취소</button>
          </div>
        </div>
      </div>


        <!-- Account Withdrawal Section -->
        <div class="withdrawal-section">
          <button @click="userWithdraw" class="withdraw-btn">회원 탈퇴</button>
        </div>
      </div>
    </div>
</template>

<style scoped>
html, body, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 헤더 스타일 */
.page-header {
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 네비바 높이 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 다른 요소 위에 표시 */
  display: flex;
  align-items: center;
  padding: 0 20px;
}

/* 배경 스타일만 Homepage와 통일 */
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
  padding-top: 60px;
}

/* 폼 스타일만 Homepage와 통일 */
.profile-card {
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* 수정된 user-info와 user-edit 컨테이너 */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;  /* 간격 늘림 */
  width: 100%;
  margin-bottom: 2rem;  /* 하단 여백 추가 */
}

.user-details, .user-edit {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 2rem;  /* 패딩 늘림 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.user-info-item {
  font-size: 1.1rem; /* 글씨 크기 조정 */
  color: #333; /* 검정색 글씨 */
  margin-bottom: 10px; /* 항목 사이 여백 */
}

.user-details p:last-child {
  margin-bottom: 0; /* 마지막 항목에 여백 없애기 */
}

/* 라벨 색상 */
.form-container label {
  color: black;
  font-size: 1.1rem;
}

.input-field {
  margin: 1.5rem 0;
  padding: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #5733FF;
  box-shadow: 0 0 0 2px rgba(87, 51, 255, 0.1);
  outline: none;
}

.update-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  color: black;
  border-radius: 8px;
  cursor: pointer;
  border: 0.5px solid ;
  width: 100%;
}

.update-btn:hover {
  background-color: #5733FF;
  color: white;
}

.withdraw-btn {
  margin-top: 20px;
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}

.withdraw-btn:hover {
  background-color: #e53935;
}

/* Modal styles */
.modal {
  position: absolute;  /* fixed에서 absolute로 변경 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);  /* 정중앙 배치 */
  width: 90%;
  max-width: 400px;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 24px;
  width: 100%;  /* 90%에서 100%로 변경 */
  box-shadow: 0 10px 30px rgba(87, 51, 255, 0.2);
}

.modal-content-2 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.ok-btn, .cancel-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ok-btn {
  background-color: #5733FF;
  color: white;
}

.ok-btn:hover {
  background-color: #4529d3;
  transform: translateY(-2px);
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}
</style>