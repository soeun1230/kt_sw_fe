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
    localStorage.setItem('userCode', response.data.userCode);
    localStorage.setItem('petSitterId', response.data.petSitterId);


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
      <div class="logo-container">
        <img src="@/assets/mypetlogo.png" alt="My Pet Logo" class="logo" />
        <h1 class="welcome-text">다시 만나서 반가워요!</h1>
        <p class="sub-text">로그인하고 반려동물을 관리해보세요</p>
      </div>
      
      <div class="input-group">
        <label for="email">이메일</label>
        <input v-model="email" id="email" type="email" placeholder="이메일을 입력하세요" class="input-field" />
      </div>

      <div class="input-group">
        <label for="password">비밀번호</label>
        <input v-model="password" id="password" type="password" placeholder="비밀번호를 입력하세요" class="input-field" />
      </div>

      <div class="button-container">
        <button class="login-btn" @click="login">
          <span class="btn-text">로그인</span>
        </button>
        <button class="back-btn" @click="() => router.push('/')">
          <span class="btn-text">메인으로</span>
        </button>
      </div>
      
      <p v-if="message" :class="['message', message.includes('성공') ? 'success' : 'error']">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
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
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 90%;
  max-width: 500px;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.8s ease-out;
}

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.welcome-text {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.sub-text {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
}

.input-field {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #5733FF;
  box-shadow: 0 0 0 2px rgba(87, 51, 255, 0.1);
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.login-btn, .back-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn {
  background: #5733FF;
  color: white;
}

.back-btn {
  background: white;
  color: #5733FF;
  border: 2px solid #5733FF;
}

.login-btn:hover, .back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(87, 51, 255, 0.2);
}

.login-btn:hover {
  background: #4529d3;
}

.back-btn:hover {
  background: #f8f9ff;
}

.message {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.message.error {
  background: #fff3f3;
  color: #d32f2f;
}

.message.success {
  background: #f0fff4;
  color: #2e7d32;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 2rem;
  }

  .welcome-text {
    font-size: 1.5rem;
  }

  .sub-text {
    font-size: 0.9rem;
  }
}
</style>
