<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    amount: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['payment-success']);

const onPayment = () => {
/* 1. 가맹점 식별하기 */
const { IMP } = window;
IMP.init('imp51815570'); //고객사 식별코드 입력시 실제 결제가됨
/* 2. 결제 데이터 정의하기 */
const data = {
pg: 'uplus', // 채널로 등록된 PG사만 사용가능하다. PG사마다 결제 화면이 달라진다
pay_method: 'card', // 결제수단
merchant_uid: `mid_${new Date().getTime()}`, // 주문번호 - 지금 이거는 임의로 넣은 것 실제로는 내 주문번호를 넣기 
amount: props.amount, // 결제금액 -> 이것도 내가 넣기 
name: '펫시터 서비스 결제', // 주문명 
buyer_name: localStorage.getItem('userName'), // 구매자 이름
buyer_tel: '01012341234', // 구매자 전화번호
buyer_email: localStorage.getItem('userEmail'), // 구매자 이메일
buyer_addr: '신사동 661-16', // 구매자 주소
buyer_postcode: '06018' // 구매자 우편번호
};
/* 4. 결제 창 호출하기 */
IMP.request_pay(data, callback);
};
const callback = (response) => {
/* 3. 콜백 함수 정의하기 */
const {
success,
error_msg
} = response;
console.log(response);
if (success) {
    alert('결제 성공');
    emit('payment-success');
} else {
alert(`결제 실패: ${error_msg}`);
}
};
</script>

<template>
    <button @click="onPayment" class="payment-btn">
        결제하기
    </button>
</template>

<style scoped>
.payment-btn {
    width: 100%;
    padding: 0.8rem;
    background: #5733FF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-btn:hover {
    background: #4529d3;
    transform: translateY(-2px);
}
</style>