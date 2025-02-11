import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('jwt') || null,
        user: null
    }),
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('jwt', token);
        },
        async fetchUser() {
            if (!this.token) return;
            const response = await fetch('http://localhost:8080/user/me', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            this.user = response.ok ? await response.json() : null;
        }
    }
});
