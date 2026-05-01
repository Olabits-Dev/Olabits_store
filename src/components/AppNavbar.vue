<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import {
  ShoppingCart,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
  Search,
  Star,
  Package,
  Menu,
  X,
  Sun,
  Moon,
  Lock,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'

const auth = useAuthStore()
const cart = useCartStore()
const themeStore = useThemeStore()
const router = useRouter()

const isMenuOpen = ref(false)

const handleLogout = () => {
  auth.logout()
  isMenuOpen.value = false
  router.push('/login')
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="w-full z-[100] relative">
    <!-- Top Bar -->
    <div class="bg-olabits-wine py-1 px-4 text-white hidden md:block">
      <div
        class="max-w-[1184px] mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]"
      >
        <div class="flex items-center gap-4">
          <a
            href="#"
            class="flex items-center gap-1 hover:text-olabits-light transition-colors group"
          >
            <Star :size="10" class="group-hover:rotate-45 transition-transform" />
            Sell on Olabits
          </a>
        </div>
        <div class="flex items-center gap-6">
          <span class="text-white cursor-default border-b border-white pb-0.5">OLABITS STORE</span>
          <span class="opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
            >OLABITS PAY</span
          >
          <span class="opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
            >OLABITS LOGISTICS</span
          >
        </div>
      </div>
    </div>

    <!-- Main Nav -->
    <nav
      class="bg-white dark:bg-gray-900 shadow-md sticky top-0 py-3 md:py-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
    >
      <div class="max-w-[1184px] mx-auto px-4">
        <div class="flex items-center justify-between gap-4 md:gap-10">
          <!-- Mobile Menu Toggle & Logo -->
          <div class="flex items-center gap-3">
            <button @click="toggleMenu" class="md:hidden text-gray-700 dark:text-gray-200 p-1">
              <Menu v-if="!isMenuOpen" :size="24" />
              <X v-else :size="24" />
            </button>
            <RouterLink to="/" class="flex-shrink-0 group">
              <span
                class="text-lg md:text-xl font-black tracking-tighter text-olabits-indigo dark:text-olabits-light flex items-center gap-1"
              >
                OLABITS
                <span
                  class="text-olabits-red group-hover:scale-105 transition-transform inline-block"
                  >STORE</span
                >
              </span>
            </RouterLink>
          </div>

          <!-- Search -->
          <div class="hidden sm:flex flex-1 items-center max-w-2xl">
            <div class="relative flex-1 group">
              <Search
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-olabits-indigo transition-colors"
                :size="18"
              />
              <input
                type="text"
                placeholder="Search..."
                class="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-l-lg focus:border-olabits-indigo focus:ring-1 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-sm font-bold placeholder:text-gray-300"
              />
            </div>
            <button
              class="bg-olabits-wine hover:bg-black text-white px-4 md:px-8 py-2 rounded-r-lg font-black uppercase text-xs transition-all active:scale-95 border border-olabits-wine"
            >
              <span class="hidden md:inline">Search</span>
              <Search class="md:hidden" :size="18" />
            </button>
          </div>

          <!-- User Actions -->
          <div class="flex items-center gap-2 md:gap-4">
            <!-- Theme Toggle -->
            <button
              @click="themeStore.toggleTheme()"
              class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-gray-400"
              title="Toggle Theme"
            >
              <Sun v-if="themeStore.isDark" :size="20" />
              <Moon v-else :size="20" />
            </button>

            <!-- Account: Desktop -->
            <div class="relative group hidden md:block">
              <button
                class="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-black hover:text-olabits-indigo py-2 transition-colors"
              >
                <User :size="20" class="text-olabits-indigo" />
                <span class="text-[12px] uppercase">Account</span>
                <ChevronDown :size="14" class="text-gray-300" />
              </button>
              <div class="absolute right-0 top-full pt-2 hidden group-hover:block z-[110]">
                <div
                  class="bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 rounded-xl min-w-[240px] overflow-hidden"
                >
                  <template v-if="auth.isAuthenticated">
                    <div
                      class="px-5 py-4 bg-olabits-light/30 dark:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700"
                    >
                      <p
                        class="text-[9px] text-olabits-indigo dark:text-olabits-light font-black uppercase tracking-widest opacity-60"
                      >
                        Welcome back,
                      </p>
                      <p class="font-black text-gray-900 dark:text-white truncate mt-0.5">
                        {{ auth.user?.name }}
                      </p>
                    </div>
                    <div class="p-2">
                      <RouterLink
                        v-if="auth.user?.role === 'ADMIN'"
                        to="/admin"
                        class="flex items-center gap-3 px-4 py-2.5 hover:bg-olabits-light dark:hover:bg-gray-700 rounded-lg text-xs font-black text-olabits-indigo dark:text-olabits-light transition-colors mb-1"
                      >
                        <Lock :size="16" /> Admin Dashboard
                      </RouterLink>
                      <RouterLink
                        to="/profile"
                        class="flex items-center gap-3 px-4 py-2.5 hover:bg-olabits-light dark:hover:bg-gray-700 rounded-lg text-xs font-black text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        <User :size="16" class="text-olabits-indigo" /> My Profile
                      </RouterLink>
                      <RouterLink
                        to="/wishlist"
                        class="flex items-center gap-3 px-4 py-2.5 hover:bg-olabits-light dark:hover:bg-gray-700 rounded-lg text-xs font-black text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        <Heart :size="16" class="text-olabits-red" /> My Wishlist
                      </RouterLink>
                      <RouterLink
                        to="/orders"
                        class="flex items-center gap-3 px-4 py-2.5 hover:bg-olabits-light dark:hover:bg-gray-700 rounded-lg text-xs font-black text-gray-700 dark:text-gray-200 transition-colors"
                      >
                        <Package :size="16" class="text-olabits-blue" /> My Orders
                      </RouterLink>
                      <button
                        @click="handleLogout"
                        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-black text-olabits-red border-t border-gray-50 dark:border-gray-700 mt-1"
                      >
                        <LogOut :size="16" /> Sign Out
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="p-4 space-y-3">
                      <RouterLink
                        to="/login"
                        class="block w-full bg-olabits-wine hover:bg-black text-white text-center py-3 rounded-lg font-black text-xs shadow-xl shadow-rose-100 uppercase tracking-widest"
                      >
                        Sign In
                      </RouterLink>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Cart -->
            <RouterLink
              to="/cart"
              class="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-black hover:text-olabits-blue py-2 relative"
            >
              <div class="relative">
                <ShoppingCart :size="24" class="text-olabits-indigo dark:text-olabits-light" />
                <span
                  v-if="cart.totalItems > 0"
                  class="absolute -top-1.5 -right-1.5 bg-olabits-red text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm flex items-center justify-center min-w-[18px]"
                >
                  {{ cart.totalItems }}
                </span>
              </div>
              <span class="text-[12px] uppercase hidden sm:inline">Cart</span>
            </RouterLink>
          </div>
        </div>

        <!-- Mobile Search -->
        <div class="mt-3 sm:hidden flex items-center">
          <div class="relative flex-1 group">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" :size="16" />
            <input
              type="text"
              placeholder="Search products..."
              class="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="isMenuOpen" class="fixed inset-0 z-[120] md:hidden">
          <div class="absolute inset-0 bg-black/50" @click="toggleMenu"></div>
          <div
            class="absolute inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-colors duration-300"
          >
            <div class="p-6 bg-olabits-wine text-white flex items-center justify-between">
              <span class="font-black tracking-tighter uppercase">Olabits Menu</span>
              <button @click="toggleMenu"><X :size="20" /></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <template v-if="auth.isAuthenticated">
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Logged in as
                  </p>
                  <p class="font-black text-gray-900 dark:text-white truncate">
                    {{ auth.user?.name }}
                  </p>
                </div>
                <RouterLink
                  v-if="auth.user?.role === 'ADMIN'"
                  to="/admin"
                  @click="toggleMenu"
                  class="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-olabits-indigo dark:text-olabits-light"
                >
                  <Lock :size="20" /> Admin Panel
                </RouterLink>
                <RouterLink
                  to="/orders"
                  @click="toggleMenu"
                  class="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200"
                >
                  <Package :size="20" class="text-olabits-blue" /> My Orders
                </RouterLink>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-4 px-4 py-4 text-olabits-red font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                >
                  <LogOut :size="20" /> Sign Out
                </button>
              </template>
              <template v-else>
                <RouterLink
                  to="/login"
                  @click="toggleMenu"
                  class="block w-full bg-olabits-wine text-white text-center py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-rose-100"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  @click="toggleMenu"
                  class="block text-center text-sm font-bold text-olabits-blue mt-4"
                >
                  Create Account
                </RouterLink>
              </template>

              <div class="border-t border-gray-100 dark:border-gray-800 my-4 pt-4">
                <p
                  class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4"
                >
                  Explore Store
                </p>
                <RouterLink
                  to="/"
                  @click="toggleMenu"
                  class="flex items-center gap-4 px-4 py-3 font-bold text-gray-600 dark:text-gray-300"
                >
                  <Star :size="20" /> Home Gallery
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
