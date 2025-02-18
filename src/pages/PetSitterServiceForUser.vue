<script setup>
import { ref, onMounted } from 'vue';
import NavBar from "@/components/NavBar.vue";
import PaymentTest from "@/components/PaymentTest.vue";
import api from "../axios.js";

const services = ref({
    registered: [],
    notRegistered: [],
    denyRegistered: []
});

const fetchServices = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`http://localhost:8080/api/users/services/${userId}`);
        console.log('서비스 데이터:', response.data); // 데이터 확인용
        
        if (response.data) {
            services.value = {
                registered: response.data.registered || [],
                notRegistered: response.data.notRegistered || [],
                denyRegistered: response.data.denyRegistered || []
            };
        }
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};

// 결제 성공 후 상태 업데이트 함수
const updatePaymentStatus = async (serviceId) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/users/services/payment/${serviceId}`);
        if (response.data && response.data.message === 'pay') {
            alert('결제가 완료되었습니다.');
            await fetchServices(); // 목록 새로고침
        }
    } catch (error) {
        console.error('Payment status update failed:', error);
        alert('결제 상태 업데이트에 실패했습니다.');
    }
};

// 서비스 취소 함수 추가
const cancelService = async (serviceId) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/services/delete/${serviceId}`);
        if (response.data.message === 'deleted') {
            alert('서비스가 취소되었습니다.');
            await fetchServices(); // 목록 새로고침
        }
    } catch (error) {
        console.error('Error canceling service:', error);
        alert('서비스 취소에 실패했습니다.');
    }
};

// 서비스 삭제 함수 추가
const deleteService = async (serviceId) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/services/delete/${serviceId}`);
        if (response.data.message === 'deleted') {
            alert('서비스가 삭제되었습니다.');
            await fetchServices();
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('서비스 삭제에 실패했습니다.');
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
                <h1 class="welcome-text">나의 펫시터 서비스 예약</h1>
                <p class="sub-text">예약 현황을 확인해보세요</p>
            </div>

            <!-- 예약 대기 중인 서비스 -->
            <div class="service-section">
                <h2>대기 중인 예약</h2>
                <div class="service-grid" v-if="services.notRegistered.length > 0">
                    <div v-for="service in services.notRegistered" 
                         :key="service.serviceId" 
                         class="service-card">
                        <div class="service-info">
                            <p class="status pending">승인 대기 중</p>
                            <p class="date">예약 날짜: {{ service.date }}</p>
                            <p class="pet-type">반려동물: {{ service.petKind }}</p>
                            <p class="cost">비용: {{ service.cost }}원</p>
                            <button 
                                @click="cancelService(service.serviceId)"
                                class="cancel-btn"
                            >
                                예약 취소하기
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="no-service">대기 중인 예약이 없습니다.</p>
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
                            <div v-if="!service.payment" class="payment-section">
                                <PaymentTest 
                                    :amount="service.cost"
                                    @payment-success="updatePaymentStatus(service.serviceId)" 
                                />
                            </div>
                            <p v-else class="payment-complete">결제 완료</p>
                        </div>
                    </div>
                </div>
                <p v-else class="no-service">확정된 예약이 없습니다.</p>
            </div>

            <!-- 거절된 서비스 섹션 추가 -->
            <div class="service-section">
                <h2>거절된 예약</h2>
                <div class="service-grid" v-if="services.denyRegistered.length > 0">
                    <div v-for="service in services.denyRegistered" 
                         :key="service.serviceId" 
                         class="service-card">
                        <div class="service-info">
                            <div class="status-container">
                                <p class="status denied">예약 거절됨</p>
                                <button 
                                    @click="deleteService(service.serviceId)"
                                    class="delete-btn"
                                    title="서비스 삭제"
                                >
                                    ✕
                                </button>
                            </div>
                            <p class="date">예약 날짜: {{ service.date }}</p>
                            <p class="pet-type">반려동물: {{ service.petKind }}</p>
                            <p class="cost">비용: {{ service.cost }}원</p>
                        </div>
                    </div>
                </div>
                <p v-else class="no-service">거절된 예약이 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 헤더 스타일 추가 */


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

.status.denied {
    background: #ffebee;
    color: #d32f2f;
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

.payment-section {
    margin-top: 1rem;
}

.payment-complete {
    text-align: center;
    color: #4caf50;
    font-weight: 600;
    margin-top: 1rem;
    padding: 0.5rem;
    background: #e8f5e9;
    border-radius: 8px;
}

.cancel-btn {
    width: 100%;
    padding: 0.8rem;
    background: white;
    color: #ff4444;
    border: 1px solid #ff4444;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.cancel-btn:hover {
    background: #ff4444;
    color: white;
    transform: translateY(-2px);
}

.status-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    color: #ff4444;
    transform: scale(1.1);
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

    .status-container {
        flex-direction: row;
        align-items: center;
    }
    
    .delete-btn {
        padding: 0.5rem;
    }
}
</style>