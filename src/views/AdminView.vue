<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { 
  Package, ShoppingCart, Plus, Edit, Trash2, 
  CheckCircle, XCircle, Clock, Save, X, Lock,
  ChevronDown, ChevronRight, Layers
} from 'lucide-vue-next'
import type { Product, Order } from '../types'

const auth = useAuthStore()
const activeTab = ref<'products' | 'orders'>('products')

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api'

// Products State
const products = ref<Product[]>([])
const isProductModalOpen = ref(false)
const editingProduct = ref<Partial<Product> | null>(null)
const productLoading = ref(false)

// UI State
const expandedCategories = ref<Record<string, boolean>>({})

// Orders State
const orders = ref<Order[]>([])
const orderLoading = ref(false)

const fetchData = async () => {
  productLoading.value = true
  orderLoading.value = true
  try {
    const [prodRes, orderRes] = await Promise.all([
      axios.get(`${API_URL}/admin/products`, { headers: { Authorization: `Bearer ${auth.token}` } }),
      axios.get(`${API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${auth.token}` } })
    ])
    products.value = prodRes.data
    orders.value = orderRes.data
    
    // Initialize all categories as expanded
    const groups = Object.keys(groupedProducts.value)
    groups.forEach(cat => {
      if (expandedCategories.value[cat] === undefined) {
        expandedCategories.value[cat] = true
      }
    })
  } catch (error) {
    console.error('Failed to fetch admin data:', error)
  } finally {
    productLoading.value = false
    orderLoading.value = false
  }
}

onMounted(fetchData)

// --- GROUPING LOGIC ---
const groupedProducts = computed(() => {
  const groups: Record<string, Product[]> = {}
  products.value.forEach((product) => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category]!.push(product)
  })
  return groups
})

const toggleCategory = (category: string) => {
  expandedCategories.value[category] = !expandedCategories.value[category]
}

