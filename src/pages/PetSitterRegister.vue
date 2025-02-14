<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted } from 'vue';
import api from "../axios.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const location = ref('');
const availablePets = ref([]);
const availableDate = ref({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
});
const hourlyRate = ref('');
const message = ref('');
const showAddressSearch = ref(false);
const petSitterPic = ref(null);
const selectedFileName = ref('');
const info = ref('');  // 자기소개
const workExp = ref('');  // 경력사항
const cert = ref(null);  // 자격증 이미지
const selectedCertFileName = ref('');
const service = ref('');  // 서비스 종류
const possibleSize = ref('');  // 가능한 반려동물 크기

const petTypes = [
    { id: 'dog', label: '강아지' },
    { id: 'cat', label: '고양이' },
    { id: 'raccoon', label: '너구리' },
    { id: 'bear', label: '곰' }
];

// 서비스 종류 옵션
const serviceTypes = [
    { id: "방문", label: '방문 돌봄' },
    { id: "위탁", label: '위탁 돌봄' },
    { id: "둘다", label: '둘 다 가능' }
];

// 가능한 크기 옵션
const sizesTypes = [
    { id: "소형", label: '소형' },
    { id: "중형", label: '중형' },
    { id: "대형", label: '대형' },
    { id: "모두", label: '모든 크기' }
];

// 카카오 주소 검색
const initKakaoAddressSearch = () => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
};

const openAddressSearch = () => {
    new daum.Postcode({
        oncomplete: function(data) {
            location.value = data.address;
            showAddressSearch.value = false;
        }
    }).open();
};

onMounted(() => {
    initKakaoAddressSearch();
});

const handlePetTypeChange = (type) => {
    const index = availablePets.value.indexOf(type);
    if (index === -1) {
        availablePets.value.push(type);
    } else {
        availablePets.value.splice(index, 1);
    }
};

// 파일 업로드 처리
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFileName.value = file.name;  // 파일명 저장
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = new Uint8Array(reader.result);
            petSitterPic.value = Array.from(buffer);
        };
    }
};

// 자격증 이미지 업로드
const handleCertUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedCertFileName.value = file.name;
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = new Uint8Array(reader.result);
            cert.value = Array.from(buffer);
        };
    }
};

const registerPetSitter = async () => {
    try {
        // 필수 필드만 검증
        if (!location.value || !availablePets.value.length || !service.value || 
            !possibleSize.value || !hourlyRate.value || !availableDate.value.startDate || 
            !availableDate.value.endDate || !availableDate.value.startTime || 
            !availableDate.value.endTime || !petSitterPic.value) {
            message.value = "필수 정보를 모두 입력해주세요. (프로필 사진, 활동지역, 돌봄가능 동물, 기간, 시간, 요금, 서비스 종류, 동물 크기는 필수입니다.)";
            return;
        }

        const petSitterData = {
            userId: localStorage.getItem('userId'),
            address: location.value,
            possiblePet: availablePets.value,
            possibleTime: `${availableDate.value.startDate} ~ ${availableDate.value.endDate} (${availableDate.value.startTime}~${availableDate.value.endTime})`,
            costPerHour: Number(hourlyRate.value),
            info: info.value || "",
            workExp: workExp.value || null,  // 경력 선택적
            sitterImage: petSitterPic.value,
            cert: cert.value || null,  // 자격증 선택적
            service: service.value,
            possibleSize: possibleSize.value
        };

        const response = await api.post('http://localhost:8080/api/petsitters/register', petSitterData);


        if (response.data) {
            message.value = "펫시터 등록이 완료되었습니다!";
            localStorage.setItem('userCode', '1');
            localStorage.setItem('petSitterId', response.data.petSitter.petSitterId);
            setTimeout(() => {
                router.push('/pet-sitter');
            }, 1500);
        }
    } catch (error) {
        console.error('Error:', error); // 에러 로깅
        message.value = error.response?.data?.message || "펫시터 등록에 실패했습니다.";
    }
};
</script>

