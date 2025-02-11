<script setup>
import { ref } from 'vue';
import api from '../axios.js'
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import BackButton from "@/components/RegisterButton.vue";

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

    console.log("access ",response.data.access_token);
    console.log("ref ",response.data.refresh_token);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    message.value = "로그인 성공!";
    await router.push('/dashboard');
  } catch (error) {
    message.value = "로그인 실패: " + error.response?.data;
  }
};
</script>

<template>
  <div class="container">
    <h1 class="title">로그인</h1>
    <div class="form-container">
      <input v-model="email" placeholder="이메일" class="input-field" />
      <input v-model="password" type="password" placeholder="비밀번호" class="input-field" />
      <LoginButton label="로그인" :onClick="login" />
      <BackButton label="메인" :onClick="() => router.push('/')" />
    </div>
    <p class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
/* 로그인 페이지 전체 스타일 */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Arial', sans-serif;
}

/* 제목 스타일 */
.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

/* 폼 컨테이너 스타일 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 입력 필드 스타일 */
.input-field {
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #4CAF50;
}

/* 메시지 스타일 */
.message {
  color: #f44336;
  font-size: 1.1rem;
  text-align: center;
}

/* 작은 화면에 대한 반응형 디자인 */
@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  .input-field {
    font-size: 1rem;
  }
}
</style>
