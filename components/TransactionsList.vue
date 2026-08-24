<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div class="flex-1 w-full relative">
        <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Search order # or customer..." 
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
          @input="debounceFetch"
        />
      </div>
      <div class="flex gap-3 w-full sm:w-auto">
        <select 
          v-model="filters.status" 
          @change="fetchOrders"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready_for_pickup">Ready for Pickup</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input 
          v-model="filters.startDate" 
          type="date" 
          @change="fetchOrders"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
        />
        <input 
          v-model="filters.endDate" 
          type="date" 
          @change="fetchOrders"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden relative min-h-[300px]">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-sm">
        <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th class="p-4 font-bold">Order ID</th>
              <th class="p-4 font-bold">Customer</th>
              <th class="p-4 font-bold">Type</th>
              <th class="p-4 font-bold">Total</th>
              <th class="p-4 font-bold">Date</th>
              <th class="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="orders.length === 0 && !loading">
              <td colspan="6" class="p-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                    <Receipt class="w-6 h-6 text-gray-400" />
                  </div>
                  <p class="font-medium">No transactions found</p>
                  <p class="text-xs text-gray-400">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
            <tr v-for="order in orders" :key="order._id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="p-4 font-mono font-bold text-gray-900">
                {{ order.orderNumber }}
              </td>
              <td class="p-4">
                <p class="font-bold text-gray-900">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
                <p class="text-xs text-gray-500">{{ order.customer?.phone }}</p>
              </td>
              <td class="p-4">
                <span class="inline-flex text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide bg-gray-100 text-gray-600">
                  {{ order.type === 'custom_errand' ? 'Custom Errand' : 'Marketplace' }}
                </span>
                <p v-if="order.vendor?.storeName" class="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                  {{ order.vendor.storeName }}
                </p>
              </td>
              <td class="p-4 font-bold text-gray-900">
                ₦{{ (order.total || 0).toLocaleString() }}
              </td>
              <td class="p-4 text-gray-600 whitespace-nowrap">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="p-4">
                <span class="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap"
                  :class="{
                    'bg-amber-100 text-amber-700': ['pending', 'preparing', 'ready_for_pickup'].includes(order.status),
                    'bg-blue-100 text-blue-700': ['picked_up', 'in_transit'].includes(order.status),
                    'bg-emerald-100 text-emerald-700': order.status === 'delivered',
                    'bg-red-100 text-red-700': order.status === 'cancelled',
                    'bg-gray-100 text-gray-700': !['pending', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled'].includes(order.status)
                  }">
                  {{ order.status?.replace(/_/g, ' ') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" v-if="totalPages > 0">
        <p class="text-xs text-gray-500 font-medium">
          Showing page {{ page }} of {{ totalPages }}
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="page--" 
            :disabled="page === 1"
            class="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button 
            @click="page++" 
            :disabled="page >= totalPages"
            class="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import { Search, Receipt } from 'lucide-vue-next'

const props = defineProps({
  vendorId: { type: String, default: null },
  erranderId: { type: String, default: null }
})

const loading = ref(false)
const orders = ref<any[]>([])
const page = ref(1)
const totalPages = ref(1)
let searchTimeout: any = null

const filters = reactive({
  search: '',
  status: '',
  startDate: '',
  endDate: ''
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, limit: 10 }
    if (props.vendorId) params.vendorId = props.vendorId
    if (props.erranderId) params.erranderId = props.erranderId
    
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate

    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/orders/recent', { params })
    
    orders.value = res.data?.orders || []
    totalPages.value = res.data?.totalPages || 0
  } catch (error) {
    console.error('Failed to fetch transactions', error)
  } finally {
    loading.value = false
  }
}

const debounceFetch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchOrders()
  }, 500)
}

watch(() => props.vendorId, () => { page.value = 1; fetchOrders() })
watch(() => props.erranderId, () => { page.value = 1; fetchOrders() })
watch(page, fetchOrders)

onMounted(() => {
  if (props.vendorId || props.erranderId) {
    fetchOrders()
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>
