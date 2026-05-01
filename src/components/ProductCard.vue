<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { ShoppingCart, Heart } from 'lucide-vue-next'
import type { Product } from '../types'

defineProps<{
  product: Product
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
</script>

<template>
  <div
    class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative border border-gray-100 dark:border-gray-700 hover:border-olabits-blue/20 overflow-hidden"
  >
    <!-- Image Container -->
    <div class="relative h-56 overflow-hidden block bg-gray-50 dark:bg-gray-900">
      <RouterLink :to="`/product/${product.id}`" class="block w-full h-full">
        <img
          :src="product.image_url || ''"
          :alt="product.name"
          class="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700"
        />
      </RouterLink>

      <!-- Wishlist Toggle -->
      <button
        @click.stop="wishlist.toggleWishlist(product)"
        class="absolute top-4 left-4 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg hover:scale-110 transition-all active:scale-95 group/wish"
      >
        <Heart
          :size="16"
          :class="[
            wishlist.isInWishlist(product.id)
              ? 'fill-olabits-red text-olabits-red'
              : 'text-gray-400 group-hover/wish:text-olabits-red',
          ]"
        />
      </button>

      <!-- Discount Badge -->
      <div
        class="absolute top-4 right-4 bg-olabits-red text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter"
      >
        Save 15%
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <div class="mb-3">
        <RouterLink :to="`/product/${product.id}`" class="block">
          <h3
            class="text-[14px] font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-olabits-blue transition-colors"
          >
            {{ product.name }}
          </h3>
        </RouterLink>
      </div>

      <div class="mt-auto">
        <div class="flex flex-col mb-4">
          <span class="text-xl font-black text-olabits-wine dark:text-olabits-red">
            {{ formatCurrency(product.price) }}
          </span>
          <span class="text-[11px] text-gray-400 line-through font-bold">
            {{ formatCurrency(product.price * 1.15) }}
          </span>
        </div>

        <button
          @click="cart.addToCart(product)"
          :disabled="product.stock === 0"
          class="w-full flex items-center justify-center gap-2 bg-olabits-wine hover:bg-black text-white font-black py-3 rounded-xl shadow-lg shadow-rose-100 dark:shadow-none transition-all active:scale-95 text-[11px] uppercase tracking-widest disabled:bg-gray-200 dark:disabled:bg-gray-700"
        >
          <ShoppingCart :size="16" />
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>
