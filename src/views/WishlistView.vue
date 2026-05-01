<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlistStore } from '../stores/wishlist'
import ProductCard from '../components/ProductCard.vue'
import { Heart, RefreshCw } from 'lucide-vue-next'

const wishlistStore = useWishlistStore()

onMounted(() => {
  wishlistStore.fetchWishlist()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
    <div class="max-w-[1184px] mx-auto px-4">
      <div class="mb-10">
        <h1
          class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-4"
        >
          <Heart :size="32" class="text-olabits-red fill-current" />
          My Wishlist
        </h1>
        <p
          class="text-[10px] font-black text-olabits-indigo dark:text-olabits-light uppercase tracking-[0.2em] mt-2 italic"
        >
          Your curated collection of premium favorites
        </p>
      </div>

      <div v-if="wishlistStore.isLoading" class="flex flex-col items-center justify-center h-96">
        <RefreshCw :size="48" class="text-olabits-blue animate-spin mb-4" />
        <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">
          Syncing your favorites...
        </p>
      </div>

      <div
        v-else-if="wishlistStore.items.length === 0"
        class="bg-white dark:bg-gray-800 rounded-[3rem] p-16 md:p-24 text-center border border-gray-100 dark:border-gray-700 shadow-sm transition-colors"
      >
        <Heart :size="80" class="mx-auto text-gray-100 dark:text-gray-700 mb-8" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white uppercase">
          Your wishlist is empty
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-sm mx-auto">
          Start exploring our premium marketplace and save the items you love for later.
        </p>
        <RouterLink
          to="/"
          class="mt-10 inline-block bg-olabits-wine hover:bg-black text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95 uppercase tracking-widest text-sm"
          >Start Exploring</RouterLink
        >
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
      >
        <ProductCard v-for="product in wishlistStore.items" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>
