<script setup>
  import { RouterView } from 'vue-router';
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>


<style>
/* 전역 레이아웃 스타일 */
.page-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    background: white;
}

.container {
    position: absolute;
    left: 0;
    top: 60px;
    width: 100vw;
    min-height: calc(100vh - 60px);
    background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
    padding: 40px;
}

/* NavBar 스타일 */
.navbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 0 40px;  /* 좌우 패딩 추가 */
}

/* NavBar 내부 아이템 스타일 */
.navbar .nav-items {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 100%;  /* 전체 너비 사용 */
}

.navbar .logo {
    flex-shrink: 0;  /* 로고 크기 유지 */
}
</style>
