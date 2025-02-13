<script setup>
import { ref } from 'vue';
import api from '../axios.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const phone = ref('');
const message = ref('');

const register = async () => {
  try {
    const response = await api.post('http://localhost:8080/api/auth/register', {
      email: email.value,
      password: password.value,
      name: name.value,
      phone: phone.value
    });
    message.value = response.data;
    router.push('/login');
  } catch (error) {
    message.value = error.response?.data || "회원가입 실패";
  }
};
</script>

<template>
  <div class="container">
    <div class="form-container">
      <label>Email address</label>
      <input v-model="email" type="email" class="input-field" />

      <label>Name</label>
      <input v-model="name" type="text" class="input-field" />

      <label>password</label>
      <input v-model="password" type="password" class="input-field" />

      <label>Phone Number</label>
      <input v-model="phone" type="tel" class="input-field" />

      <button class="register-btn" @click="register">회원 가입</button>
      <button class="back-btn" @click="() => router.push('/')">메인으로</button>
    </div>
    <p class="message">{{ message }}</p>
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
