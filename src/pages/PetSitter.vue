<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted } from 'vue';
import api from "../axios.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const petSitterInfo = ref(null);
const message = ref('');
const showEditModal = ref(false);
const editForm = ref({
    petSitterId: '',
    userId: '',
    address: '',
    possiblePet: [],
    possibleTime: {
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
    },
    costPerHour: '',
    info: '',
    workExp: '',
    sitterImage: null,
    cert: null,
    service: '',
    possibleSize: ''
});
const selectedFileName = ref('');
const selectedCertFileName = ref('');

// 돌봄 가능 동물 목록 정의
const petTypes = [
    { id: 'dog', label: '강아지' },
    { id: 'cat', label: '고양이' },
    { id: 'raccoon', label: '너구리' },
    { id: 'bear', label: '곰' }
];

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

// 수정 모달 열기
const openEditModal = () => {
    editForm.value = {
        petSitterId: petSitterInfo.value.petSitterId,
        userId: localStorage.getItem('userId'),
        address: petSitterInfo.value.address,
        possiblePet: [...petSitterInfo.value.possiblePet],
        possibleTime: petSitterInfo.value.possibleTime,
        costPerHour: petSitterInfo.value.costPerHour,
        info: petSitterInfo.value.info,
        workExp: petSitterInfo.value.workExp || '',
        sitterImage: petSitterInfo.value.sitterImage,
        cert: petSitterInfo.value.cert,
        service: petSitterInfo.value.service,
        possibleSize: petSitterInfo.value.possibleSize
    };
    showEditModal.value = true;
};

// 파일 업로드 처리
const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
        const fileName = type === 'profile' ? selectedFileName : selectedCertFileName;
        fileName.value = file.name;
        
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = new Uint8Array(reader.result);
            if (type === 'profile') {
                editForm.value.sitterImage = Array.from(buffer);
            } else {
                editForm.value.cert = Array.from(buffer);
            }
        };
    }
};

// 정보 수정 제출
const submitEdit = async () => {
    try {
        const response = await api.patch('http://localhost:8080/api/petsitters/mypet/edit', editForm.value);
        
        if (response.data.message === 'edited') {
            message.value = "정보가 성공적으로 수정되었습니다.";
            showEditModal.value = false;
            // 정보 다시 불러오기
            await fetchPetSitterInfo();
        }
    } catch (error) {
        console.error('Error updating pet sitter info:', error);
        message.value = "정보 수정에 실패했습니다.";
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
                <button @click="openEditModal" class="edit-btn">
                    <i class="fas fa-edit"></i> 정보 수정
                </button>
                <button @click="cancelPetSitter" class="cancel-btn">
                    <i class="fas fa-times"></i> 펫시터 그만두기
                </button>
            </div>
        </div>

        <p v-if="message" class="message" :class="{ success: message.includes('완료') }">
            {{ message }}
        </p>
    </div>

    <!-- 정보 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
        <div class="modal-content edit-modal" @click.stop>
            <div class="modal-header">
                <h2>펫시터 정보 수정</h2>
                <button class="close-btn" @click="showEditModal = false">×</button>
            </div>
            
            <div class="modal-body">
                <form @submit.prevent="submitEdit" class="edit-form">
                    <div class="form-group">
                        <label>프로필 이미지</label>
                        <div class="file-upload">
                            <label class="file-label">
                                파일 선택
                                <input type="file" @change="e => handleFileUpload(e, 'profile')" accept="image/*">
                            </label>
                            <span v-if="selectedFileName">{{ selectedFileName }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>활동 지역</label>
                        <input v-model="editForm.address" type="text" class="input-field">
                    </div>

                    <div class="form-group">
                        <label>서비스 종류</label>
                        <select v-model="editForm.service" class="input-field">
                            <option value="방문">방문 돌봄</option>
                            <option value="위탁">위탁 돌봄</option>
                            <option value="둘다">둘 다 가능</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>시간당 요금</label>
                        <input v-model="editForm.costPerHour" type="number" class="input-field">
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능 동물</label>
                        <div class="checkbox-group">
                            <label v-for="pet in petTypes" :key="pet.id">
                                <input type="checkbox" 
                                       :value="pet.label" 
                                       v-model="editForm.possiblePet">
                                {{ pet.label }}
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>돌봄 가능 크기</label>
                        <select v-model="editForm.possibleSize" class="input-field">
                            <option value="소형">소형</option>
                            <option value="중형">중형</option>
                            <option value="대형">대형</option>
                            <option value="모두">모든 크기</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>자기소개</label>
                        <textarea v-model="editForm.info" class="input-field" rows="4"></textarea>
                    </div>

                    <div class="form-group">
                        <label>경력사항 (선택)</label>
                        <textarea v-model="editForm.workExp" class="input-field" rows="4"></textarea>
                    </div>

                    <div class="form-group">
                        <label>자격증 (선택)</label>
                        <div class="file-upload">
                            <label class="file-label">
                                파일 선택
                                <input type="file" @change="e => handleFileUpload(e, 'cert')" accept="image/*">
                            </label>
                            <span v-if="selectedCertFileName">{{ selectedCertFileName }}</span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="submit-btn">수정 완료</button>
                        <button type="button" @click="showEditModal = false" class="cancel-btn">취소</button>
                    </div>
                </form>
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

.edit-btn {
    padding: 1rem 2rem;
    background-color: #5733FF;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1rem;
}

.edit-btn:hover {
    background-color: #4529d3;
    transform: translateY(-2px);
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

.edit-modal {
    width: 90%;
    max-width: 700px;  /* 최대 너비 줄임 */
    max-height: 80vh;  /* 최대 높이 설정 */
    overflow: hidden;  /* 내부 스크롤을 위해 필요 */
    display: flex;
    flex-direction: column;
    padding: 0;  /* 패딩 제거하고 내부 요소에서 처리 */
}

.modal-header {
    padding: 1.5rem;
    background-color: white;
    border-bottom: 1px solid #eee;
    position: sticky;  /* 헤더 고정 */
    top: 0;
    z-index: 1;
}

.modal-body {
    flex: 1;
    overflow-y: auto;  /* 스크롤 추가 */
    padding: 1.5rem;
}

.edit-form {
    display: grid;
    gap: 1.2rem;  /* 간격 약간 줄임 */
}

.form-group {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.form-group label {
    font-weight: 500;
    color: #333;
}

.input-field {
    padding: 0.7rem;  /* 패딩 약간 줄임 */
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.95rem;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.5rem 0;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.file-upload {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.file-label {
    padding: 0.7rem 1.2rem;
    background-color: #5733FF;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
}

.file-label input {
    display: none;
}

.form-actions {
    position: sticky;  /* 하단 고정 */
    bottom: 0;
    background-color: white;
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    margin: 0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.submit-btn {
    padding: 0.7rem 1.2rem;
    background-color: #5733FF;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 95%;
    max-width: 800px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body {
    margin-bottom: 1rem;
}
</style>