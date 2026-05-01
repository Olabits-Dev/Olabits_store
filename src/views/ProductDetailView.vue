<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Heart, Star, Send } from 'lucide-vue-next'
import type { Product } from '../types'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const auth = useAuthStore()

const API_URL = import.meta.env.VITE_API_URL || '${API_URL}'

const product = ref<Product | null>(null)
const reviews = ref<any[]>([])
const loading = ref(true)

// New Review Form
const newRating = ref(5)
const newComment = ref('')
const submittingReview = ref(false)

const fetchData = async () => {
  const prodId = route.params.id as string
  const [prod, revRes] = await Promise.all([
    productStore.fetchProductById(prodId),
    axios.get(`${API_URL}/reviews/${prodId}`),
  ])
  product.value = prod
  reviews.value = revRes.data
  loading.value = false
}

onMounted(fetchData)

const submitReview = async () => {
  if (!auth.isAuthenticated) return alert('Please login to leave a review')
  submittingReview.value = true
  try {
    await axios.post(
      `${API_URL}/reviews/${product.value?.id}`,
      {
        rating: newRating.value,
        comment: newComment.value,
      },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      },
    )
    newComment.value = ''
    fetchData()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to submit review')
  } finally {
    submittingReview.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
    <div class="max-w-[1184px] mx-auto px-4">
      <!-- Nav breadcrumb -->
      <nav
        class="flex items-center gap-2 text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest"
      >
        <RouterLink to="/" class="hover:text-olabits-blue transition-colors">Home</RouterLink>
        <span>/</span>
        <span v-if="product" class="text-olabits-indigo dark:text-olabits-light">{{
          product.category
        }}</span>
      </nav>

      <div v-if="loading" class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-16">
        <div class="bg-gray-100 dark:bg-gray-800 aspect-square rounded-[2rem]"></div>
        <div class="space-y-8">
          <div class="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl w-3/4"></div>
          <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl"></div>
        </div>
      </div>

      <div v-else-if="product" class="space-y-24">
        <!-- TOP SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Left: Image -->
          <div class="space-y-4">
            <div
              class="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl shadow-indigo-100/50 dark:shadow-none relative group"
            >
              <img
                :src="product.image_url || ''"
                :alt="product.name"
                class="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
              />

              <!-- Wishlist Toggle -->
              <button
                @click="wishlistStore.toggleWishlist(product!)"
                class="absolute top-8 left-8 w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 group/wish"
              >
                <Heart
                  :size="28"
                  :class="[
                    wishlistStore.isInWishlist(product.id)
                      ? 'fill-olabits-red text-olabits-red'
                      : 'text-gray-400 group-hover/wish:text-olabits-red',
                  ]"
                />
              </button>

              <div
                class="absolute top-8 right-8 bg-olabits-red text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest"
              >
                Save 15%
              </div>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="flex flex-col">
            <div class="mb-10">
              <h1 class="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                {{ product.name }}
              </h1>

              <div
                class="flex items-center gap-6 mb-8 border-b border-gray-50 dark:border-gray-800 pb-8"
              >
                <div class="flex flex-col">
                  <span class="text-4xl font-black text-olabits-wine dark:text-olabits-red">{{
                    formatCurrency(product.price)
                  }}</span>
                  <span class="text-sm text-gray-400 line-through font-bold">{{
                    formatCurrency(product.price * 1.15)
                  }}</span>
                </div>
                <div
                  class="bg-olabits-red/10 text-olabits-red px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter"
                >
                  Flash Deal
                </div>
              </div>

              <div
                class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700"
              >
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                  Product Description
                </h3>
                <p
                  class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium text-sm md:text-base"
                >
                  {{ product.description }}
                </p>
              </div>
            </div>

            <!-- CTA -->
            <div class="space-y-4 mb-10">
              <button
                @click="cartStore.addToCart(product!)"
                :disabled="product.stock === 0"
                class="w-full bg-olabits-wine hover:bg-black disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-4 active:scale-95 text-lg uppercase tracking-widest"
              >
                <ShoppingCart :size="24" />
                Add to Shopping Cart
              </button>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-3 gap-4">
              <div
                class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center text-center group hover:border-olabits-blue transition-colors"
              >
                <Truck :size="24" class="text-olabits-blue mb-2" />
                <span
                  class="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-tighter"
                  >Express Delivery</span
                >
              </div>
              <div
                class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center text-center group hover:border-olabits-indigo transition-colors"
              >
                <ShieldCheck :size="24" class="text-olabits-indigo mb-2" />
                <span
                  class="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-tighter"
                  >Genuine Warranty</span
                >
              </div>
              <div
                class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex flex-col items-center text-center group hover:border-olabits-red transition-colors"
              >
                <RotateCcw :size="24" class="text-olabits-red mb-2" />
                <span
                  class="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-tighter"
                  >Easy Returns</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- REVIEWS SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <!-- Review Summary & Form -->
          <div class="lg:col-span-1 space-y-10">
            <div>
              <h2
                class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2"
              >
                Customer Reviews
              </h2>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Share your experience with Olabits Community
              </p>
            </div>

            <div
              class="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl"
            >
              <h4
                class="text-[10px] font-black text-olabits-indigo dark:text-olabits-light uppercase tracking-widest mb-6"
              >
                Leave a Review
              </h4>
              <form @submit.prevent="submitReview" class="space-y-6">
                <div>
                  <label
                    class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3"
                    >Your Rating</label
                  >
                  <div class="flex gap-2">
                    <button
                      v-for="i in 5"
                      :key="i"
                      type="button"
                      @click="newRating = i"
                      class="transition-all active:scale-90"
                    >
                      <Star
                        :size="24"
                        :class="[
                          i <= newRating
                            ? 'fill-olabits-wine text-olabits-wine dark:fill-olabits-red dark:text-olabits-red'
                            : 'text-gray-200 dark:text-gray-700',
                        ]"
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3"
                    >Your Comment</label
                  >
                  <textarea
                    v-model="newComment"
                    required
                    rows="4"
                    placeholder="How was the quality and delivery?"
                    class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-medium text-sm text-gray-700 dark:text-white transition-all"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  :disabled="submittingReview || !auth.isAuthenticated"
                  class="w-full bg-olabits-wine hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  <Send :size="16" /> {{ submittingReview ? 'Posting...' : 'Post Review' }}
                </button>
                <p
                  v-if="!auth.isAuthenticated"
                  class="text-center text-[10px] font-bold text-olabits-red uppercase"
                >
                  Login required to review
                </p>
              </form>
            </div>
          </div>

          <!-- Review List -->
          <div class="lg:col-span-2 space-y-6">
            <div
              v-if="reviews.length === 0"
              class="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700"
            >
              <p class="text-gray-400 font-bold uppercase tracking-widest">
                No reviews yet. Be the first to review!
              </p>
            </div>
            <div
              v-for="review in reviews"
              :key="review.id"
              class="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <div class="flex gap-1 mb-2">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :size="14"
                      :class="[
                        i <= review.rating
                          ? 'fill-olabits-wine text-olabits-wine dark:fill-olabits-red dark:text-olabits-red'
                          : 'text-gray-100 dark:text-gray-700',
                      ]"
                    />
                  </div>
                  <p
                    class="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight"
                  >
                    {{ review.user.name }}
                  </p>
                </div>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{
                  new Date(review.createdAt).toLocaleDateString()
                }}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                "{{ review.comment }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
