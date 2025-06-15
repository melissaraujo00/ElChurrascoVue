import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    userRole: 'user'
  }),
  actions: {
    setAuth(userData) {
      this.isAuthenticated = true
      this.user = userData
      this.userRole = userData.roles || 'user'
    },
    clearAuth() {
      this.isAuthenticated = false
      this.user = null
      this.userRole = 'user'
      localStorage.removeItem('cart')
    }
  }
})
