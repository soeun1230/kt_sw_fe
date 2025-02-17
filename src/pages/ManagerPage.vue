<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from "../axios.js";
import { useRouter } from 'vue-router';

const codes = ref({
    codeTypes: [],
    petKindCodes: [],
    petSizeCodes: [],
    userStatusCodes: []
});

const newCodeGroup = ref({
    codeGroup: '',
    codeGroupExp: ''
});

const newPetKind = ref({
    code: '',
    codeExp: '',
    codeGroup: '',
    petKind: ''
});

const newPetSize = ref({
    code: '',
    codeExp: '',
    codeGroup: '',
    petSize: ''
});

const newUserStatus = ref({
    code: '',
    codeExp: '',
    codeGroup: '',
    userStatus: ''
});

const message = ref('');
const activeTab = ref('codeTypes'); // 현재 활성화된 탭

// 메시지 타이머를 저장할 변수
let messageTimer = null;

const router = useRouter();

// 정렬된 데이터를 반환하는 computed 속성들 수정
const sortedCodeTypes = computed(() => {
    if (!codes.value.codeTypes) return [];
    return [...codes.value.codeTypes].sort((a, b) => {
        const codeGroupA = parseInt(a.codeGroup);
        const codeGroupB = parseInt(b.codeGroup);
        return codeGroupA - codeGroupB;
    });
});

const sortedPetKindCodes = computed(() => {
    if (!codes.value.petKindCodes) return [];
    return [...codes.value.petKindCodes].sort((a, b) => {
        // 문자열을 숫자로 변환하여 정렬
        const codeA = parseInt(a.code);
        const codeB = parseInt(b.code);
        return codeA - codeB;
    });
});

const sortedPetSizeCodes = computed(() => {
    if (!codes.value.petSizeCodes) return [];
    return [...codes.value.petSizeCodes].sort((a, b) => {
        const codeA = parseInt(a.code);
        const codeB = parseInt(b.code);
        return codeA - codeB;
    });
});

const sortedUserStatusCodes = computed(() => {
    if (!codes.value.userStatusCodes) return [];
    return [...codes.value.userStatusCodes].sort((a, b) => {
        const codeA = parseInt(a.code);
        const codeB = parseInt(b.code);
        return codeA - codeB;
    });
});

// 메시지를 설정하고 자동으로 사라지게 하는 함수
const setMessage = (msg) => {
    message.value = msg;
    
    // 이전 타이머가 있다면 제거
    if (messageTimer) {
        clearTimeout(messageTimer);
    }
    
    // 3초 후에 메시지 제거
    messageTimer = setTimeout(() => {
        message.value = '';
    }, 3000);
};

const fetchCodes = async () => {
    try {
        const response = await api.get('http://localhost:8080/api/manager/codes');
        console.log('Fetched data:', response.data); // 데이터 확인용 로그
        
        // 데이터 구조 확인 및 초기화
        codes.value = {
            codeTypes: response.data.codeTypes || [],
            petKindCodes: response.data.petKindCodes || [],
            petSizeCodes: response.data.petSizeCodes || [],
            userStatusCodes: response.data.userStatusCodes || []
        };
    } catch (error) {
        console.error('Error fetching codes:', error);
        setMessage("코드 정보를 불러오는데 실패했습니다.");
    }
};

// 유효성 검사 함수들 추가
const validateCodeGroup = () => {
    if (!newCodeGroup.value.codeGroup || !newCodeGroup.value.codeGroupExp) {
        setMessage("모든 필드를 입력해주세요.");
        return false;
    }
    return true;
};

const validatePetKind = () => {
    if (!newPetKind.value.code || !newPetKind.value.codeExp || 
        !newPetKind.value.codeGroup || !newPetKind.value.petKind) {
        setMessage("모든 필드를 입력해주세요.");
        return false;
    }
    return true;
};

const validatePetSize = () => {
    if (!newPetSize.value.code || !newPetSize.value.codeExp || 
        !newPetSize.value.codeGroup || !newPetSize.value.petSize) {
        setMessage("모든 필드를 입력해주세요.");
        return false;
    }
    return true;
};

const validateUserStatus = () => {
    if (!newUserStatus.value.code || !newUserStatus.value.codeExp || 
        !newUserStatus.value.codeGroup || !newUserStatus.value.userStatus) {
        setMessage("모든 필드를 입력해주세요.");
        return false;
    }
    return true;
};

const addCodeGroup = async () => {
    if (!validateCodeGroup()) return;
    try {
        const response = await api.post('http://localhost:8080/api/manager/codes/group', newCodeGroup.value);
        if (response.data.message === 'add success') {
            setMessage("코드 그룹이 추가되었습니다.");
            await fetchCodes();
            resetForm('codeGroup');
        } else {
            setMessage("이미 존재하는 코드 그룹입니다.");
        }
    } catch (error) {
        console.error('Error adding code group:', error);
        setMessage("코드 그룹 추가에 실패했습니다.");
    }
};

