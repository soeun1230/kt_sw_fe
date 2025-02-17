import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

let refreshTokenRequest = null;
let isRefreshing = false

// 요청 인터셉터: 요청 전에 액세스 토큰을 헤더에 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 응답에서 토큰 만료 오류 처리
api.interceptors.response.use(
    (response) => response,  // 정상 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 이미 refresh 요청이 진행 중이면 해당 Promise를 사용
            if (isRefreshing) {
                return refreshTokenRequest.then((newAccessToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                });
            }

            isRefreshing = true;
            refreshTokenRequest = refreshAccessToken().finally(() => {
                isRefreshing = false;
                refreshTokenRequest = null;
            });

            return refreshTokenRequest.then((newAccessToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }).catch(() => {
                return Promise.reject(error);
            });
        }

        return Promise.reject(error);
    }
);

async function refreshAccessToken() {
    try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            handleLogout();
            return Promise.reject('No refresh token available');
        }

        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
            refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        localStorage.setItem('access_token', newAccessToken);

        return newAccessToken;
    } catch (error) {
        handleLogout(); // refresh 실패 시 로그아웃 처리
        return Promise.reject(error);
    }
}

// axios.js
export function handleLogout() {
    console.log("Logging out...");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    window.location.href = '/login';
}

export default api;
