<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { Package } from 'lucide-vue-next'
import type { Order } from '../types'

const auth = useAuthStore()
const orders = ref<Order[]>([])
const loading = ref(true)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api'

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    orders.value = response.data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING:
      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900/30',
    DELIVERED:
      'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-500 border-green-200 dark:border-green-900/30',
    SHIPPED:
      'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 border-blue-200 dark:border-blue-900/30',
    CANCELLED:
      'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-500 border-red-200 dark:border-red-900/30',
  }
  return colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          Order History
        </h1>
        <p
          class="mt-2 text-gray-600 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest"
        >
          Track and manage your recent purchases.
        </p>
      </div>

      <div v-if="loading" class="space-y-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-40 bg-white dark:bg-gray-800 animate-pulse rounded-3xl border border-gray-100 dark:border-gray-700"
        ></div>
      </div>

      <div
        v-else-if="orders.length === 0"
        class="bg-white dark:bg-gray-800 rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-gray-700 shadow-sm"
      >
        <Package :size="64" class="mx-auto text-gray-200 dark:text-gray-700 mb-6" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white uppercase">No orders yet</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          When you buy something, it will appear here!
        </p>
        <RouterLink
          to="/"
          class="mt-8 inline-block bg-olabits-wine hover:bg-black text-white px-10 py-3.5 rounded-2xl font-black shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95 uppercase tracking-widest text-xs"
          >Start Shopping</RouterLink
        >
      </div>

      <div v-else class="space-y-8">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all"
        >
          <!-- Order Header -->
          <div
            class="bg-gray-50/50 dark:bg-gray-900/50 px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-8">
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Order ID
                </p>
                <p class="font-black text-gray-900 dark:text-white text-sm tracking-tight">
                  #LAB-{{ order.id.toString().padStart(6, '0') }}
                </p>
              </div>
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Placed On
                </p>
                <p class="font-black text-gray-700 dark:text-gray-300 text-sm">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>

            <div
              :class="[
                'px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-tighter transition-colors',
                getStatusColor(order.status),
              ]"
            >
              {{ order.status }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-8 py-6">
            <div class="flex flex-col gap-6">
              <div
                v-for="item in order.orderItems"
                :key="item.id"
                class="flex items-center justify-between group"
              >
                <div class="flex items-center gap-5">
                  <div
                    class="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-1 flex-shrink-0"
                  >
                    <img :src="item.product.image_url || ''" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      {{ item.product.name }}
                    </p>
                    <p
                      class="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1"
                    >
                      Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <span class="font-black text-gray-900 dark:text-white"
                  >${{ (item.quantity * item.price).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div
            class="px-8 py-5 bg-gray-50/30 dark:bg-gray-900/20 flex justify-between items-center border-t border-gray-50 dark:border-gray-700"
          >
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Total Amount Paid
            </p>
            <p class="text-2xl font-black text-olabits-wine dark:text-olabits-red">
              ${{ order.total.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
