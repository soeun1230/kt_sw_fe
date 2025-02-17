<script setup>
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import RegisterButton from "../components/RegisterButton.vue";



const router = useRouter();
</script>


<template>
  <div class="container">
    <div class="form-container">
      <div class="logo-container">
        <img src="@/assets/mypetlogo.png" alt="My Pet Logo" class="logo" />
        <h1 class="welcome-text">반려동물과 함께하는 즐거운 시간</h1>
        <p class="sub-text">나의 소중한 반려동물을 등록하고 관리해보세요</p>
      </div>
      <div class="button-container">
        <button class="login-btn" @click="() => router.push('/login')">
          <span class="btn-text">로그인</span>
        </button>
        <button class="register-btn" @click="() => router.push('/register')">
          <span class="btn-text">회원가입</span>
        </button>
        <button class="manager-btn" @click="() => router.push('/manager')">
          <span class="btn-text">관리자 페이지</span>
        </button>
      </div>
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
  align-items: center;
  gap: 2rem;
  width: 90%;
  max-width: 500px;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.form-container:hover {
  transform: translateY(-5px);
}

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
}

.logo {
  width: 180px;
  height: auto;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
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
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.login-btn, .register-btn, .manager-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn {
  background: #5733FF;
  color: white;
}

.register-btn, .manager-btn {
  background: white;
  color: #5733FF;
  border: 2px solid #5733FF;
}

.login-btn:hover, .register-btn:hover, .manager-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(87, 51, 255, 0.2);
}

.login-btn:hover {
  background: #4529d3;
}

.register-btn:hover, .manager-btn:hover {
  background: #f8f9ff;
}

.btn-text {
  position: relative;
  z-index: 1;
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

/* 애니메이션 효과 */
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

.form-container {
  animation: fadeIn 0.8s ease-out;
}
</style>
