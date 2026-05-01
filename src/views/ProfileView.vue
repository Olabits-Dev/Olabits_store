<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { User, Mail, Lock, Save, CheckCircle } from 'lucide-vue-next'
import axios from 'axios'

const auth = useAuthStore()

const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleUpdate = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const data: Record<string, string> = { 
      name: name.value, 
      email: email.value
    }
    if (password.value) {
      data.password = password.value
    }
    await auth.updateProfile(data)
    message.value = 'Profile updated successfully!'
    password.value = ''
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Update failed.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
    <div class="max-w-2xl mx-auto px-4">
      <div class="mb-10">
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          User Profile
        </h1>
        <p
          class="text-[10px] font-black text-olabits-indigo dark:text-olabits-light uppercase tracking-[0.2em] mt-2 italic"
        >
          Manage your account credentials
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div class="p-8 md:p-12">
          <form @submit.prevent="handleUpdate" class="space-y-8">
            <div
              v-if="message"
              class="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-5 rounded-2xl flex items-center gap-3 border border-green-100 dark:border-green-900/30"
            >
              <CheckCircle :size="20" />
              <span class="text-xs font-black uppercase tracking-widest">{{ message }}</span>
            </div>

            <div
              v-if="error"
              class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30"
            >
              {{ error }}
            </div>

            <!-- Name -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
              >
                <User :size="14" /> Official Name
              </label>
              <input
                v-model="name"
                type="text"
                required
                class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
              >
                <Mail :size="14" /> Email Address
              </label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner"
              />
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label
                class="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1"
              >
                <Lock :size="14" /> New Password (Leave blank to keep current)
              </label>
              <input
                v-model="password"
                type="password"
                class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-olabits-wine hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
              >
                <Save v-if="!loading" :size="20" />
                <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                {{ loading ? 'Saving...' : 'Update Profile Details' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