// --- PRODUCT ACTIONS ---
const openProductModal = (product: Product | null = null) => {
  editingProduct.value = product ? { ...product } : { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' }
  isProductModalOpen.value = true
}

const saveProduct = async () => {
  try {
    if (editingProduct.value?.id) {
      await axios.put(`${API_URL}/admin/products/${editingProduct.value.id}`, editingProduct.value, { headers: { Authorization: `Bearer ${auth.token}` } })
    } else {
      await axios.post(`${API_URL}/admin/products`, editingProduct.value, { headers: { Authorization: `Bearer ${auth.token}` } })
    }
    isProductModalOpen.value = false
    fetchData()
  } catch (error) {
    alert('Failed to save product')
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await axios.delete(`${API_URL}/admin/products/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } })
    fetchData()
  } catch (error) {
    alert('Failed to delete product')
  }
}

// --- ORDER ACTIONS ---
const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    await axios.put(`${API_URL}/admin/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${auth.token}` } })
    fetchData()
  } catch (error) {
    alert('Failed to update status')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Admin Panel</h1>
          <p class="text-[10px] font-black text-olabits-indigo dark:text-olabits-light uppercase tracking-[0.2em] mt-2 italic">Control center for Olabits Store</p>
        </div>

        <div class="flex bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
          <button 
            @click="activeTab = 'products'"
            :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'products' ? 'bg-olabits-indigo text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-gray-500 hover:text-olabits-indigo dark:text-gray-400']"
          >
            Inventory
          </button>
          <button 
            @click="activeTab = 'orders'"
            :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'orders' ? 'bg-olabits-indigo text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-gray-500 hover:text-olabits-indigo dark:text-gray-400']"
          >
            Shipments
          </button>
        </div>
      </div>

      <!-- --- PRODUCTS TAB (GROUPED) --- -->
      <div v-if="activeTab === 'products'" class="space-y-10">
        <div class="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
           <div class="flex items-center gap-4 text-olabits-wine dark:text-olabits-red">
              <Layers :size="24" />
              <span class="text-sm font-black uppercase tracking-widest">{{ Object.keys(groupedProducts).length }} active categories</span>
           </div>
           <button @click="openProductModal()" class="flex items-center gap-2 bg-olabits-wine hover:bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95">
            <Plus :size="18" /> New Product
          </button>
        </div>

        <!-- Iterating through Categories -->
        <div v-for="(categoryProducts, categoryName) in groupedProducts" :key="categoryName" class="space-y-4">
          <!-- Category Header -->
          <button 
            @click="toggleCategory(categoryName as string)"
            class="w-full flex items-center justify-between bg-white dark:bg-gray-800 px-8 py-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-olabits-indigo/10 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-olabits-indigo dark:text-olabits-light">
                <ChevronDown v-if="expandedCategories[categoryName as string]" :size="20" />
                <ChevronRight v-else :size="20" />
              </div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight capitalize">{{ (categoryName as string).replace(/-/g, ' ') }}</h3>
              <span class="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {{ categoryProducts.length }} Items
              </span>
            </div>
            <div class="hidden md:flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <span>Avg. Price: {{ formatCurrency(categoryProducts.reduce((s, p) => s + p.price, 0) / categoryProducts.length) }}</span>
               <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
               <span>Total Stock: {{ categoryProducts.reduce((s, p) => s + p.stock, 0) }} units</span>
            </div>
          </button>

          <!-- Category Content (Table) -->
          <div v-if="expandedCategories[categoryName as string]" class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto transition-all animate-in slide-in-from-top-2 duration-300">
            <table class="w-full text-left min-w-[800px]">
              <thead class="bg-gray-50 dark:bg-gray-900/50 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th class="px-8 py-5">Item Details</th>
                  <th class="px-8 py-5">Price Point</th>
                  <th class="px-8 py-5">Warehouse</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                <tr v-for="product in categoryProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-700 p-1 flex-shrink-0">
                        <img :src="product.image_url || ''" class="w-full h-full object-contain" />
                      </div>
                      <span class="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[300px]">{{ product.name }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-5 font-black text-olabits-wine dark:text-olabits-red">{{ formatCurrency(product.price) }}</td>
                  <td class="px-8 py-5">
                    <span :class="['px-2.5 py-1 rounded-lg text-[9px] font-black uppercase', product.stock < 10 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400']">
                      {{ product.stock }} in stock
                    </span>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div class="flex justify-end gap-3">
                      <button @click="openProductModal(product)" class="p-2 text-gray-400 hover:text-olabits-indigo transition-colors">
                        <Edit :size="18" />
                      </button>
                      <button @click="deleteProduct(product.id)" class="p-2 text-gray-400 hover:text-olabits-red transition-colors">
                        <Trash2 :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- --- ORDERS TAB --- -->
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
          <div class="px-6 md:px-8 py-4 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex flex-wrap items-center gap-6 md:gap-10">
               <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                <p class="font-black text-gray-900 dark:text-white text-sm">#LAB-{{ order.id }}</p>
              </div>
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Profile</p>
                <p class="font-bold text-gray-700 dark:text-gray-300 text-xs">{{ order.user?.name }} ({{ order.user?.email }})</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest hidden md:block">Update Status:</label>
              <select 
                v-model="order.status" 
                @change="updateOrderStatus(order.id, order.status)"
                class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-olabits-indigo outline-none text-gray-700 dark:text-gray-200 shadow-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          <div class="px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex flex-col">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Financial Total</p>
              <p class="text-xl font-black text-olabits-wine dark:text-olabits-red">{{ formatCurrency(order.total) }}</p>
            </div>
            <div class="text-right">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Timestamp</p>
              <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ new Date(order.createdAt).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Product Modal -->
    <div v-if="isProductModalOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="isProductModalOpen = false"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl transition-colors border border-white/10">
        <div class="p-8 bg-olabits-wine text-white flex justify-between items-center relative overflow-hidden">
          <div class="absolute -top-4 -right-4 opacity-10">
            <Package :size="120" />
          </div>
          <h2 class="text-2xl font-black uppercase tracking-tighter italic relative z-10">{{ editingProduct?.id ? 'Modify Product' : 'Register New Item' }}</h2>
          <button @click="isProductModalOpen = false" class="relative z-10 hover:rotate-90 transition-transform"><X :size="24" /></button>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 md:p-10 space-y-6 overflow-y-auto max-h-[75vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Official Name</label>
              <input v-model="editingProduct!.name" type="text" required class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Market Description</label>
              <textarea v-model="editingProduct!.description" rows="3" required class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner"></textarea>
            </div>
            <div>
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Unit Price ($)</label>
              <input v-model="editingProduct!.price" type="number" step="0.01" required class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-black text-olabits-wine dark:text-olabits-red transition-all shadow-inner" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Warehouse Stock</label>
              <input v-model="editingProduct!.stock" type="number" required class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-black text-gray-700 dark:text-white transition-all shadow-inner" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Department</label>
              <input v-model="editingProduct!.category" type="text" required class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Media URL</label>
              <input v-model="editingProduct!.image_url" type="text" class="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-olabits-indigo focus:bg-white dark:focus:bg-gray-800 outline-none font-bold text-gray-700 dark:text-white transition-all shadow-inner" />
            </div>
          </div>
          <button type="submit" class="w-full bg-olabits-wine hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest text-sm mt-4">
            <Save :size="20" /> Update Olabits Registry
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
