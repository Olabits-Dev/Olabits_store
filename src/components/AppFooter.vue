<script setup lang="ts">
import { ref } from 'vue'
import { 
  Facebook, Twitter, Instagram, Send, 
  ShieldCheck, Headphones, Star 
} from 'lucide-vue-next'

const email = ref('')

const handleSubscribe = () => {
  if (!email.value) return
  alert(`Thank you for subscribing, ${email.value}! You'll receive our next promotion soon.`)
  email.value = ''
}
</script>

<template>
  <footer class="bg-gray-950 text-gray-400 pt-12 md:pt-16 pb-8 transition-colors duration-300">
    <div class="max-w-[1184px] mx-auto px-4">
      
      <!-- Top Section: Optimized Responsive Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
        
        <!-- Column 1: Brand & About -->
        <div class="space-y-4 md:space-y-6">
          <RouterLink to="/" class="inline-block">
            <span class="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center gap-1">
              OLABITS <span class="text-olabits-red">STORE</span>
            </span>
          </RouterLink>
          <p class="text-xs md:text-sm leading-relaxed font-medium max-w-xs">
            Premium products delivered with speed and security. Quality you can trust.
          </p>
          <div class="flex items-center gap-3 md:gap-4">
            <a href="#" class="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-olabits-indigo hover:text-white transition-all">
              <Facebook :size="16" />
            </a>
            <a href="#" class="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-olabits-blue hover:text-white transition-all">
              <Twitter :size="16" />
            </a>
            <a href="#" class="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-olabits-red hover:text-white transition-all">
              <Instagram :size="16" />
            </a>
          </div>
        </div>

        <!-- Column 2: Quick Links (Side-by-side with Column 3 on small tablets) -->
        <div>
          <h4 class="text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.25em] mb-4 md:mb-8 italic">Support</h4>
          <ul class="space-y-3 md:space-y-4 text-xs md:text-sm font-bold">
            <li><RouterLink to="/orders" class="hover:text-olabits-blue transition-colors">Track Order</RouterLink></li>
            <li><a href="#" class="hover:text-olabits-blue transition-colors">Return Policy</a></li>
            <li><a href="#" class="hover:text-olabits-blue transition-colors">Help & FAQs</a></li>
          </ul>
        </div>

        <!-- Column 3: Top Categories -->
        <div class="hidden sm:block">
          <h4 class="text-white font-black uppercase text-[10px] tracking-[0.25em] mb-8 italic">Categories</h4>
          <ul class="space-y-4 text-sm font-bold">
            <li><button @click="$router.push('/')" class="hover:text-olabits-indigo transition-colors uppercase tracking-tight">Gadgets</button></li>
            <li><button @click="$router.push('/')" class="hover:text-olabits-indigo transition-colors uppercase tracking-tight">Laptops</button></li>
            <li><button @click="$router.push('/')" class="hover:text-olabits-indigo transition-colors uppercase tracking-tight">Fashion</button></li>
          </ul>
        </div>

        <!-- Column 4: Newsletter -->
        <div class="space-y-4 md:space-y-6">
          <h4 class="text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.25em] mb-4 md:mb-8 italic">Newsletter</h4>
          <form @submit.prevent="handleSubscribe" class="space-y-2">
            <input 
              v-model="email"
              type="email" 
              placeholder="Your Email" 
              class="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-olabits-indigo text-xs md:text-sm font-bold text-white transition-all"
            />
            <button 
              type="submit"
              class="w-full bg-olabits-wine hover:bg-black text-white font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[9px]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Trust Badges: Compact Grid on Mobile -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8 border-y border-gray-900/50 mb-8">
         <div class="flex items-center gap-2 md:gap-3">
            <ShieldCheck :size="18" class="text-olabits-blue" />
            <p class="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Secure Pay</p>
         </div>
         <div class="flex items-center gap-2 md:gap-3">
            <Send :size="18" class="text-olabits-indigo" />
            <p class="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Fast Ship</p>
         </div>
         <div class="flex items-center gap-2 md:gap-3">
            <Headphones :size="18" class="text-olabits-red" />
            <p class="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Support</p>
         </div>
         <div class="flex items-center gap-2 md:gap-3">
            <Star :size="18" class="text-olabits-wine" />
            <p class="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Quality</p>
         </div>
      </div>

      <!-- Bottom Bar: Stacked on mobile -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 Olabits Store.
        </p>
        
        <!-- Simplified Payment Icons -->
        <div class="flex items-center gap-3 md:gap-4 grayscale opacity-40">
           <div class="bg-white px-1.5 py-0.5 rounded text-black font-black italic text-[8px]">VISA</div>
           <div class="bg-white px-1.5 py-0.5 rounded text-black font-black italic text-[8px]">MC</div>
           <div class="bg-white px-1.5 py-0.5 rounded text-olabits-wine font-black text-[8px]">PS</div>
           <div class="bg-white px-1.5 py-0.5 rounded text-olabits-blue font-black text-[8px]">STRIPE</div>
        </div>
      </div>
    </div>
  </footer>
</template>
