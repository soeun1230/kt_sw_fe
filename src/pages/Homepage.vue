<script setup>
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import RegisterButton from "../components/RegisterButton.vue";

const router = useRouter();
</script>


<template>
  <div class="container">
    <div class="form-container">
      <img src="@/assets/mypetlogo.png" alt="My Pet Logo" class="logo" />
      <button class="login-btn" @click="() => router.push('/login')">로그인</button>
      <button class="register-btn" @click="() => router.push('/register')">회원가입</button>
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

/* 검은 여백 없애고 화면 전체를 채우는 컨테이너 */
.container {
  position: absolute; /* 화면 꽉 차게 */
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
}
/* 라벨 색상을 블랙으로 설정 */
.form-container label {
  color: black;
  font-size: 1.1rem;
}

/* 폼 컨테이너 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 90%;
  max-width: 500px;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.logo {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
  align-self: center;
}

/* 입력 필드 */
.input-field {
  width: 100%;
  padding: 14px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

.input-field:focus {
  border-color: #5733FF;
}

/* 버튼 스타일 */
.register-btn {
  background-color: #5733FF;
  color: white;
  border: none;
  padding: 16px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.register-btn:hover {
  background-color: #4529d3;
}

.login-btn {
  background-color: #5733FF;
  color: white;
  border: none;
  padding: 16px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.login-btn:hover {
  background-color: #4529d3;
}

.back-btn {
  background-color: white;
  color: black;
  border: 2px solid #ccc;
  padding: 16px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

/* 메시지 스타일 */
.message {
  color: #f44336;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 15px;
}
</style>
