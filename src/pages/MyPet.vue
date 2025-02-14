<script setup>
import { ref, onMounted } from "vue";
import api from "../axios.js";
import NavBar from "@/components/NavBar.vue";
import defaultPetImage from '@/assets/default-pet.png';  // 이미지를 assets 폴더에 추가해야 합니다

const showForm = ref(false);
const petName = ref("");
const petAge = ref(null);
const petKind = ref("고양이");
const petPic = ref(null);
const pets = ref([]);
const message = ref("");

// 선택된 펫 정보와 상세 모달 표시 여부
const selectedPet = ref(null);
const showDetailModal = ref(false);

// 수정 모드 상태 관리
const isEditing = ref(false);
const editedPet = ref(null);

// 폼 열고 닫기
const toggleForm = () => {
  showForm.value = !showForm.value;
};

// 파일 업로드 (byte[] 변환)
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result);
      petPic.value = Array.from(buffer);
    };
  }
};


// 서버에서 반려동물 목록 불러오기
const fetchPets = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await api.get(`http://localhost:8080/api/users/pets`, {
      params: {
        userId: userId
      }
    });
    console.log('Fetched pets:', response.data.message); // 데이터 확인용
    pets.value = response.data.message || [];
  } catch (error) {
    console.error("펫 정보를 불러오는 데 실패했습니다.", error);
    pets.value = []; // 에러 시 빈 배열로 초기화
  }
};

// 반려동물 추가
const addPet = async () => {
  const userId = localStorage.getItem('userId');
  
  // 이미지가 없을 경우 기본 이미지를 byte array로 변환
  let petImage = petPic.value;
  if (!petImage) {
    try {
      const response = await fetch(defaultPetImage);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      petImage = Array.from(new Uint8Array(buffer));
    } catch (error) {
      console.error("기본 이미지 변환 실패:", error);
    }
  }

  const newPet = {
    userId: userId,
    petName: petName.value,
    petAge: petAge.value,
    petKind: petKind.value,
    petPic: petImage,  // 기본 이미지 또는 사용자가 업로드한 이미지
  };

  try {
    await api.post(`http://localhost:8080/api/users/pets`, newPet);
    message.value = "반려동물 등록 성공!";
    fetchPets();
    showForm.value = false;
    resetForm();
  } catch (error) {
    message.value = error.response?.data || "반려동물 등록 실패";
  }
};

// 입력값 초기화
const resetForm = () => {
  petName.value = "";
  petAge.value = null;
  petKind.value = "고양이";
  petPic.value = null;
};

// 펫 삭제 함수
const deletePet = async (petId, petName) => {
  if (!petId) {
    console.error('Pet ID is missing');
    return;
  }
  
  if (confirm(`${petName}을(를) 정말 삭제하시겠습니까?`)) {
    try {
      const response = await api.patch(`http://localhost:8080/api/users/pets`, null, {
        params: {
          petId: petId.toString()
        }
      });
      
      if (response.data.error) {
        message.value = response.data.error;
      } else {
        message.value = "반려동물이 삭제되었습니다.";
        await fetchPets();
      }
    } catch (error) {
      message.value = "반려동물 삭제에 실패했습니다.";
      console.error("삭제 실패:", error);
    }
  }
};

// 펫 상세 정보 모달 열기
const openPetDetail = (pet) => {
  selectedPet.value = pet;
  showDetailModal.value = true;
};

// 펫 상세 정보 모달 닫기
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedPet.value = null;
};

// 수정 모드 시작
const startEditing = () => {
  editedPet.value = { ...selectedPet.value }; // 현재 선택된 펫 정보 복사
  isEditing.value = true;
};

// 수정 취소
const cancelEditing = () => {
  isEditing.value = false;
  editedPet.value = null;
};

// 펫 정보 수정
const updatePet = async () => {
  try {
    const response = await api.patch(`http://localhost:8080/api/users/pets/update`, {
      petId: editedPet.value.petId,
      petName: editedPet.value.petName,
      petAge: editedPet.value.petAge,
      petKind: editedPet.value.petKind
    });

    if (response.data.error) {
      message.value = response.data.error;
    } else {
      message.value = "반려동물 정보가 수정되었습니다.";
      await fetchPets();
      selectedPet.value = { ...editedPet.value }; // 모달의 정보 업데이트
      isEditing.value = false;
    }
  } catch (error) {
    message.value = "반려동물 정보 수정에 실패했습니다.";
    console.error("수정 실패:", error);
  }
};

// 페이지 로드 시 반려동물 목록 가져오기
onMounted(fetchPets);
</script>