const addPetKind = async () => {
    if (!validatePetKind()) return;
    try {
        const response = await api.post('http://localhost:8080/api/manager/codes/petkind', newPetKind.value);
        if (response.data.message === 'add success') {
            setMessage("반려동물 종류가 추가되었습니다.");
            await fetchCodes();
            resetForm('petKind');
        } else {
            setMessage("이미 존재하는 코드입니다.");
        }
    } catch (error) {
        console.error('Error adding pet kind:', error);
        setMessage("반려동물 종류 추가에 실패했습니다.");
    }
};

const addPetSize = async () => {
    if (!validatePetSize()) return;
    try {
        const response = await api.post('http://localhost:8080/api/manager/codes/petsize', newPetSize.value);
        if (response.data.message === 'add success') {
            setMessage("반려동물 크기가 추가되었습니다.");
            await fetchCodes();
            resetForm('petSize');
        } else {
            setMessage("이미 존재하는 코드입니다.");
        }
    } catch (error) {
        console.error('Error adding pet size:', error);
        setMessage("반려동물 크기 추가에 실패했습니다.");
    }
};

const addUserStatus = async () => {
    if (!validateUserStatus()) return;
    try {
        const response = await api.post('http://localhost:8080/api/manager/codes/userstatus', newUserStatus.value);
        if (response.data.message === 'add success') {
            setMessage("사용자 상태가 추가되었습니다.");
            await fetchCodes();
            resetForm('userStatus');
        } else {
            setMessage("이미 존재하는 코드입니다.");
        }
    } catch (error) {
        console.error('Error adding user status:', error);
        setMessage("사용자 상태 추가에 실패했습니다.");
    }
};

const deleteCodeGroup = async (codeGroup) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/manager/codes/group/delete/${codeGroup}`);
        if (response.data.message === 'deleted') {
            setMessage("코드 그룹이 삭제되었습니다.");
            await fetchCodes();
        }
    } catch (error) {
        console.error('Error deleting code group:', error);
        setMessage("코드 그룹 삭제에 실패했습니다.");
    }
};

const deletePetKind = async (code) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/manager/codes/petkind/delete/${code}`);
        if (response.data.message === 'deleted') {
            setMessage("반려동물 종류가 삭제되었습니다.");
            await fetchCodes();
        }
    } catch (error) {
        console.error('Error deleting pet kind:', error);
        setMessage("반려동물 종류 삭제에 실패했습니다.");
    }
};

const deletePetSize = async (code) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/manager/codes/petsize/delete/${code}`);
        if (response.data.message === 'deleted') {
            setMessage("반려동물 크기가 삭제되었습니다.");
            await fetchCodes();
        }
    } catch (error) {
        console.error('Error deleting pet size:', error);
        setMessage("반려동물 크기 삭제에 실패했습니다.");
    }
};

const deleteUserStatus = async (code) => {
    try {
        const response = await api.patch(`http://localhost:8080/api/manager/codes/userstatus/delete/${code}`);
        if (response.data.message === 'deleted') {
            setMessage("사용자 상태가 삭제되었습니다.");
            await fetchCodes();
        }
    } catch (error) {
        console.error('Error deleting user status:', error);
        setMessage("사용자 상태 삭제에 실패했습니다.");
    }
};

const resetForm = (formType) => {
    switch (formType) {
        case 'codeGroup':
            newCodeGroup.value = { codeGroup: '', codeGroupExp: '' };
            break;
        case 'petKind':
            newPetKind.value = { code: '', codeExp: '', codeGroup: '', petKind: '' };
            break;
        case 'petSize':
            newPetSize.value = { code: '', codeExp: '', codeGroup: '', petSize: '' };
            break;
        case 'userStatus':
            newUserStatus.value = { code: '', codeExp: '', codeGroup: '', userStatus: '' };
            break;
    }
};

const goToHome = () => {
    router.push('/');
};

onMounted(fetchCodes);

// 컴포넌트가 언마운트될 때 타이머 정리
onUnmounted(() => {
    if (messageTimer) {
        clearTimeout(messageTimer);
    }
});
</script>

