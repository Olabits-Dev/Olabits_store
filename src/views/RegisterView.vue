<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    await auth.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Registration failed.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-[80vh] flex items-center justify-center px-4 dark:bg-gray-900 transition-colors duration-300"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
    >
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Create Account
        </h2>
        <p
          class="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]"
        >
          Join Olabits Stores today
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-black text-center uppercase tracking-tight"
        >
          {{ error }}
        </div>

        <div class="space-y-1.5">
          <label
            class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
            >Full Name</label
          >
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-700 dark:text-white"
            placeholder="Official Full Name"
          />
        </div>

        <div class="space-y-1.5">
          <label
            class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-700 dark:text-white"
            placeholder="name@example.com"
          />
        </div>

        <div class="space-y-1.5">
          <label
            class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
            >Secure Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-olabits-wine hover:bg-black text-white font-black py-4 rounded-xl shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
        >
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p
        class="text-center mt-8 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-tight"
      >
        Already have an account?
        <RouterLink
          to="/login"
          class="text-olabits-blue hover:text-olabits-indigo underline underline-offset-4 ml-1"
          >Sign In</RouterLink
        >
      </p>
    </div>
  </div>
</template>
