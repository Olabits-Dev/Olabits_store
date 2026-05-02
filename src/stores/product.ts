import { defineStore } from 'pinia'
import axios from 'axios'
import type { Product } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'https://olabits-store.vercel.app/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,

    // Filter State
    searchQuery: '',
    selectedCategory: 'All',
    maxPrice: 2000,

    // Pagination State
    currentPage: 1,
    itemsPerPage: 15,
  }),

  getters: {
    categories(state) {
      const cats = state.products.map((p) => p.category)
      return ['All', ...new Set(cats)]
    },

    filteredProducts(state) {
      return state.products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase())

        const matchesCategory =
          state.selectedCategory === 'All' || product.category === state.selectedCategory

        const matchesPrice = product.price <= state.maxPrice

        return matchesSearch && matchesCategory && matchesPrice
      })
    },

    paginatedProducts(): Product[] {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProducts.slice(start, end)
    },

    totalPages(): number {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
  },

  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/products`)
        this.products = response.data
      } catch (err) {
        if (axios.isAxiosError(err)) {
          this.error = err.response?.data?.message || 'Failed to load products'
        } else {
          this.error = 'Failed to load products'
        }
      } finally {
        this.isLoading = false
      }
    },

    async fetchProductById(id: string): Promise<Product | null> {
      this.isLoading = true
      try {
        const response = await axios.get(`${API_URL}/products/${id}`)
        return response.data
      } catch {
        this.error = 'Product not found'
        return null
      } finally {
        this.isLoading = false
      }
    },

    setPage(page: number) {
      this.currentPage = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = 'All'
      this.maxPrice = 2000
      this.currentPage = 1
    },
  },
})
