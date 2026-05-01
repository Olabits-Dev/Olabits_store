<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'
import { Zap, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 10

// Countdown logic
const timeLeft = ref({ hours: '00', mins: '00', secs: '00' })
const updateCountdown = () => {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  timeLeft.value = {
    hours: hours.toString().padStart(2, '0'),
    mins: mins.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0'),
  }
}

onMounted(() => {
  productStore.fetchProducts()
  updateCountdown()
  setInterval(updateCountdown, 1000)
})

const deals = computed(() => productStore.products.filter((_, index) => index % 3 === 0))

const totalPages = computed(() => Math.ceil(deals.value.length / itemsPerPage))

const paginatedDeals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return deals.value.slice(start, start + itemsPerPage)
})

const setPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header Hero -->
    <div
      class="bg-gradient-to-r from-olabits-wine via-olabits-red to-olabits-wine py-12 md:py-16 px-4 text-white text-center relative overflow-hidden"
    >
      <div class="absolute inset-0 opacity-10">
        <Zap :size="400" class="absolute -top-20 -left-20 rotate-12" />
        <Zap :size="300" class="absolute -bottom-20 -right-20 -rotate-12" />
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        <button
          @click="router.back()"
          class="absolute -top-6 left-0 flex items-center gap-2 text-white/60 hover:text-white font-bold transition-all uppercase text-[10px] tracking-widest group"
        >
          <ChevronLeft :size="18" class="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div
          class="inline-flex items-center gap-4 bg-white/10 px-6 py-2 rounded-2xl border border-white/20 mb-6 backdrop-blur-md"
        >
          <Zap :size="20" fill="white" class="animate-pulse" />
          <span class="font-black uppercase tracking-[0.2em] text-[10px]">Active Midnight Deals</span>
        </div>

        <h1 class="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8">
          Save up to 70%
        </h1>

        <!-- Timer -->
        <div class="flex justify-center items-center gap-4 md:gap-10">
          <div class="flex flex-col items-center">
            <span class="text-3xl md:text-6xl font-black tabular-nums">{{ timeLeft.hours }}</span>
            <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-2"
              >Hours</span
            >
          </div>
          <span class="text-3xl md:text-6xl font-light text-white/30">:</span>
          <div class="flex flex-col items-center">
            <span class="text-3xl md:text-6xl font-black tabular-nums">{{ timeLeft.mins }}</span>
            <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-2"
              >Minutes</span
            >
          </div>
          <span class="text-3xl md:text-6xl font-light text-white/30">:</span>
          <div class="flex flex-col items-center text-olabits-light">
            <span class="text-3xl md:text-6xl font-black tabular-nums">{{ timeLeft.secs }}</span>
            <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-2"
              >Seconds</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Marketplace Section -->
    <div class="max-w-[1184px] mx-auto px-4 -mt-8 relative z-20 pb-24">
      <div v-if="productStore.isLoading" class="bg-white dark:bg-gray-800 rounded-[2.5rem] p-24 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
          <RefreshCw :size="48" class="text-olabits-indigo animate-spin mx-auto mb-4" />
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Validating Deals...</p>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
      >
        <div
          class="px-6 md:px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/10"
        >
          <h2 class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Today's Selection</h2>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
            >{{ deals.length }} Exclusive Offers</span
          >
        </div>

        <div class="p-4 md:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          <ProductCard v-for="product in paginatedDeals" :key="product.id" :product="product" />
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="px-8 py-10 border-t border-gray-50 dark:border-gray-700 flex justify-center items-center gap-3">
          <button 
            @click="setPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-olabits-indigo disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft :size="20" />
          </button>
          
          <div class="flex items-center gap-2">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="setPage(page)"
              :class="[
                'w-10 h-10 rounded-xl font-black text-xs transition-all shadow-sm',
                currentPage === page 
                  ? 'bg-olabits-wine text-white shadow-rose-100 dark:shadow-none' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-olabits-light dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button 
            @click="setPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-olabits-indigo disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
