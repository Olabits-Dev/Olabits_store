import { defineStore } from 'pinia'
import type { Product } from '../types'

interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addToCart(product: Product) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      this.saveCart()
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((i) => i.id !== productId)
      this.saveCart()
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.id === productId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) this.removeFromCart(productId)
      }
      this.saveCart()
    },
    clearCart() {
      this.items = []
      this.saveCart()
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
  },
})
