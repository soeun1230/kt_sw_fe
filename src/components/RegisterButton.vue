<script setup>
//import { defineProps } from 'vue';

const props = defineProps({
  label: String,   // 버튼에 표시될 텍스트
  to: String,      // 이동할 경로
  onClick: Function // 클릭 시 실행할 함수
});
</script>

<template>
  <button @click="onClick" class="btn">
    {{ label }}
  </button>
</template>

<style scoped>
.btn {
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  background-color: #4c7eaf;
}

/* 버튼 호버 효과 */
.btn:hover {
  background-color: #71b7d9;
  transform: translateY(-3px);
}

/* 버튼 클릭 효과 */
.btn:active {
  transform: translateY(0);
}

/* 작은 화면에 대해 버튼 크기 조정 */
@media (max-width: 600px) {
  .btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>
