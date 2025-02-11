<script setup>
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import RegisterButton from "../components/RegisterButton.vue";

const router = useRouter();
</script>

<template>
  <div>
    <h1>메인 페이지</h1>
    <div class="button-container">
      <LoginButton label="로그인" :onClick="() => router.push('/login')" />
      <RegisterButton label="회원가입" :onClick="() => router.push('/register')" />
    </div>
  </div>
</template>

<style scoped>
/* 전체 페이지 스타일 */
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
  margin-bottom: 40px;
  text-align: center;
}

/* 버튼 컨테이너 스타일 */
.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>