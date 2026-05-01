import { defineStore } from 'pinia'
import axios from 'axios'
import type { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'https://olabits-store.vercel.app/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials: Record<string, string>) {
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      this.token = response.data.token
      this.user = response.data.user
      localStorage.setItem('token', this.token!)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    async register(userData: Record<string, string>) {
      await axios.post(`${API_URL}/auth/register`, userData)
    },
    async updateProfile(userData: Record<string, string>) {
      const response = await axios.put(`${API_URL}/profile`, userData, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      this.user = response.data.user
      localStorage.setItem('user', JSON.stringify(this.user))
      return response.data
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
