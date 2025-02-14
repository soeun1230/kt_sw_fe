<script setup>
import api from "../axios.js";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LogoutButton from '../components/LoginButton.vue';
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
</script>

<template>
  <header class="page-header">
    <NavBar />
  </header>

  <div class="container">
    <!-- 페이지 컨텐츠 -->
  </div>
</template>

<style scoped>
/* 전체 화면 레이아웃 설정 */
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
</style>
