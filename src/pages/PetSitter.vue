<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted } from 'vue';
import api from "../axios.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const petSitterInfo = ref(null);
const message = ref('');

// base64 변환 함수 수정
const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    try {
        // 이미지 데이터가 이미 base64 문자열인 경우
        if (typeof buffer === 'string') {
            return buffer;
        }
        // 배열인 경우 변환
        if (Array.isArray(buffer)) {
            return btoa(String.fromCharCode.apply(null, buffer));
        }
        return '';
    } catch (e) {
        console.error('Base64 변환 에러:', e);
        return '';
    }
};

const fetchPetSitterInfo = async () => {
    try {
        const petSitterId = localStorage.getItem('petSitterId');
        const response = await api.get(`http://localhost:8080/api/petsitters/mypet/${petSitterId}`);
        console.log('펫시터 정보:', response.data.petSitter); // 데이터 확인용
        petSitterInfo.value = response.data.petSitter;
    } catch (error) {
        console.error('Error fetching pet sitter info:', error);
        message.value = "펫시터 정보를 불러오는데 실패했습니다.";
    }
};

const cancelPetSitter = async () => {
    try {
        if (!confirm('정말로 펫시터를 그만두시겠습니까?')) {
            return;
        }

        const cancelData = {
            userId: localStorage.getItem('userId'),
            petSitterId: localStorage.getItem('petSitterId')
        };

        const response = await api.patch('http://localhost:8080/api/petsitters/mypet/cancel', cancelData);
        
        if (response.data.message === 'canceled') {
            localStorage.removeItem('petSitterId');
            localStorage.setItem('userCode', '0');
            message.value = "펫시터 취소가 완료되었습니다.";
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        }
    } catch (error) {
        console.error('Error canceling pet sitter:', error);
        message.value = "펫시터 취소에 실패했습니다.";
    }
};

const registerPetSitter = async () => {
    try {
        // ... 다른 코드 유지 ...

        const response = await api.post('http://localhost:8080/api/petsitters/register', petSitterData);

        if (response.data) {
            message.value = "펫시터 등록이 완료되었습니다!";
            localStorage.setItem('userCode', '1');
            localStorage.setItem('petSitterId', response.data.petSitter.petSitterId);  // 수정된 부분
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        }
    } catch (error) {
        console.error('Error:', error);
        message.value = error.response?.data?.message || "펫시터 등록에 실패했습니다.";
    }
};

const downloadCert = () => {
    try {
        if (!petSitterInfo.value.cert) return;
        
        // Base64 데이터를 Blob으로 변환
        const binaryString = atob(arrayBufferToBase64(petSitterInfo.value.cert));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' });

        // 다운로드 링크 생성
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '자격증.jpg';  // 다운로드될 파일명
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('자격증 다운로드 에러:', error);
        alert('자격증 다운로드에 실패했습니다.');
    }
};

onMounted(fetchPetSitterInfo);
</script>

<template>
    <header class="page-header">
        <NavBar />
    </header>

    <div class="container">
        <div class="petsitter-info" v-if="petSitterInfo">
            <h1>펫시터 프로필</h1>

            <div class="info-grid">
                <!-- 왼쪽: 프로필 이미지 및 기본 정보 -->
                <div class="profile-section">
                    <div class="profile-image-container">
                        <img 
                            :src="`data:image/jpeg;base64,${arrayBufferToBase64(petSitterInfo.sitterImage)}`" 
                            alt="프로필 이미지"
                            class="profile-image"
                        />
                    </div>
                    <div class="basic-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>{{ petSitterInfo.address }}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-coins"></i>
                            <span>{{ petSitterInfo.costPerHour.toLocaleString() }}원/시간</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-hand-holding-heart"></i>
                            <span>{{ petSitterInfo.service }}</span>
                        </div>
                    </div>
                </div>

                <!-- 오른쪽: 상세 정보 -->
                <div class="detail-section">
                    <div class="info-card">
                        <h3><i class="fas fa-paw"></i> 돌봄 가능 동물</h3>
                        <div class="pet-types">
                            <span v-for="pet in petSitterInfo.possiblePet" :key="pet" class="pet-tag">
                                {{ pet }}
                            </span>
                        </div>
                    </div>

                    <div class="info-card">
                        <h3><i class="fas fa-ruler"></i> 돌봄 가능 크기</h3>
                        <p>{{ petSitterInfo.possibleSize }}</p>
                    </div>

                    <div class="info-card">
                        <h3><i class="fas fa-clock"></i> 활동 가능 시간</h3>
                        <p>{{ petSitterInfo.possibleTime }}</p>
                    </div>

                    <div class="info-card">
                        <h3><i class="fas fa-user"></i> 자기소개</h3>
                        <p>{{ petSitterInfo.info }}</p>
                    </div>

                    <div class="info-card" v-if="petSitterInfo.workExp">
                        <h3><i class="fas fa-briefcase"></i> 경력사항</h3>
                        <p>{{ petSitterInfo.workExp }}</p>
                    </div>

                    <div class="info-card" v-if="petSitterInfo.cert">
                        <h3><i class="fas fa-certificate"></i> 자격증</h3>
                        <div class="cert-download">
                            <button @click="downloadCert" class="download-btn">
                                <i class="fas fa-download"></i>
                                자격증 다운로드
                            </button>
                            <span class="cert-info">* 자격증 파일이 첨부되어 있습니다.</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="action-section">
                <button @click="cancelPetSitter" class="cancel-btn">
                    <i class="fas fa-times"></i> 펫시터 그만두기
                </button>
            </div>
        </div>

        <p v-if="message" class="message" :class="{ success: message.includes('완료') }">
            {{ message }}
        </p>
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