<template>
    <header class="page-header">
        <NavBar />
    </header>

    <div class="container">
        <div class="register-form">
            <h1>펫시터 등록</h1>
            <p class="sub-text">펫시터 정보를 입력해주세요</p>

            <div class="form-grid">
                <!-- 왼쪽 섹션 -->
                <div class="form-section">
                    <div class="form-group">
                        <label>프로필 사진</label>
                        <div class="file-upload-container">
                            <label for="file-upload" class="custom-file-upload">
                                사진 선택
                            </label>
                            <input 
                                id="file-upload"
                                type="file" 
                                @change="handleFileUpload" 
                                accept="image/*"
                                class="file-input"
                            />
                            <span v-if="selectedFileName" class="file-name">{{ selectedFileName }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>활동 지역</label>
                        <div class="address-input">
                            <input 
                                v-model="location" 
                                type="text" 
                                placeholder="주소를 검색하세요"
                                class="input-field"
                                readonly
                            />
                            <button @click="openAddressSearch" class="search-btn">주소 검색</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능한 반려동물</label>
                        <div class="pet-types">
                            <div 
                                v-for="type in petTypes" 
                                :key="type.id"
                                class="pet-type-checkbox"
                            >
                                <input 
                                    type="checkbox" 
                                    :id="type.id"
                                    :value="type.label"
                                    @change="handlePetTypeChange(type.label)"
                                    :checked="availablePets.includes(type.label)"
                                />
                                <label :for="type.id">{{ type.label }}</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능 기간</label>
                        <div class="date-inputs">
                            <input 
                                v-model="availableDate.startDate"
                                type="date"
                                class="input-field date-input"
                            />
                            <span>~</span>
                            <input 
                                v-model="availableDate.endDate"
                                type="date"
                                class="input-field date-input"
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능 시간</label>
                        <div class="time-inputs">
                            <input 
                                v-model="availableDate.startTime"
                                type="time"
                                class="input-field time-input"
                            />
                            <span>~</span>
                            <input 
                                v-model="availableDate.endTime"
                                type="time"
                                class="input-field time-input"
                            />
                        </div>
                    </div>
                </div>

                <!-- 오른쪽 섹션 -->
                <div class="form-section">
                    <div class="form-group">
                        <label>시간당 요금 (원)</label>
                        <input 
                            v-model="hourlyRate" 
                            type="number" 
                            placeholder="시간당 요금을 입력하세요"
                            class="input-field"
                        />
                    </div>

                    <div class="form-group">
                        <label>서비스 종류</label>
                        <select v-model="service" class="input-field">
                            <option value="">서비스 종류를 선택하세요</option>
                            <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능한 반려동물 크기</label>
                        <select v-model="possibleSize" class="input-field">
                            <option value="">크기를 선택하세요</option>
                            <option v-for="size in sizesTypes" :key="size.id" :value="size.id">
                                {{ size.label }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>자기소개</label>
                        <textarea 
                            v-model="info"
                            class="input-field textarea"
                            placeholder="자기소개를 입력하세요"
                            rows="4"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label>경력사항 <span class="optional">(선택사항)</span></label>
                        <textarea 
                            v-model="workExp"
                            class="input-field textarea"
                            placeholder="관련 경력이 있다면 입력해주세요"
                            rows="4"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label>자격증 이미지 <span class="optional">(선택사항)</span></label>
                        <div class="file-upload-container">
                            <label for="cert-upload" class="custom-file-upload">
                                자격증 선택
                            </label>
                            <input 
                                id="cert-upload"
                                type="file" 
                                @change="handleCertUpload" 
                                accept="image/*"
                                class="file-input"
                            />
                            <span v-if="selectedCertFileName" class="file-name">
                                {{ selectedCertFileName }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-section">
                <button @click="registerPetSitter" class="register-btn">등록하기</button>
                <p v-if="message" class="message" :class="{ success: message.includes('완료') }">
                    {{ message }}
                </p>
            </div>
        </div>
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
    top: 60px;  /* header 높이만큼 띄우기 */
    width: 100vw;
    min-height: calc(100vh - 60px);  /* 최소 높이 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
    padding: 40px;  /* 패딩 증가 */
}

.register-form {
    width: 95%;  /* 너비 증가 */
    max-width: 1400px;  /* 최대 너비 증가 */
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 3rem;  /* 내부 패딩 증가 */
    margin: 20px 0;  /* 상하 여백 추가 */
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.2rem;  /* 폰트 크기 증가 */
}

.sub-text {
    color: #666;
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 1.1rem;  /* 폰트 크기 증가 */
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;  /* 간격 증가 */
    margin-top: 2rem;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;  /* 간격 증가 */
}

.form-group {
    margin-bottom: 1.5rem;  /* 간격 증가 */
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
}

.input-field {
    width: 100%;
    padding: 0.8rem;  /* 패딩 증가 */
    border: 1px solid #ddd;
    border-radius: 12px;
    font-size: 1.1rem;  /* 폰트 크기 증가 */
    transition: all 0.3s ease;
}

.input-field:focus {
    border-color: #5733FF;
    box-shadow: 0 0 0 2px rgba(87, 51, 255, 0.1);
    outline: none;
}

.pet-types {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
}

.pet-type-checkbox {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.register-btn {
    width: 100%;
    padding: 1rem 1.5rem;  /* 패딩 증가 */
    background-color: #5733FF;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;  /* 폰트 크기 증가 */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.register-btn:hover {
    background-color: #4529d3;
    transform: translateY(-2px);
}

.message {
    margin-top: 0.8rem;
    padding: 0.8rem;
    border-radius: 12px;
    text-align: center;
    font-size: 0.9rem;
}

.message.success {
    background-color: #f0fff4;
    color: #2e7d32;
}

.message:not(.success) {
    background-color: #fff3f3;
    color: #d32f2f;
}

.address-input {
    display: flex;
    gap: 1rem;
}

.search-btn {
    padding: 1rem 1.5rem;  /* 패딩 증가 */
    background-color: #5733FF;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-size: 1rem;  /* 폰트 크기 증가 */
}

.search-btn:hover {
    background-color: #4529d3;
}

.date-inputs, .time-inputs {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.date-input, .time-input {
    padding: 0.6rem;
    font-size: 0.9rem;
}

span {
    color: #666;
    font-weight: 500;
}

.input-field[readonly] {
    background-color: #f8f9fa;
    cursor: pointer;
}

.file-upload-container {
    display: flex;
    align-items: center;
    gap: 1rem;  /* 버튼과 파일명 사이 간격 */
}

.file-input {
    display: none; /* 기본 input 숨기기 */
}

.custom-file-upload {
    padding: 1rem 1.5rem;  /* 패딩 증가 */
    background-color: #5733FF;
    color: white;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
    font-size: 1rem;  /* 폰트 크기 증가 */
}

.custom-file-upload:hover {
    background-color: #4529d3;
    transform: translateY(-2px);
}

.file-input::file-selector-button {
    display: none;
}

.file-name {
    color: #333;  /* 글자색을 진한 회색으로 */
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

.textarea {
    resize: vertical;
    min-height: 120px;  /* 높이 증가 */
}

select.input-field {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
    padding-right: 2.5rem;
}

.button-section {
    margin-top: 2rem;
    text-align: center;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {  /* 브레이크포인트 증가 */
    .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .register-form {
        max-width: 800px;  /* 반응형일 때 최대 너비 증가 */
        padding: 2rem;
    }
}

.optional {
    color: #666;
    font-size: 0.9rem;
    font-weight: normal;
    margin-left: 0.5rem;
}

/* 선택적 필드의 스타일을 약간 다르게 처리 */
.form-group:has(.optional) .input-field {
    border-color: #ddd;
    background-color: #fafafa;
}

.form-group:has(.optional) .custom-file-upload {
    background-color: #6c757d;
}

.form-group:has(.optional) .custom-file-upload:hover {
    background-color: #5a6268;
}
</style>