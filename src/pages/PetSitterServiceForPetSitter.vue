<script setup>
import { ref, onMounted } from 'vue';
import NavBar from "@/components/NavBar.vue";
import api from "../axios.js";

const services = ref({
    registered: [],
    notRegistered: []
});

const fetchServices = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`http://localhost:8080/api/petsitters/services/${userId}`);
        services.value = response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};

// 예약 승인 함수 추가
const approveService = async (serviceId) => {
    try {
        const response = await api.get(`http://localhost:8080/api/petsitters/services/allow/${serviceId}`);
        
        if (response.data) {
            alert('예약이 승인되었습니다.');
            // 목록 새로고침
            await fetchServices();
        }
    } catch (error) {
        console.error('Error approving service:', error);
        alert('예약 승인에 실패했습니다.');
    }
};

// 예약 거절 함수 추가
const denyService = async (serviceId) => {
    try {
        const response = await api.get(`http://localhost:8080/api/petsitters/services/deny/${serviceId}`);
        if (response.data.message === 'updated') {
            alert('예약이 거절되었습니다.');
            await fetchServices();
        }
    } catch (error) {
        console.error('Error denying service:', error);
        alert('예약 거절에 실패했습니다.');
    }
};

onMounted(fetchServices);
</script>

<template>
    <header class="page-header">
        <NavBar />
    </header>

    <div class="container">
        <div class="form-container">
            <div class="logo-container">
                <h1 class="welcome-text">펫시터 서비스 예약 관리</h1>
                <p class="sub-text">예약 요청과 확정된 예약을 관리하세요</p>
            </div>

            <!-- 승인 대기 중인 서비스 -->
            <div class="service-section">
                <h2>승인 대기 중인 예약</h2>
                <div class="service-grid" v-if="services.notRegistered.length > 0">
                    <div v-for="service in services.notRegistered" 
                         :key="service.serviceId" 
                         class="service-card">
                        <div class="service-info">
                            <p class="status pending">승인 대기 중</p>
                            <p class="date">예약 날짜: {{ service.date }}</p>
                            <p class="pet-type">반려동물: {{ service.petKind }}</p>
                            <p class="cost">비용: {{ service.cost }}원</p>
                            <div class="button-group">
                                <button 
                                    @click="approveService(service.serviceId)"
                                    class="approve-btn"
                                >
                                    예약 승인하기
                                </button>
                                <button 
                                    @click="denyService(service.serviceId)"
                                    class="deny-btn"
                                >
                                    예약 거절하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="no-service">승인 대기 중인 예약이 없습니다.</p>
            </div>

            <!-- 확정된 서비스 -->
            <div class="service-section">
                <h2>확정된 예약</h2>
                <div class="service-grid" v-if="services.registered.length > 0">
                    <div v-for="service in services.registered" 
                         :key="service.serviceId" 
                         class="service-card">
                        <div class="service-info">
                            <p class="status confirmed">예약 확정</p>
                            <p class="date">예약 날짜: {{ service.date }}</p>
                            <p class="pet-type">반려동물: {{ service.petKind }}</p>
                            <p class="cost">비용: {{ service.cost }}원</p>
                            <div v-if="service.payment" class="payment-section">
                                <p class="payment-complete">결제 완료된 예약입니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="no-service">확정된 예약이 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>


/* container 위치 조정 */
.container {
    position: absolute;
    left: 0;
    top: 60px; /* 헤더 높이만큼 띄우기 */
    width: 100vw;
    min-height: calc(100vh - 60px); /* 헤더 높이 제외 */
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
    padding: 40px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 90%;
    max-width: 1200px;
    padding: 3rem;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;
}

.logo-container {
    text-align: center;
    margin-bottom: 1rem;
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

.service-section {
    width: 100%;
    margin-bottom: 2rem;
}

.service-section h2 {
    color: #333;
    font-size: 1.4rem;
    margin-bottom: 1rem;
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.service-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(87, 51, 255, 0.1);
    transition: transform 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.status {
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-align: center;
}

.status.pending {
    background: #fff3e0;
    color: #ff9800;
}

.status.confirmed {
    background: #e8f5e9;
    color: #4caf50;
}

.date, .pet-type {
    color: #666;
}

.cost {
    color: #5733FF;
    font-weight: 600;
    font-size: 1.1rem;
}

.no-service {
    text-align: center;
    color: #666;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 12px;
}

@media (max-width: 768px) {
    .form-container {
        padding: 2rem;
    }

    .welcome-text {
        font-size: 1.5rem;
    }

    .service-grid {
        grid-template-columns: 1fr;
    }
}

.payment-complete {
    text-align: center;
    color: white;
    font-weight: 600;
    margin-top: 1rem;
    padding: 0.5rem;
    background: #dd4b4b;
    border-radius: 8px;
}

/* 승인 버튼 추가 스타일 */
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.approve-btn, .deny-btn {
    flex: 1;
    padding: 0.8rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.approve-btn {
    background: #5733FF;
    color: white;
    border: none;
}

.approve-btn:hover {
    background: #4529d3;
    transform: translateY(-2px);
}

.deny-btn {
    background: white;
    color: #ff4444;
    border: 1px solid #ff4444;
}

.deny-btn:hover {
    background: #ff4444;
    color: white;
    transform: translateY(-2px);
}
</style>
