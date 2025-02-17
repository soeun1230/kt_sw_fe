<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted, computed } from 'vue';
import api from "../axios.js";

const petSitters = ref([]);
const selectedSitter = ref(null);
const showModal = ref(false);
const message = ref('');

const serviceRequest = ref({
    userId: localStorage.getItem('userId'),
    petSitterId: null,
    date: '',
    petKind: '',
    cost: null,
    status: 0,
    hours: 1  // 시간 입력 필드 추가
});

const calculateTotalCost = computed(() => {
    if (!selectedSitter.value || !serviceRequest.value.hours) return 0;
    return selectedSitter.value.costPerHour * serviceRequest.value.hours;
});

// base64 변환 함수
const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    try {
        if (typeof buffer === 'string') return buffer;
        if (Array.isArray(buffer)) {
            return btoa(String.fromCharCode.apply(null, buffer));
        }
        return '';
    } catch (e) {
        console.error('Base64 변환 에러:', e);
        return '';
    }
};

const fetchPetSitters = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await api.get(`http://localhost:8080/api/users/petsitters/all/${userId}`);
        console.log('Fetched sitters:', response.data); // 데이터 확인용 로그
        petSitters.value = response.data.sitters;
    } catch (error) {
        console.error('Error fetching pet sitters:', error);
        message.value = "펫시터 목록을 불러오는데 실패했습니다.";
    }
};

const openSitterDetail = (sitter) => {
    console.log('Selected sitter:', sitter);
    console.log('Possible pets:', sitter.possiblePet);
    selectedSitter.value = sitter;
    showModal.value = true;
    
    serviceRequest.value = {
        userId: localStorage.getItem('userId'),
        petSitterId: sitter.userId,
        date: '',
        petKind: '',
        cost: sitter.costPerHour,
        status: 0,
        hours: 1
    };
};

const submitServiceRequest = async (sitter) => {
    try {
        serviceRequest.value.petSitterId = sitter.userId;
        serviceRequest.value.cost = calculateTotalCost.value;  // 계산된 총 비용 설정

        const response = await api.post('http://localhost:8080/api/users/services', serviceRequest.value);
        
        if (response.data.message === 'added') {
            alert('서비스 신청이 완료되었습니다.');
            showModal.value = false;
            serviceRequest.value = {  // 폼 초기화
                userId: localStorage.getItem('userId'),
                petSitterId: null,
                date: '',
                petKind: '',
                cost: null,
                status: 0,
                hours: 1
            };
        }
    } catch (error) {
        console.error('Error submitting service request:', error);
        alert('서비스 신청에 실패했습니다.');
    }
};

onMounted(fetchPetSitters);
</script>

