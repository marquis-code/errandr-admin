<template>
  <div class="space-y-6 animate-fade-in container mx-auto pb-20">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Scheduled Orders</h1>
        <p class="text-xs font-medium text-gray-500">Manage Meal Autopilot schedules across the platform.</p>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100/60 overflow-visible min-h-[400px] shadow-none mt-6">
      <div v-if="loading" class="p-10 space-y-6">
        <div v-for="i in 5" :key="`skeleton-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-12 h-12 rounded-full bg-gray-100" />
          <div class="flex-1 space-y-3">
            <div class="h-3 bg-gray-100 rounded-full w-1/3" />
            <div class="h-2 bg-gray-100 rounded-full w-1/4" />
          </div>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="py-24 text-center bg-gray-50/30">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Package class="w-6 h-6 text-gray-400" />
        </div>
        <h4 class="font-bold text-gray-900 text-lg tracking-tight">No scheduled orders found</h4>
      </div>

      <div v-else class="max-md:overflow-x-auto md:overflow-visible pb-24 md:pb-0">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="border-b border-gray-100/50 bg-gray-50/20">
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Vendor</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Schedule Details</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Value</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="order in orders" :key="order._id" class="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors group">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span class="font-bold text-gray-500">{{ order.customer?.firstName?.[0] || 'C' }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 truncate">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ order.customer?.email }}</p>
                    <p class="text-[10px] text-gray-400 font-medium">{{ order.customer?.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <p class="font-bold text-gray-900">{{ order.vendor?.storeName || order.vendor?.businessName }}</p>
              </td>
              <td class="px-4 py-4">
                <div v-for="sched in order.schedules" :key="sched.day" class="text-xs">
                  <span class="font-bold capitalize">{{ sched.day }}</span>
                  <span class="text-gray-500"> — {{ sched.exactTime || sched.timeWindow }}</span>
                </div>
              </td>
              <td class="px-4 py-4 font-black text-gray-900">
                ₦{{ order.total?.toLocaleString() }}
              </td>
              <td class="px-4 py-4 text-right">
                <span class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full"
                      :class="order.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a :href="`https://wa.me/${formatPhone(order.customer?.phone)}`" target="_blank" class="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <MessageCircle class="w-4 h-4" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-100/50 bg-gray-50/20 flex items-center justify-between">
        <p class="text-xs font-medium text-gray-500">Showing page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex items-center gap-2">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:border-parentPrimary transition-colors disabled:opacity-50">Prev</button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:border-parentPrimary transition-colors disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Package, MessageCircle } from 'lucide-vue-next'
import { orders_api } from '@/api_factory/modules/orders'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Scheduled Orders - Errander Admin' })

const { showToast } = useCustomToast()
const loading = ref(true)
const orders = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await orders_api.getAdminRecurringOrders(currentPage.value)
    orders.value = res.data?.data?.data || res.data?.data || []
    totalPages.value = Math.ceil((res.data?.data?.total || 0) / 20)
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch scheduled orders', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchOrders()
}

onMounted(() => {
  fetchOrders()
})
</script>
