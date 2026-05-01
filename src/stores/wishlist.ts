import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import type { Product } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'https://olabits-store.vercel.app/api'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Product[],
    isLoading: false,
  }),
  actions: {
    async fetchWishlist() {
      const auth = useAuthStore()
      if (!auth.token) return

      this.isLoading = true
      try {
        const response = await axios.get(`https://olabits-store.vercel.app/api/wishlist`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        this.items = response.data
      } catch (error) {
        console.error('Failed to fetch wishlist:', error)
      } finally {
        this.isLoading = false
      }
    },
    async toggleWishlist(product: Product) {
      const auth = useAuthStore()
      if (!auth.token) return

      try {
        const response = await axios.post(
          `https://olabits-store.vercel.app/api/wishlist/${product.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          },
        )
        if (response.data.added) {
          this.items.push(product)
        } else {
          this.items = this.items.filter((item) => item.id !== product.id)
        }
      } catch (error) {
        console.error('Failed to toggle wishlist:', error)
      }
    },
    isInWishlist(productId: number) {
      return this.items.some((item) => item.id === productId)
    },
  },
})
