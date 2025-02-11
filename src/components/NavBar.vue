<script setup>
import api from "../axios.js"
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LogoutButton from '../components/LoginButton.vue';
import { handleLogout } from '../axios.js';

function logout() {
  handleLogout();
}

const router = useRouter();
</script>

<template>
  <div>
    <LogoutButton label="로그아웃" :onClick="logout" />
  </div>
</template>

<style scoped>

</style>