.petsitter-info {
    width: 95%;  /* 너비 증가 */
    max-width: 1600px;  /* 최대 너비 증가 */
    margin: 0 auto;
    background-color: white;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(87, 51, 255, 0.1);
    overflow: hidden;
}

h1 {
    text-align: center;
    color: #333;
    padding: 2rem;
    margin: 0;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.info-grid {
    display: grid;
    grid-template-columns: 400px 1fr;  /* 왼쪽 섹션 너비 증가 */
    gap: 0;
}

.profile-section {
    padding: 3rem;  /* 패딩 증가 */
    background-color: #f8f9fa;
    border-right: 1px solid #eee;
}

.profile-image-container {
    width: 300px;  /* 이미지 크기 증가 */
    height: 300px;  /* 이미지 크기 증가 */
    margin: 0 auto 2.5rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(87, 51, 255, 0.1);
}

.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;  /* 이미지 표시 방식 변경 */
}

.basic-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item i {
    color: #5733FF;
    font-size: 1.2rem;
    width: 24px;
}

.info-item span {
    color: #000;  /* 글자색을 검은색으로 변경 */
    font-size: 1rem;
    font-weight: 500;  /* 글자 두께 증가 */
}

.detail-section {
    padding: 3rem;  /* 패딩 증가 */
    display: grid;
    grid-template-columns: repeat(2, 1fr);  /* 2열 그리드로 변경 */
    gap: 2rem;  /* 간격 증가 */
    align-content: start;
}

/* 자기소개와 경력사항은 전체 너비 사용 */
.info-card:nth-child(4),
.info-card:nth-child(5),
.info-card:nth-child(6) {
    grid-column: 1 / -1;
}

.info-card {
    background-color: #f8f9fa;
    border-radius: 16px;
    padding: 2rem;  /* 패딩 증가 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
    color: #5733FF;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-card h3 i {
    font-size: 1.2rem;
}

.info-card p {
    color: #000;  /* 글자색을 검은색으로 변경 */
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
}

.pet-types {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
}

.pet-tag {
    padding: 0.6rem 1.2rem;
    background-color: #5733FF;
    color: white;
    border-radius: 20px;
    font-size: 1rem;  /* 글자 크기 증가 */
    font-weight: 500;  /* 글자 두께 증가 */
    box-shadow: 0 2px 4px rgba(87, 51, 255, 0.2);
}

.cert-download {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.download-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background-color: #5733FF;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.download-btn:hover {
    background-color: #4529d3;
    transform: translateY(-2px);
}

.download-btn i {
    font-size: 1.1rem;
}

.cert-info {
    color: #666;
    font-size: 0.9rem;
    font-style: italic;
}

.action-section {
    padding: 2rem;
    text-align: center;
    background-color: #f8f9fa;
    border-top: 1px solid #eee;
}

.cancel-btn {
    padding: 1rem 2rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.cancel-btn:hover {
    background-color: #c82333;
    transform: translateY(-2px);
}

.message {
    text-align: center;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 12px;
}

/* 반응형 디자인 수정 */
@media (max-width: 1400px) {  /* 브레이크포인트 증가 */
    .info-grid {
        grid-template-columns: 350px 1fr;
    }
    
    .detail-section {
        grid-template-columns: 1fr;  /* 1열로 변경 */
    }
}

@media (max-width: 1024px) {
    .info-grid {
        grid-template-columns: 1fr;
    }

    .profile-section {
        border-right: none;
        border-bottom: 1px solid #eee;
    }

    .profile-image-container {
        width: 250px;
        height: 250px;
    }
}
</style>