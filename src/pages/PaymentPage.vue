<script setup>
import { ref, onMounted } from 'vue';
import NavBar from "@/components/NavBar.vue";
import PaymentTest from "@/components/PaymentTest.vue";
import api from "../axios.js";

const services = ref({
    paid: [],
});

const fetchServices = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`http://localhost:8080/api/users/payments/${userId}`);
        console.log('서비스 데이터:', response.data);

        if (response.data) {
            services.value = {  
                paid: response.data.message || []
            };
        }
    } catch (error) {
        console.error('서비스 데이터 가져오기 실패:', error);
    }
};

onMounted(fetchServices);
</script>

<template>
    <header class="page-header">
        <NavBar />
    </header>

    <div class="container">
        <h1 class="h1">결제 내역</h1>
        <div v-if="services.paid.length === 0" class="no-history">
            <p>결제 내역이 없습니다.</p>
        </div>
        <div class="payment-history" v-else>
            <div v-for="service in services.paid" :key="service.serviceId" class="payment-card">
                <h3 class="payment-date">📅 {{ service.date }}</h3>
                <p class="payment-cost">💰 결제 금액: <strong>{{ service.cost }}</strong>원</p>
                <p class="payment-sitter">🐶 펫 시터 아이디: <strong>{{ service.petSitterId }}</strong></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: absolute;
    left: 0;
    top: 60px; /* 헤더 높이만큼 띄우기 */
    width: 100vw;
    min-height: calc(100vh - 60px); /* 헤더 높이 제외 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
    padding: 40px;
}

.no-history {
    text-align: left;
    color: #666;
    font-size: 18px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-history {
    text-align: left;
    font-size: 18px;
    margin-top: 20px;
}

.payment-card {
    background: white;
    border-radius: 12px;
    padding: 15px;
    margin: 10px 0;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
}

.payment-date {
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
}

.payment-cost, .payment-sitter {
    font-size: 16px;
    color: #444;
    margin: 5px 0;
}

.h1 {
    color: #333;
    text-align: left;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>