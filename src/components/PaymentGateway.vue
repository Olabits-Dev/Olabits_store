<script setup lang="ts">
import { ref } from 'vue'
import { CreditCard, Lock, ShieldCheck } from 'lucide-vue-next'

const emit = defineEmits(['payment-success', 'payment-cancel'])
defineProps<{ amount: number }>()

const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const cardName = ref('')
const isProcessing = ref(false)

const handlePayment = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    emit('payment-success')
  }, 2000)
}
</script>

<template>
  <div
    class="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 max-w-md mx-auto relative overflow-hidden"
  >
    <!-- Design Element -->
    <div class="absolute -top-12 -right-12 w-32 h-32 bg-olabits-indigo/5 rounded-full"></div>

    <div class="text-center mb-10 relative z-10">
      <div
        class="inline-flex items-center justify-center w-20 h-20 bg-olabits-indigo/10 text-olabits-indigo rounded-3xl mb-6"
      >
        <CreditCard :size="40" />
      </div>
      <h2 class="text-3xl font-black text-gray-900 leading-tight">Secure Payment</h2>
      <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
        Payable Amount
      </p>
      <p class="text-3xl font-black text-olabits-wine mt-1">${{ amount.toFixed(2) }}</p>
    </div>

    <form @submit.prevent="handlePayment" class="space-y-6 relative z-10">
      <div class="space-y-1.5">
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
          >Cardholder Name</label
        >
        <input
          v-model="cardName"
          type="text"
          required
          placeholder="Full Name on Card"
          class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white outline-none transition-all font-bold text-gray-700"
        />
      </div>

      <div class="space-y-1.5">
        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
          >Card Number</label
        >
        <div class="relative">
          <input
            v-model="cardNumber"
            type="text"
            required
            placeholder="0000 0000 0000 0000"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white outline-none transition-all font-bold text-gray-700"
          />
          <Lock class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" :size="20" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >Expiry</label
          >
          <input
            v-model="expiry"
            type="text"
            required
            placeholder="MM/YY"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white outline-none transition-all font-bold text-center text-gray-700"
          />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >CVV</label
          >
          <input
            v-model="cvv"
            type="password"
            required
            placeholder="***"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white outline-none transition-all font-bold text-center text-gray-700"
          />
        </div>
      </div>

      <div class="pt-6">
        <button
          type="submit"
          :disabled="isProcessing"
          class="w-full bg-olabits-wine hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-100 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
        >
          <span v-if="isProcessing" class="flex items-center gap-2">
            <svg class="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
          <span v-else class="uppercase tracking-widest text-sm">Secure Payment</span>
        </button>
      </div>

      <div class="flex items-center justify-center gap-2 text-gray-400 mt-6">
        <ShieldCheck :size="18" class="text-olabits-indigo" />
        <span class="text-[9px] font-black uppercase tracking-[0.2em]"
          >Validated by Olabits Financial</span
        >
      </div>
    </form>
  </div>
</template>
