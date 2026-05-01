<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-vue-next'
import PaymentGateway from '../components/PaymentGateway.vue'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const showPayment = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const startCheckout = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  showPayment.value = true
}

const API_URL = import.meta.env.VITE_API_URL || '${API_URL}'

const handleFinalOrder = async () => {
  loading.value = true
  error.value = ''

  try {
    await axios.post(
      `${API_URL}/orders`,
      {
        items: cart.items,
        total: cart.totalPrice,
      },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      },
    )

    cart.clearCart()
    success.value = true
    showPayment.value = false
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Order failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
    showPayment.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-colors duration-300">
    <!-- Success State -->
    <div
      v-if="success"
      class="text-center py-16 md:py-24 bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto px-4"
    >
      <div
        class="w-20 h-20 md:w-24 md:h-24 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ArrowRight :size="48" />
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
        Order Placed!
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg">
        Redirecting to your order history...
      </p>
    </div>

    <template v-else>
      <!-- Payment Step -->
      <div v-if="showPayment" class="px-2">
        <button
          @click="showPayment = false"
          class="mb-8 flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:text-olabits-blue transition-colors"
        >
          <ChevronLeft :size="20" />
          Back to Cart Review
        </button>
        <PaymentGateway :amount="cart.totalPrice" @payment-success="handleFinalOrder" />
      </div>

      <!-- Cart Content -->
      <template v-else>
        <h1
          class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 md:mb-12 px-2"
        >
          Your Cart
        </h1>

        <div
          v-if="cart.items.length === 0"
          class="text-center py-16 md:py-24 bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 mx-2 transition-colors"
        >
          <ShoppingBag :size="64" class="mx-auto text-gray-100 dark:text-gray-700 mb-6" />
          <p class="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-500 px-4">
            Your basket is currently empty
          </p>
          <RouterLink
            to="/"
            class="mt-8 inline-block bg-olabits-wine hover:bg-black text-white px-8 md:px-10 py-4 rounded-2xl font-black shadow-xl shadow-rose-100 dark:shadow-none transition-all uppercase tracking-widest text-xs md:text-sm"
          >
            Discover Products
          </RouterLink>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Items List -->
          <div class="flex-1 space-y-4 md:space-y-6">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-md transition-all relative"
            >
              <div
                class="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0 mb-4 sm:mb-0"
              >
                <img
                  :src="item.image_url || ''"
                  :alt="item.name"
                  class="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div class="sm:ml-8 flex-1 w-full text-center sm:text-left">
                <div class="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div class="w-full sm:w-auto">
                    <h3
                      class="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-1"
                    >
                      {{ item.name }}
                    </h3>
                    <p
                      class="text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1"
                    >
                      {{ item.category }}
                    </p>
                  </div>
                  <button
                    @click="cart.removeFromCart(item.id)"
                    class="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 text-gray-300 dark:text-gray-600 hover:text-olabits-red transition-all"
                  >
                    <Trash2 :size="20" />
                  </button>
                </div>

                <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span
                    class="text-xl md:text-2xl font-black text-olabits-wine dark:text-olabits-red"
                    >${{ item.price.toFixed(2) }}</span
                  >

                  <!-- Quantity Control -->
                  <div
                    class="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-1.5 border border-gray-100 dark:border-gray-700 shadow-inner"
                  >
                    <button
                      @click="cart.updateQuantity(item.id, item.quantity - 1)"
                      class="p-3 md:p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all text-gray-600 dark:text-gray-400"
                    >
                      <Minus :size="20" />
                    </button>
                    <span
                      class="font-black text-gray-900 dark:text-white w-12 text-center text-lg"
                      >{{ item.quantity }}</span
                    >
                    <button
                      @click="cart.updateQuantity(item.id, item.quantity + 1)"
                      class="p-3 md:p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all text-gray-600 dark:text-gray-400"
                    >
                      <Plus :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="lg:w-[400px] w-full">
            <div
              class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 h-fit lg:sticky lg:top-24 transition-colors"
            >
              <h2
                class="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6 md:mb-8 uppercase tracking-tighter"
              >
                Summary
              </h2>

              <div class="space-y-4 text-gray-500 dark:text-gray-400 font-bold text-sm">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="text-gray-900 dark:text-white"
                    >${{ cart.totalPrice.toFixed(2) }}</span
                  >
                </div>
                <div class="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-4">
                  <span>Standard Shipping</span>
                  <span class="text-green-500 font-black uppercase text-[10px]">Free</span>
                </div>
                <div
                  class="pt-4 flex justify-between text-2xl md:text-3xl font-black text-gray-900 dark:text-white"
                >
                  <span>Total</span>
                  <span class="text-olabits-wine dark:text-olabits-red"
                    >${{ cart.totalPrice.toFixed(2) }}</span
                  >
                </div>
              </div>

              <button
                @click="startCheckout"
                class="w-full mt-8 md:mt-10 bg-olabits-wine hover:bg-black text-white font-black py-5 md:py-6 rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest text-xs md:text-sm"
              >
                Proceed to Checkout
                <ArrowRight :size="20" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