<template>
    <!-- <header class="page-header">
        <NavBar />
    </header> -->

    <div class="container">
        <div class="content-wrapper">
            <div class="header-section">
                <h1>코드 관리</h1>
                <button @click="goToHome" class="home-btn">홈으로</button>
            </div>

            <!-- 탭 메뉴 -->
            <div class="tabs">
                <button 
                    @click="activeTab = 'codeTypes'"
                    :class="{ active: activeTab === 'codeTypes' }">
                    코드 그룹
                </button>
                <button 
                    @click="activeTab = 'petKind'"
                    :class="{ active: activeTab === 'petKind' }">
                    반려동물 종류
                </button>
                <button 
                    @click="activeTab = 'petSize'"
                    :class="{ active: activeTab === 'petSize' }">
                    반려동물 크기
                </button>
                <button 
                    @click="activeTab = 'userStatus'"
                    :class="{ active: activeTab === 'userStatus' }">
                    사용자 상태
                </button>
            </div>

            <!-- 코드 그룹 탭 -->
            <div v-if="activeTab === 'codeTypes'" class="tab-content">
                <div class="content-grid">
                    <div class="form-section">
                        <h2>코드 그룹 추가</h2>
                        <div class="form-group">
                            <input 
                                v-model="newCodeGroup.codeGroup" 
                                placeholder="코드 그룹" 
                                class="input-field"
                                required />
                            <input 
                                v-model="newCodeGroup.codeGroupExp" 
                                placeholder="코드 그룹 설명" 
                                class="input-field"
                                required />
                            <button @click="addCodeGroup" class="submit-btn">추가</button>
                        </div>
                    </div>
                    <div class="list-section">
                        <h2>코드 그룹 목록</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>코드 그룹</th>
                                    <th>설명</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="code in sortedCodeTypes" :key="code.codeGroup">
                                    <td>{{ code.codeGroup }}</td>
                                    <td>{{ code.groupExp }}</td>
                                    <td>
                                        <button @click="deleteCodeGroup(code.codeGroup)" class="delete-btn">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 반려동물 종류 탭 -->
            <div v-if="activeTab === 'petKind'" class="tab-content">
                <div class="content-grid">
                    <div class="form-section">
                        <h2>반려동물 종류 추가</h2>
                        <div class="form-group">
                            <input 
                                v-model="newPetKind.code" 
                                placeholder="코드" 
                                class="input-field"
                                required />
                            <input 
                                v-model="newPetKind.codeExp" 
                                placeholder="설명" 
                                class="input-field"
                                required />
                            <select 
                                v-model="newPetKind.codeGroup" 
                                class="input-field"
                                required>
                                <option value="">코드 그룹 선택</option>
                                <option v-for="group in sortedCodeTypes" 
                                        :key="group.codeGroup" 
                                        :value="group.codeGroup">
                                    {{ group.codeGroup }} ({{ group.groupExp }})
                                </option>
                            </select>
                            <input 
                                v-model="newPetKind.petKind" 
                                placeholder="반려동물 종류" 
                                class="input-field"
                                required />
                            <button @click="addPetKind" class="submit-btn">추가</button>
                        </div>
                    </div>
                    <div class="list-section">
                        <h2>반려동물 종류 목록</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>설명</th>
                                    <th>코드 그룹</th>
                                    <th>반려동물 종류</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="code in sortedPetKindCodes" :key="code.code">
                                    <td>{{ code.code }}</td>
                                    <td>{{ code.codeExp }}</td>
                                    <td>{{ code.codeGroup }}</td>
                                    <td>{{ code.petKind }}</td>
                                    <td>
                                        <button @click="deletePetKind(code.code)" class="delete-btn">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 반려동물 크기 탭 -->
            <div v-if="activeTab === 'petSize'" class="tab-content">
                <div class="content-grid">
                    <div class="form-section">
                        <h2>반려동물 크기 추가</h2>
                        <div class="form-group">
                            <input 
                                v-model="newPetSize.code" 
                                placeholder="코드" 
                                class="input-field"
                                required />
                            <input 
                                v-model="newPetSize.codeExp" 
                                placeholder="설명" 
                                class="input-field"
                                required />
                            <select 
                                v-model="newPetSize.codeGroup" 
                                class="input-field"
                                required>
                                <option value="">코드 그룹 선택</option>
                                <option v-for="group in sortedCodeTypes" 
                                        :key="group.codeGroup" 
                                        :value="group.codeGroup">
                                    {{ group.codeGroup }} ({{ group.groupExp }})
                                </option>
                            </select>
                            <input 
                                v-model="newPetSize.petSize" 
                                placeholder="반려동물 크기" 
                                class="input-field"
                                required />
                            <button @click="addPetSize" class="submit-btn">추가</button>
                        </div>
                    </div>
                    <div class="list-section">
                        <h2>반려동물 크기 목록</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>설명</th>
                                    <th>코드 그룹</th>
                                    <th>크기</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="code in sortedPetSizeCodes" :key="code.code">
                                    <td>{{ code.code }}</td>
                                    <td>{{ code.codeExp }}</td>
                                    <td>{{ code.codeGroup }}</td>
                                    <td>{{ code.petSize }}</td>
                                    <td>
                                        <button @click="deletePetSize(code.code)" class="delete-btn">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 사용자 상태 탭 -->
            <div v-if="activeTab === 'userStatus'" class="tab-content">
                <div class="content-grid">
                    <div class="form-section">
                        <h2>사용자 상태 추가</h2>
                        <div class="form-group">
                            <input 
                                v-model="newUserStatus.code" 
                                placeholder="코드" 
                                class="input-field"
                                required />
                            <input 
                                v-model="newUserStatus.codeExp" 
                                placeholder="설명" 
                                class="input-field"
                                required />
                            <select 
                                v-model="newUserStatus.codeGroup" 
                                class="input-field"
                                required>
                                <option value="">코드 그룹 선택</option>
                                <option v-for="group in sortedCodeTypes" 
                                        :key="group.codeGroup" 
                                        :value="group.codeGroup">
                                    {{ group.codeGroup }} ({{ group.groupExp }})
                                </option>
                            </select>
                            <input 
                                v-model="newUserStatus.userStatus" 
                                placeholder="사용자 상태" 
                                class="input-field"
                                required />
                            <button @click="addUserStatus" class="submit-btn">추가</button>
                        </div>
                    </div>
                    <div class="list-section">
                        <h2>사용자 상태 목록</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>설명</th>
                                    <th>코드 그룹</th>
                                    <th>상태</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="code in sortedUserStatusCodes" :key="code.code">
                                    <td>{{ code.code }}</td>
                                    <td>{{ code.codeExp }}</td>
                                    <td>{{ code.codeGroup }}</td>
                                    <td>{{ code.userStatus }}</td>
                                    <td>
                                        <button @click="deleteUserStatus(code.code)" class="delete-btn">
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <p v-if="message" class="message" :class="{ success: message.includes('추가되었습니다') }">
                {{ message }}
            </p>
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
/* .page-header {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000; 
  display: flex;
  align-items: center;
  padding: 0 20px;
}  */

