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

.profile-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  text-align: center;
}

.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw; /* 너비 100% */
  height: 100vh; /* 높이 100% */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  padding: 20px; /* 여백 추가 */
}

.profile-card {
  background: #fff;
  padding: 30px; /* 내용물에 여유를 주기 위한 패딩 */
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px; /* 카드 크기 조정 */
  width: 100%; /* 가로 100% */
  text-align: center;
}

/* 수정된 user-info와 user-edit 컨테이너 */
.user-info{
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}
.modal-content-2{
  color: black;
}
.user-details, .user-edit {
  background-color: #f9f9f9; /* 부드러운 배경색 */
  border: 1px solid #ddd; /* 부드러운 회색 테두리 */
  border-radius: 10px; /* 둥근 모서리 */
  padding: 20px; /* 내용과 테두리 사이의 여백 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
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
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.ok-btn {
  margin-top: 20px;
  padding: 10px;
  background-color: #539353;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.ok-btn:hover {
  background-color: green;
}
.cancel-btn {
  margin-top: 20px;
  padding: 10px;
  background-color: #d67f7f;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.cancel-btn:hover {
  background-color: #d67474;
}
</style>