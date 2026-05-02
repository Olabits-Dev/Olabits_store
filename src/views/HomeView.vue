<script setup lang="ts">
import { onMounted, computed, ref, type Component } from 'vue'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'
import {
  Smartphone,
  Monitor,
  Home,
  Shirt,
  ShoppingBasket,
  MoreHorizontal,
  PhoneCall,
  Truck,
  Zap,
  ChevronRight,
  Clock,
  Target,
  Tablet,
  Star,
} from 'lucide-vue-next'

const productStore = useProductStore()

// --- COUNTDOWN LOGIC ---
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

// Dynamic categories with icons
const categoryIconMap: Record<string, Component> = {
  beauty: ShoppingBasket,
  fragrances: Zap,
  furniture: Home,
  groceries: ShoppingBasket,
  'home-decoration': Home,
  'kitchen-accessories': Monitor,
  laptops: Monitor,
  'mens-shirts': Shirt,
  'mens-shoes': Smartphone,
  'mens-watches': Clock,
  'mobile-accessories': Smartphone,
  motorcycle: Truck,
  'skin-care': ShoppingBasket,
  smartphones: Smartphone,
  'sports-accessories': Target,
  sunglasses: Target,
  tablets: Tablet,
  tops: Shirt,
  vehicle: Truck,
  'womens-bags': ShoppingBasket,
  'womens-dresses': Shirt,
  'womens-jewellery': Star,
  'womens-shoes': Smartphone,
  'womens-watches': Clock,
}

const displayCategories = computed(() => {
  return productStore.categories
    .filter((c) => c !== 'All')
    .map((name) => ({
      name,
      icon: categoryIconMap[name.toLowerCase()] || MoreHorizontal,
    }))
})

