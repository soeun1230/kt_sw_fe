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
      <div class="logo-container">
        <img src="@/assets/mypetlogo.png" alt="My Pet Logo" class="logo" />
        <h1 class="welcome-text">환영합니다!</h1>
        <p class="sub-text">회원가입하고 반려동물과 함께하는 여정을 시작하세요</p>
      </div>
      
      <div class="input-group">
        <label for="email">이메일</label>
        <input v-model="email" id="email" type="email" placeholder="이메일을 입력하세요" class="input-field" />
      </div>

      <div class="input-group">
        <label for="name">이름</label>
        <input v-model="name" id="name" type="text" placeholder="이름을 입력하세요" class="input-field" />
      </div>

      <div class="input-group">
        <label for="password">비밀번호</label>
        <input v-model="password" id="password" type="password" placeholder="비밀번호를 입력하세요" class="input-field" />
      </div>

      <div class="input-group">
        <label for="phone">전화번호</label>
        <input v-model="phone" id="phone" type="tel" placeholder="전화번호를 입력하세요" class="input-field" />
      </div>

      <div class="button-container">
        <button class="register-btn" @click="register">
          <span class="btn-text">회원가입</span>
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
  gap: 1rem;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
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
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.welcome-text {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.sub-text {
  color: #666;
  font-size: 0.5rem;
  margin-bottom: 0.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-group label {
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
}

.input-field {
  width: 100%;
  padding: 0.8rem;
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
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.register-btn, .back-btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn {
  background: #5733FF;
  color: white;
}

.back-btn {
  background: white;
  color: #5733FF;
  border: 2px solid #5733FF;
}

.register-btn:hover, .back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(87, 51, 255, 0.2);
}

.register-btn:hover {
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