<template>
  <header class="page-header">
    <NavBar />
  </header>

  <div class="container">
    <main class="main-content">
      <div class="pet-header">
        <h2>펫 사진</h2>
      </div>

      <div class="pet-list" v-if="pets && pets.length > 0">
        <div class="card-container">
          <div v-for="(pet, index) in pets" :key="pet.petId" class="pet-card" @click="openPetDetail(pet)">
            <button @click.stop="deletePet(pet.petId, pet.petName)" class="delete-btn" title="삭제">×</button>
            <div class="pet-img-container">
              <img 
                v-if="pet.petPic" 
                :src="`data:image/png;base64,${pet.petPic}`" 
                class="pet-img" 
                alt="반려동물 사진" 
              />
              <div v-else class="no-img">No Image</div>
            </div>
            <div class="pet-info">
              <p class="pet-name">{{ pet.petName }}</p>
              <p class="pet-details">{{ pet.petAge }}살 · {{ pet.petKind }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-pets">
        <p>등록된 반려동물이 없습니다</p>
      </div>

      <!-- 펫 추가 버튼 -->
      <button @click="toggleForm" class="floating-add-btn">
        <span class="plus-icon">+</span>
      </button>
    </main>

    <!-- 반려동물 등록 폼 모달 -->
    <div v-if="showForm" class="modal-overlay">
      <div class="pet-form">
        <h2>반려동물 등록</h2>
        <label>이름</label>
        <input v-model="petName" type="text" placeholder="반려동물 이름을 입력하세요" class="input-field" />

        <label>나이</label>
        <input v-model="petAge" type="number" min="0" placeholder="반려동물 나이를 입력하세요" class="input-field" />

        <label>종류</label>
        <select v-model="petKind" class="select-field">
          <option value="고양이">고양이</option>
          <option value="강아지">강아지</option>
          <option value="곰">곰</option>
          <option value="너구리">너구리</option>
        </select>

        <label for="petPic">사진</label>
        <input type="file" @change="handleFileUpload" class="file-input" />

        <div class="form-buttons">
          <button @click="addPet" class="submit-btn">등록</button>
          <button @click="toggleForm" class="cancel-btn">취소</button>
        </div>
        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>

    <!-- 펫 상세 정보 모달 -->
    <div v-if="showDetailModal && selectedPet" class="modal-overlay" @click="closeDetailModal">
      <div class="pet-detail-modal" @click.stop>
        <button class="close-btn" @click="closeDetailModal">×</button>
        <div class="pet-detail-content">
          <div class="pet-detail-image">
            <img 
              v-if="selectedPet.petPic" 
              :src="`data:image/png;base64,${selectedPet.petPic}`" 
              alt="반려동물 사진"
            />
            <div v-else class="no-img">No Image</div>
          </div>
          <div class="pet-detail-info">
            <!-- 수정 모드가 아닐 때 -->
            <div v-if="!isEditing">
              <h2>{{ selectedPet.petName }}</h2>
              <div class="info-row">
                <span class="info-label">나이</span>
                <span class="info-value">{{ selectedPet.petAge }}살</span>
              </div>
              <div class="info-row">
                <span class="info-label">종류</span>
                <span class="info-value">{{ selectedPet.petKind }}</span>
              </div>
              <button @click="startEditing" class="edit-btn">수정하기</button>
            </div>

            <!-- 수정 모드일 때 -->
            <div v-else class="edit-form">
              <div class="edit-field">
                <label>이름</label>
                <input v-model="editedPet.petName" type="text" class="input-field" />
              </div>
              <div class="edit-field">
                <label>나이</label>
                <input v-model="editedPet.petAge" type="number" min="0" class="input-field" />
              </div>
              <div class="edit-field">
                <label>종류</label>
                <select v-model="editedPet.petKind" class="select-field">
                  <option value="고양이">고양이</option>
                  <option value="강아지">강아지</option>
                  <option value="곰">곰</option>
                  <option value="너구리">너구리</option>
                </select>
              </div>
              <div class="edit-buttons">
                <button @click="updatePet" class="save-btn">저장</button>
                <button @click="cancelEditing" class="cancel-btn">취소</button>
              </div>
            </div>
          </div>
        </div>
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

.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
  padding-top: 60px;
}

.page-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

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

.main-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.pet-header {
  margin-top: 0;
  padding-top: 0;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.pet-card {
  position: relative; /* delete 버튼의 기준점 */
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-img-container {
  width: 100%;
  padding-top: 75%; /* 4:3 비율 */
  position: relative;
  background-color: #f0f0f0;
}

.pet-img, .no-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.pet-info {
  padding: 16px;
}

.pet-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.pet-details {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
}

.no-pets {
  text-align: center;
  padding: 40px;
  color: #666;
}

.message {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #d32f2f;
}

.floating-add-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.floating-add-btn:hover {
  transform: scale(1.1);
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pet-form {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  margin: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.pet-form h2 {
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  font-size: 24px;
}

.pet-form label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.select-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.select-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.file-input {
  width: 100%;
  margin-bottom: 20px;
  font-size: 14px;
  color: #007bff;
  font-weight: 500;
}

.file-input::file-selector-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  color: #555;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.2s ease;
}

.file-input::-webkit-file-upload-text {
  color: #007bff;
  font-weight: 500;
}

.file-input::file-selector-button:hover {
  background-color: #e9ecef;
  border-color: #ccc;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn, .cancel-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #555;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.message.error {
  background-color: #fff3f3;
  color: #d32f2f;
}

.message.success {
  background-color: #f0fff4;
  color: #2e7d32;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  color: #666;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #ff4444;
  color: white;
  transform: scale(1.1);
}

.pet-detail-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.pet-detail-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.pet-detail-image {
  flex: 0 0 250px;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.pet-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-detail-info {
  flex: 1;
  min-width: 0;
}

.pet-detail-info h2 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
}

.info-row {
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.info-label {
  flex: 0 0 80px;
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 600px) {
  .pet-detail-content {
    flex-direction: column;
  }

  .pet-detail-image {
    width: 100%;
    flex: 0 0 200px;
  }
}

.edit-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.edit-form {
  padding-top: 10px;
}

.edit-field {
  margin-bottom: 16px;
}

.edit-field label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background-color: #218838;
  transform: translateY(-1px);
}
</style>