.container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7ff;  /* 단일 색상으로 변경 */
    padding: 40px;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

h1 {
    color: #333;  /* 검은색으로 변경 */
    margin: 0;
}

.home-btn {
    padding: 0.8rem 1.5rem;
    background: #5733FF;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.home-btn:hover {
    background: #4529d3;
    transform: translateY(-2px);
}

.tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.tabs button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tabs button.active {
    background: #5733FF;
    color: white;
}

.tab-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(87, 51, 255, 0.1);  /* 보라색 계열의 그림자로 변경 */
    max-height: 70vh;
    overflow-y: auto;
}

.content-grid {
    display: grid;
    grid-template-columns: 400px 1fr;  /* 폼 영역과 목록 영역의 너비 비율 설정 */
    gap: 2rem;
    align-items: start;
}

.form-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(87, 51, 255, 0.1);
}

.list-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(87, 51, 255, 0.1);
    max-height: 60vh;
    overflow-y: auto;
}

h2 {
    color: #333;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-field {
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
    background-color: #fff;
}

.input-field::placeholder {
    color: #666;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background: white;
}

th {
    background: #f0f2ff;
    color: #333;
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid #5733FF;
}

td {
    padding: 1rem;
    color: #333;
    border-bottom: 1px solid #eee;
}

tr:hover {
    background-color: #f5f7ff;
}

.submit-btn {
    padding: 1rem;
    background: #5733FF;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background: #4529d3;
    transform: translateY(-2px);
}

select.input-field {
    appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
    padding-right: 2.5rem;
    color: #333;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
    .content-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .list-section {
        max-height: none;
    }
}

.message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
}

.message.success {
    background: #e6ffe6;
    color: #006600;
}

.message:not(.success) {
    background: #ffe6e6;
    color: #cc0000;
}

.delete-btn {
    padding: 0.3rem 0.8rem;  /* 크기 줄임 */
    background: transparent;  /* 배경 투명 */
    color: #ff4444;  /* 글자색을 빨간색으로 */
    border: 1px solid #ff4444;  /* 테두리 추가 */
    border-radius: 4px;  /* 모서리 둥글기 줄임 */
    cursor: pointer;
    font-size: 0.65rem;  /* 글자 크기 줄임 */
    transition: all 0.2s ease;
}

.delete-btn:hover {
    background: #ff4444;  /* hover 시 배경색 변경 */
    color: white;  /* hover 시 글자색 흰색으로 */
    transform: translateY(-1px);  /* 살짝 위로 이동 */
}

/* 테이블 셀 너비 조정 */
td:last-child, th:last-child {
    width: 80px;  /* 너비 줄임 */
    text-align: center;
}

/* 삭제 버튼 컨테이너 */
.action-cell {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.input-field:invalid {
    border-color: #ff4444;
}

.message:not(.success) {
    background: #ffe6e6;
    color: #cc0000;
    font-weight: 500;
}
</style>