<template>
    <header class="page-header">
        <NavBar />
    </header>

    <div class="container">
        <div class="content-wrapper">
            <h1>펫시터 목록</h1>
            
            <div class="sitter-grid">
                <div v-for="sitter in petSitters" 
                     :key="sitter.petSitterId" 
                     class="sitter-card"
                     @click="openSitterDetail(sitter)">
                    <div class="sitter-image">
                        <img :src="`data:image/jpeg;base64,${arrayBufferToBase64(sitter.sitterImage)}`" 
                             alt="펫시터 프로필" />
                    </div>
                    <div class="sitter-info">
                        <h3>{{ sitter.service }} 전문</h3>
                        <p>{{ sitter.address.split(' ')[0] }} {{ sitter.address.split(' ')[1] }}</p>
                    </div>
                </div>
            </div>

            <!-- 펫시터 상세 정보 모달 -->
            <div v-if="showModal" class="modal-overlay" @click="showModal = false">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h2>펫시터 상세 정보</h2>
                        <button class="close-btn" @click="showModal = false">×</button>
                    </div>
                    
                    <div v-if="selectedSitter" class="modal-body">
                        <div class="sitter-profile">
                            <img :src="`data:image/jpeg;base64,${arrayBufferToBase64(selectedSitter.sitterImage)}`" 
                                 alt="펫시터 프로필" />
                            <div class="profile-info">
                                <p class="service-type">{{ selectedSitter.service }} 전문</p>
                                <p class="address">{{ selectedSitter.address }}</p>
                                <p class="cost">시간당 {{ selectedSitter.costPerHour.toLocaleString() }}원</p>
                            </div>
                        </div>

                        <div class="detail-section">
                            <div class="detail-item">
                                <h4>돌봄 가능 동물</h4>
                                <div class="pet-tags">
                                    <span v-for="pet in selectedSitter.possiblePet" 
                                          :key="pet" 
                                          class="pet-tag">
                                        {{ pet }}
                                    </span>
                                </div>
                            </div>

                            <div class="detail-item">
                                <h4>돌봄 가능 크기</h4>
                                <p>{{ selectedSitter.possibleSize }}</p>
                            </div>

                            <div class="detail-item">
                                <h4>활동 가능 시간</h4>
                                <p>{{ selectedSitter.possibleTime }}</p>
                            </div>

                            <div class="detail-item">
                                <h4>자기소개</h4>
                                <p>{{ selectedSitter.info }}</p>
                            </div>

                            <div class="detail-item" v-if="selectedSitter.workExp">
                                <h4>경력사항</h4>
                                <p>{{ selectedSitter.workExp }}</p>
                            </div>
                        </div>

                        <!-- 서비스 신청 폼 추가 -->
                        <div class="service-request-form">
                            <h3>서비스 신청</h3>
                            <div class="form-group">
                                <label>날짜 선택</label>
                                <input 
                                    type="date" 
                                    v-model="serviceRequest.date"
                                    class="input-field"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>반려동물 종류</label>
                                <select 
                                    v-model="serviceRequest.petKind"
                                    class="input-field"
                                    required
                                >
                                    <option value="">선택해주세요</option>
                                    <option v-for="pet in selectedSitter.possiblePet" 
                                            :key="pet" 
                                            :value="pet">
                                        {{ pet }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>이용 시간 (시간)</label>
                                <input 
                                    type="number" 
                                    v-model.number="serviceRequest.hours"
                                    min="1"
                                    class="input-field"
                                    required
                                />
                            </div>
                            <div class="cost-info">
                                <p class="hourly-rate">시간당 비용: {{ selectedSitter.costPerHour }}원</p>
                                <p class="total-cost">총 비용: {{ calculateTotalCost }}원 
                                    <span class="cost-detail">({{ serviceRequest.hours }}시간)</span>
                                </p>
                            </div>
                            <button 
                                @click="submitServiceRequest(selectedSitter)"
                                class="submit-btn"
                                :disabled="!serviceRequest.date || !serviceRequest.petKind || !serviceRequest.hours"
                            >
                                서비스 신청하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<style scoped>
html, body, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}


.container {
    position: absolute;
    left: 0;
    top: 60px;  /* header 높이만큼 띄우기 */
    width: 100vw;
    min-height: calc(100vh - 60px);  /* 최소 높이 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
    padding: 40px;  /* 패딩 증가 */
}
.content-wrapper {
    width: 95%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
}

.sitter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
}

.sitter-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(87, 51, 255, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease;
}

.sitter-card:hover {
    transform: translateY(-5px);
}

.sitter-image {
    width: 100%;
    height: 280px;
    overflow: hidden;
}

.sitter-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sitter-info {
    padding: 1.5rem;
    text-align: center;
}

.sitter-info h3 {
    color: #333;
    margin: 0 0 0.5rem 0;
}

.sitter-info p {
    color: #666;
    margin: 0;
}

/* 모달 스타일 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 24px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    color: #333;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 2rem;
}

.sitter-profile {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sitter-profile img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
}

.profile-info p {
    color: #333;
    font-size: 1.1rem;
    margin: 0.5rem 0;
}

.service-type {
    font-size: 1.3rem;
    font-weight: bold;
    color: #5733FF;
}

.address {
    color: #333;
    font-weight: 500;
}

.cost {
    color: #333;
    font-weight: 500;
    font-size: 1.2rem;
}

.detail-section {
    display: grid;
    gap: 1.5rem;
}

.detail-item {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
}

.detail-item h4 {
    color: #5733FF;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
}

.detail-item p {
    color: #333;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
}

.pet-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.pet-tag {
    background: #5733FF;
    color: white;
    padding: 0.7rem 1.2rem;
    border-radius: 20px;
    font-size: 1rem;
    font-weight: 500;
}

@media (max-width: 768px) {
    .sitter-profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}

.service-request-form {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.service-request-form h3 {
    color: #333;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
}

.input-field {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

.cost-info {
    margin: 1rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.cost-info p {
    color: #5733FF;
    font-weight: 600;
    margin: 0.5rem 0;
}

.hourly-rate {
    font-size: 0.9rem;
    color: #666 !important;
}

.total-cost {
    font-size: 1.2rem;
}

.cost-detail {
    font-size: 0.9rem;
    color: #666;
    margin-left: 0.5rem;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    background: #5733FF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
    background: #4529d3;
    transform: translateY(-2px);
}

.submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.input-field:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

/* 선택 불가능한 옵션에 대한 스타일 */
select option:disabled {
    color: #999;
    background-color: #f5f5f5;
}
</style>

