<script setup>
import { ref } from 'vue';
import api from '../axios.js';
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import RegisterButton from '../components/RegisterButton.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const message = ref('');

const login = async () => {
  try {
    const response = await api.post('http://localhost:8080/api/auth/login', {
      email: email.value,
      password: password.value
    });

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('userName', response.data.name);
    localStorage.setItem('userEmail', response.data.email);
    localStorage.setItem('userPhone', response.data.phone);
    localStorage.setItem('userId', response.data.userId);

    message.value = "로그인 성공!";
    await router.push('/dashboard');
  } catch (error) {
    message.value = "로그인 실패: " + (error.response?.data || "서버 오류");
  }
};
</script>

<template>
  <div class="container">
    <div class="form-container">
<!--      <img src="@/assets/mypetlogo.png" alt="My Pet Logo" class="logo" />-->
      <label for="email">Email address</label>
      <input v-model="email" id="email" placeholder="이메일" class="input-field" />

      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" placeholder="비밀번호" class="input-field" />
      <button class="login-btn" @click="login" >로그인</button>
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

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
  align-self: center;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

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

label {
  font-size: 1rem;
  font-weight: bold;
  color: black;
}

.input-field {
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #5733FF
}

.message {
  color: #f44336;
  font-size: 1.1rem;
  text-align: center;
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
</style>
