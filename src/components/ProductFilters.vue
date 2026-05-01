<script setup lang="ts">
import { useProductStore } from '../stores/product'
import { Search, FilterX } from 'lucide-vue-next'

const productStore = useProductStore()
</script>

<template>
  <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-8">
    <!-- Search -->
    <div>
      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider"
        >Search</label
      >
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
        <input
          v-model="productStore.searchQuery"
          type="text"
          placeholder="What are you looking for?"
          class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        />
      </div>
    </div>

    <!-- Categories -->
    <div>
      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider"
        >Category</label
      >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in productStore.categories"
          :key="category"
          @click="productStore.selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm',
            productStore.selectedCategory === category
              ? 'bg-olabits-indigo text-white shadow-indigo-100'
              : 'bg-gray-50 text-gray-500 hover:bg-olabits-light hover:text-olabits-indigo',
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <label class="text-sm font-bold text-gray-900 uppercase tracking-wider">Max Price</label>
        <span class="text-olabits-wine font-black">${{ productStore.maxPrice }}</span>
      </div>
      <input
        v-model.number="productStore.maxPrice"
        type="range"
        min="0"
        max="3000"
        step="50"
        class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-olabits-indigo"
      />
      <div
        class="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter"
      >
        <span>$0</span>
        <span>$3000+</span>
      </div>
    </div>

    <!-- Reset -->
    <button
      @click="productStore.resetFilters()"
      class="w-full flex items-center justify-center gap-2 py-4 text-gray-400 hover:text-olabits-red font-black text-[10px] uppercase tracking-[0.2em] transition-colors border-t border-gray-50"
    >
      <FilterX :size="16" />
      Clear All Filters
    </button>
  </div>
</template>