const flashSaleProducts = computed(() => productStore.products.slice(0, 6))
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12 transition-colors duration-300">
    <div class="max-w-[1184px] mx-auto px-4 pt-4">
      <!-- Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <!-- Left Sidebar -->
        <aside
          class="hidden md:block md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden py-3 h-fit"
        >
          <nav class="flex flex-col h-full">
            <button
              v-for="link in displayCategories"
              :key="link.name"
              @click="productStore.selectedCategory = link.name"
              :class="[
                'flex items-center gap-3 px-5 py-2.5 text-[12px] font-bold transition-all group border-l-4 capitalize',
                productStore.selectedCategory === link.name
                  ? 'text-olabits-indigo bg-olabits-light dark:bg-indigo-900/20 border-olabits-indigo'
                  : 'text-gray-600 dark:text-gray-400 hover:text-olabits-blue dark:hover:text-white hover:bg-olabits-light dark:hover:bg-gray-700 border-transparent',
              ]"
            >
              <component
                :is="link.icon"
                :size="16"
                :class="
                  productStore.selectedCategory === link.name
                    ? 'text-olabits-indigo'
                    : 'text-gray-400 group-hover:text-olabits-blue'
                "
              />
              {{ link.name.replace(/-/g, ' ') }}
            </button>
          </nav>
        </aside>

        <!-- Center: Hero -->
        <main
          class="col-span-1 md:col-span-6 rounded-xl shadow-lg overflow-hidden relative border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 group/hero flex items-center justify-center min-h-[200px] md:min-h-[384px]"
        >
          <video
            autoplay
            muted
            loop
            playsinline
            poster="/image copy.png"
            class="w-full h-full object-contain bg-gray-50 dark:bg-gray-900"
          >
            <source src="/videomp_.mp4" type="video/mp4" />
          </video>
          <div
            class="absolute inset-0 bg-gradient-to-t from-olabits-wine/40 to-transparent opacity-60"
          ></div>
        </main>

        <!-- Right Side -->
        <aside class="hidden md:flex md:col-span-3 flex-col gap-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex-1 flex flex-col gap-5 border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-4 group cursor-pointer">
              <div
                class="w-12 h-12 bg-olabits-blue/10 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-olabits-blue group-hover:bg-olabits-blue group-hover:text-white transition-all"
              >
                <PhoneCall :size="22" />
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  Order Line
                </p>
                <p class="text-sm font-black text-gray-900 dark:text-white">0800-OLABITS</p>
              </div>
            </div>
            <div class="flex items-center gap-4 group cursor-pointer">
              <div
                class="w-12 h-12 bg-olabits-red/10 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-olabits-red group-hover:bg-olabits-red group-hover:text-white transition-all"
              >
                <Truck :size="22" />
              </div>
              <p class="text-sm font-black text-gray-800 dark:text-gray-200">Fast Delivery</p>
            </div>
          </div>
          <div
            class="bg-gradient-to-br from-olabits-indigo via-olabits-blue to-olabits-indigo rounded-xl shadow-xl flex-1 overflow-hidden relative group cursor-pointer p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-indigo-300/50"
          >
            <div
              class="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700"
            >
              <Star :size="80" fill="white" />
            </div>
            <div class="relative z-10">
              <span class="text-white font-black text-2xl tracking-tighter italic leading-none"
                >OLABITS <br />
                FORCE</span
              >
              <p
                class="text-white/90 text-[10px] font-black mt-3 uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full border border-white/10"
              >
                Join the Elite
              </p>
              <button
                class="mt-6 bg-white text-olabits-indigo text-[10px] font-black uppercase px-4 py-2 rounded-lg shadow-lg hover:bg-olabits-light transition-all transform group-hover:scale-105 active:scale-95"
              >
                Join Now
              </button>
              <p class="text-white/60 text-[8px] font-bold mt-3 uppercase tracking-widest">
                Earn 5% Commission
              </p>
            </div>
          </div>
        </aside>
      </div>

      <!-- Flash Sales -->
      <section
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700 transition-colors"
      >
        <div
          class="bg-gradient-to-r from-olabits-wine via-olabits-red to-olabits-wine px-4 md:px-6 py-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-white"
        >
          <div class="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-8">
            <div
              class="flex items-center gap-3 font-black uppercase tracking-tighter text-lg md:text-2xl italic"
            >
              <div
                class="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0"
              >
                <Zap :size="24" fill="white" class="animate-pulse" />
              </div>
              <span class="whitespace-nowrap">Midnight Deals</span>
            </div>
            
            <!-- Timer - now visible on smaller screens but smaller -->
            <div
              class="flex items-center gap-3 md:gap-4 text-[11px] md:text-sm font-black bg-black/30 px-4 md:px-6 py-2 rounded-2xl border border-white/10 shadow-inner w-fit"
            >
              <div class="flex flex-col items-center leading-none">
                <span class="text-[8px] md:text-[10px] text-white/50 mb-1 uppercase">Hours</span>
                <span class="text-base md:text-xl tabular-nums">{{ timeLeft.hours }}</span>
              </div>
              <span class="text-white/30 text-lg md:text-2xl font-light">:</span>
              <div class="flex flex-col items-center leading-none">
                <span class="text-[8px] md:text-[10px] text-white/50 mb-1 uppercase">Mins</span>
                <span class="text-base md:text-xl tabular-nums">{{ timeLeft.mins }}</span>
              </div>
              <span class="text-white/30 text-lg md:text-2xl font-light">:</span>
              <div class="flex flex-col items-center leading-none">
                <span class="text-[8px] md:text-[10px] text-white/50 mb-1 uppercase">Secs</span>
                <span class="text-base md:text-xl tabular-nums text-olabits-light">{{ timeLeft.secs }}</span>
              </div>
            </div>
          </div>
          <RouterLink
            to="/deals"
            class="text-[10px] font-black flex items-center justify-center gap-2 bg-white text-olabits-wine px-6 py-3 rounded-xl hover:bg-olabits-light transition-all uppercase tracking-widest shadow-2xl active:scale-95 flex-shrink-0 sm:w-auto w-full"
          >
            All Deals <ChevronRight :size="16" />
          </RouterLink>
        </div>

        <div class="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          <div v-for="product in flashSaleProducts" :key="product.id" class="group">
            <RouterLink :to="`/product/${product.id}`">
              <div
                class="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
              >
                <img
                  :src="product.image_url || ''"
                  class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  class="absolute top-3 right-3 bg-olabits-red text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg"
                >
                  -35%
                </div>
              </div>
              <h3
                class="text-[13px] text-gray-700 dark:text-gray-200 line-clamp-2 leading-tight font-bold group-hover:text-olabits-blue transition-colors"
              >
                {{ product.name }}
              </h3>
              <p class="font-black text-[16px] text-olabits-wine dark:text-olabits-red mt-1.5">
                ${{ product.price }}
              </p>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Main Marketplace Grid -->
      <section>
        <div
          class="bg-white dark:bg-gray-800 px-4 md:px-8 py-5 rounded-t-2xl border-b-2 border-olabits-indigo/10 dark:border-gray-700 flex justify-between items-center shadow-sm"
        >
          <h2
            class="text-lg md:text-2xl font-black text-olabits-indigo dark:text-olabits-light uppercase tracking-tighter"
          >
            Marketplace
          </h2>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest"
            >{{ productStore.filteredProducts.length }} Items Available</span
          >
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-b-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
        >
          <ProductCard
            v-for="product in productStore.paginatedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="productStore.totalPages > 1"
          class="mt-12 flex justify-center items-center gap-3"
        >
          <button
            @click="productStore.setPage(productStore.currentPage - 1)"
            :disabled="productStore.currentPage === 1"
            class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-olabits-indigo disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft :size="20" />
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="page in productStore.totalPages"
              :key="page"
              @click="productStore.setPage(page)"
              :class="[
                'w-10 h-10 rounded-xl font-black text-xs transition-all shadow-sm',
                productStore.currentPage === page
                  ? 'bg-olabits-wine text-white shadow-rose-100 dark:shadow-none'
                  : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-olabits-light dark:hover:bg-gray-700',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="productStore.setPage(productStore.currentPage + 1)"
            :disabled="productStore.currentPage === productStore.totalPages"
            class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-olabits-indigo disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
