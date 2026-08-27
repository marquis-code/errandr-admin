<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Overview</h1>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <p class="text-[11px] font-bold text-gray-400 tracking-wider uppercase leading-none">System Active</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm text-xs font-medium text-gray-600">
          <div class="w-2 h-2 rounded-full bg-parentPrimary"></div>
          Live Data
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-md">
          <Filter class="w-3.5 h-3.5" />
          Filter Data
        </button>
      </div>
    </div>

    <!-- Stats Grid (Primary & Operational) -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Skeletons for Loading -->
        <template v-if="statsLoading">
          <div v-for="i in 8" :key="`stat-loading-${i}`" class="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between animate-pulse">
            <div class="flex justify-between items-center mb-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg"></div>
              <div class="w-12 h-4 bg-gray-100 rounded-md"></div>
            </div>
            <div>
              <div class="w-20 h-3 bg-gray-100 rounded mb-1.5"></div>
              <div class="w-24 h-6 bg-gray-100 rounded"></div>
            </div>
          </div>
        </template>
        
        <!-- Primary Stats -->
        <template v-else>
          <div v-for="stat in dashboardStats" :key="stat.label" class="bg-white p-5 rounded-[1.25rem] border border-gray-100/60 hover:border-gray-200 transition-all hover:shadow-md group overflow-hidden relative">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
            <div class="flex items-center justify-between mb-5 relative z-10">
              <div :class="stat.bgClass" class="w-11 h-11 rounded-xl flex items-center justify-center border border-white/50 shadow-sm">
                <component :is="stat.icon" class="w-5 h-5" />
              </div>
              <div v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'" class="text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 shadow-sm">
                <TrendingUp v-if="stat.trend > 0" class="w-3 h-3" />
                <TrendingDown v-else class="w-3 h-3" />
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
            <div class="relative z-10 space-y-1">
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{{ stat.label }}</p>
              <h3 class="text-2xl font-black text-gray-900 tracking-tight">{{ stat.value }}</h3>
            </div>
          </div>
          
          <!-- Operational Stats -->
          <div v-for="stat in operationalStats" :key="stat.label" class="relative overflow-hidden p-5 rounded-[1.25rem] border transition-all hover:shadow-md group" :class="stat.alert ? 'bg-rose-50/50 border-rose-200' : 'bg-gray-50/50 border-gray-100'">
            <div v-if="stat.alert" class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent"></div>
            <div class="flex items-center justify-between mb-5 relative z-10">
              <div :class="stat.bgClass" class="w-11 h-11 rounded-xl flex items-center justify-center border border-white/50 shadow-sm">
                <component :is="stat.icon" class="w-5 h-5" />
              </div>
            </div>
            <div class="relative z-10 space-y-1">
              <p class="text-[11px] font-bold uppercase tracking-wider" :class="stat.alert ? 'text-rose-500' : 'text-gray-500'">{{ stat.label }}</p>
              <h3 class="text-xl font-black tracking-tight" :class="stat.alert ? 'text-rose-700' : 'text-gray-900'">
                {{ stat.value }}
                <span v-if="stat.alert" class="text-xs font-semibold text-rose-500 ml-1 bg-rose-100 px-2 py-0.5 rounded-full">Requires Attention</span>
              </h3>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Revenue Chart Section -->
    <div class="w-full bg-gray-900 rounded-[1.25rem] border border-gray-800 p-5 shadow-lg relative overflow-hidden group mt-4">
      <div class="absolute top-0 right-0 w-64 h-64 bg-[#FF5C1A]/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Activity class="w-5 h-5 text-[#FF5C1A]" />
            Revenue Overview
          </h2>
          <p class="text-xs font-medium text-gray-400 mt-0.5">Last 30 days performance</p>
        </div>
        <div class="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50 backdrop-blur-md">
          <button class="px-3 py-1.5 text-[10px] font-bold rounded-md text-white bg-gray-700 shadow-sm transition-colors">30D</button>
          <button class="px-3 py-1.5 text-[10px] font-bold rounded-md text-gray-400 hover:text-white transition-colors">YTD</button>
          <button class="px-3 py-1.5 text-[10px] font-bold rounded-md text-gray-400 hover:text-white transition-colors">ALL</button>
        </div>
      </div>
      <div class="relative z-10">
        <RevenueChart :data="chartData" />
      </div>
    </div>

    <!-- Middle Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      <!-- Recent Activity -->
      <div class="xl:col-span-2 bg-white rounded-[1.25rem] border border-gray-100/60 shadow-sm overflow-hidden flex flex-col">
        <div class="p-5 flex items-center justify-between border-b border-gray-100/50 bg-gray-50/30">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-4 bg-[#FF5C1A] rounded-full"></div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Recent Orders</h3>
              <p class="text-xs font-medium text-gray-500">Latest customer purchases</p>
            </div>
          </div>
          <NuxtLink to="/orders" class="text-xs font-bold text-[#FF5C1A] hover:bg-[#FF5C1A]/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#FF5C1A]/20 flex items-center gap-1">
            View All
          </NuxtLink>
        </div>
        
        <div class="p-0">
          <!-- Order Loading Skeleton -->
          <div v-if="ordersLoading" class="p-5 space-y-4">
            <div v-for="i in 5" :key="`order-loading-${i}`" class="flex items-center gap-4 animate-pulse">
              <div class="w-10 h-10 rounded-xl bg-gray-100" />
              <div class="flex-1 space-y-2 py-1">
                <div class="h-3 bg-gray-100 rounded-full w-1/2" />
                <div class="h-2 bg-gray-100 rounded-full w-1/4" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="recentActivity.length === 0" class="py-16 text-center bg-gray-50/50">
            <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
              <ShoppingBag class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">No Orders Yet</h3>
            <p class="text-xs text-gray-500">When customers place orders, they will appear here.</p>
          </div>

          <!-- High-Density Order Grid -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-100/50 bg-gray-50/20">
                  <th class="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider w-1/3">Customer & Order</th>
                  <th class="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider w-1/4">Logistics</th>
                  <th class="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Financials</th>
                  <th class="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50/50">
                <tr v-for="activity in recentActivity" :key="activity.id" @click="selectedOrder = recentOrders.find(o => o._id === activity.id)" class="hover:bg-gray-50/30 transition-colors group cursor-pointer">
                  <!-- Customer & Order -->
                  <td class="px-5 py-4">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xs uppercase shadow-sm border border-gray-200">
                        {{ activity.customerName.charAt(0) }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-bold text-gray-900 truncate">{{ activity.customerName }}</p>
                        <p class="text-[10px] text-gray-500 truncate mb-1">{{ activity.customerEmail }}</p>
                        <div class="flex items-center gap-2">
                          <span class="text-[9px] font-black bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{{ activity.orderNumber }}</span>
                          <span class="text-[9px] font-bold text-gray-400">• {{ activity.itemCount }} items</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Logistics -->
                  <td class="px-5 py-4">
                    <div class="flex flex-col gap-1.5">
                      <div class="flex items-center gap-2 text-xs">
                        <Store class="w-3 h-3 text-amber-500" />
                        <span class="font-semibold text-gray-700 truncate max-w-[120px]">{{ activity.vendorName }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs">
                        <Truck class="w-3 h-3 text-indigo-500" />
                        <span class="font-semibold text-gray-600 truncate max-w-[120px]">{{ activity.erranderName }}</span>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Financials -->
                  <td class="px-5 py-4 text-right">
                    <p class="text-sm font-black text-gray-900 font-mono tracking-tight">₦{{ activity.total.toLocaleString() }}</p>
                    <div class="flex flex-col items-end gap-0.5 mt-0.5">
                      <span class="text-[9px] font-bold text-emerald-600">Platform: ₦{{ activity.platformShare.toLocaleString() }}</span>
                      <span class="text-[9px] font-medium text-gray-400">Delivery: ₦{{ activity.deliveryFee.toLocaleString() }}</span>
                    </div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-5 py-4 text-right">
                    <div class="flex flex-col items-end gap-2">
                      <span v-if="activity.status === 'delivered'" class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <CheckCircle class="w-3 h-3" /> Delivered
                      </span>
                      <span v-else-if="activity.status === 'pending'" class="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Clock class="w-3 h-3" /> Pending
                      </span>
                      <span v-else class="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100/50 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Activity class="w-3 h-3" /> {{ activity.status.replace('_', ' ') }}
                      </span>
                      
                      <span class="text-[9px] font-bold text-gray-400">{{ activity.time }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        
        <!-- Action Required Widget -->
        <div v-if="stats?.pendingVendors > 0" class="bg-rose-500 rounded-[1.25rem] p-6 text-white relative overflow-hidden shadow-lg shadow-rose-500/20 group cursor-pointer hover:bg-rose-600 transition-colors" @click="navigateTo('/admin/vendors')">
          <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative z-10">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 shadow-sm">
              <AlertCircle class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-base font-black mb-1.5 tracking-tight flex items-center gap-2">
              Action Required
              <span class="px-2 py-0.5 bg-white text-rose-600 rounded-full text-[10px] font-black">{{ stats.pendingVendors }}</span>
            </h3>
            <p class="text-rose-100 text-xs font-medium leading-relaxed mb-4">You have vendors waiting for approval to join the platform.</p>
            <button class="flex items-center gap-2 text-xs font-bold text-white hover:underline underline-offset-4">
              Review Vendors
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Service Monitor Board -->
        <div class="bg-white rounded-[1.25rem] border border-gray-100/60 shadow-sm overflow-hidden">
          <div class="p-5 flex items-center justify-between border-b border-gray-100/50 bg-gray-50/30">
            <div class="flex items-center gap-2">
              <Activity class="w-4 h-4 text-emerald-500" />
              <h3 class="font-bold text-gray-900 text-sm">System Status</h3>
            </div>
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          </div>
          <div class="p-5 space-y-4">
            <div v-for="service in services" :key="service.name" class="flex items-center justify-between cursor-default group">
              <div class="flex items-center gap-3">
                <div :class="service.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'" class="w-2 h-2 rounded-full transition-colors" />
                <span class="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{{ service.name }}</span>
              </div>
              <div :class="service.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-amber-50 text-amber-600 border-amber-100/50'" class="px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider shadow-sm">
                {{ service.status === 'online' ? 'Operational' : 'Degraded' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Settings CTA -->
        <div class="bg-gray-900 rounded-[1.25rem] p-6 text-white relative overflow-hidden group shadow-sm border border-gray-800">
          <div class="absolute right-0 bottom-0 w-32 h-32 bg-[#FF5C1A]/10 rounded-tl-full blur-2xl group-hover:bg-[#FF5C1A]/20 transition-colors duration-700"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700/50 shadow-sm">
                <Settings class="w-5 h-5 text-gray-300" />
              </div>
            </div>
            <h3 class="text-base font-bold mb-1.5 tracking-tight text-white">Platform Settings</h3>
            <p class="text-gray-400 text-xs font-medium leading-relaxed mb-5">Manage platform configurations, fees, and operational hours.</p>
            <NuxtLink to="/settings" class="block text-center w-full py-3 bg-[#FF5C1A] text-white rounded-xl font-bold text-xs hover:bg-[#E54D12] transition-all shadow-md shadow-[#FF5C1A]/20 active:scale-95">
              Manage Settings
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
  <OrderDetailsDrawer 
    v-if="selectedOrder" 
    :is-open="!!selectedOrder" 
    :order="selectedOrder" 
    @close="selectedOrder = null" 
    @takeAction="handleOrderAction" 
  />
</template>

<script setup lang="ts">
import OrderDetailsDrawer from '@/components/orders/OrderDetailsDrawer.vue'
import { useAdminStats } from '@/composables/modules/admin'
import { admin_api } from '@/api_factory/modules/admin'
import { onMounted, ref, computed } from 'vue'
import { 
  DollarSign, ShoppingBag, Store, Users, TrendingUp, TrendingDown,
  User, Settings, CheckCircle, Clock, Truck, AlertCircle, ChevronDown, Activity, Filter,
  ArrowRight
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard - Errander Admin'
})

import RevenueChart from '@/components/core/RevenueChart.vue'

const { stats, chartData, loading: statsLoading, fetchStats } = useAdminStats()
const ordersLoading = ref(true)
const recentOrders = ref<any[]>([])
const selectedOrder = ref<any>(null)

const handleOrderAction = (order: any) => {
  navigateTo(`/admin/orders?orderId=${order._id || order.id}`)
}

const fetchRecentOrders = async () => {
  ordersLoading.value = true
  try {
    const res = await admin_api.getRecentOrders(1, 5)
    recentOrders.value = res.data.orders || res.data
  } catch (e) {
    console.error('Failed to fetch recent orders', e)
  } finally {
    ordersLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
  fetchRecentOrders()
})

const dashboardStats = computed(() => [
  { 
    label: 'Total Revenue', 
    value: stats.value?.totalVolume ? `₦${Number(stats.value.totalVolume).toLocaleString()}` : '₦0',
    trend: 12.5, 
    icon: DollarSign, 
    bgClass: 'bg-emerald-100 text-emerald-600' 
  },
  { 
    label: 'Total Orders', 
    value: stats.value?.totalOrders || '0', 
    trend: 8.2, 
    icon: ShoppingBag, 
    bgClass: 'bg-blue-100 text-blue-600' 
  },
  { 
    label: 'Total Users', 
    value: stats.value?.totalUsers || '0', 
    trend: -2.3, 
    icon: Users, 
    bgClass: 'bg-purple-100 text-purple-600' 
  },
  { 
    label: 'Registered Vendors', 
    value: stats.value?.totalVendors || '0', 
    trend: 4.1, 
    icon: Store, 
    bgClass: 'bg-amber-100 text-amber-600' 
  },
])

const operationalStats = computed(() => [
  {
    label: 'Active Orders',
    value: stats.value?.activeOrders || '0',
    icon: Clock,
    bgClass: 'bg-indigo-100 text-indigo-600'
  },
  {
    label: 'Completed Orders',
    value: stats.value?.completedOrders || '0',
    icon: CheckCircle,
    bgClass: 'bg-emerald-100 text-emerald-600'
  },
  {
    label: 'Active Erranders',
    value: stats.value?.totalErranders || '0',
    icon: Truck,
    bgClass: 'bg-blue-100 text-blue-600'
  },
  {
    label: 'Pending Vendors',
    value: stats.value?.pendingVendors || '0',
    icon: AlertCircle,
    bgClass: stats.value?.pendingVendors > 0 ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500',
    alert: stats.value?.pendingVendors > 0
  }
])

const recentActivity = computed(() => {
  return recentOrders.value.map((order: any) => {
    const customer = order.customer || order.user;
    return {
      id: order._id,
      orderNumber: order.orderNumber || `ERR-${order._id?.slice(-8).toUpperCase()}`,
      customerName: `${customer?.firstName || 'Guest'} ${customer?.lastName || ''}`.trim(),
      customerEmail: customer?.email || 'No email provided',
      vendorName: order.vendor?.storeName || 'Unknown Vendor',
      erranderName: order.errander ? `${order.errander.firstName} ${order.errander.lastName}` : 'Unassigned',
      total: order.total || order.totalAmount || 0,
      deliveryFee: order.deliveryFee || 0,
      platformShare: (order.serviceFee || 0) + ((order.deliveryFee || 0) - (order.erranderPayout || 0)),
      address: order.deliveryAddress || order.specificAddress || 'No address provided',
      time: formatTimeAgo(order.createdAt),
      status: order.status || 'completed',
      itemCount: order.items?.length || 0
    };
  });
})

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Recently'
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  
  if (diffInMins < 1) return 'Just now'
  if (diffInMins < 60) return `${diffInMins} mins ago`
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hrs ago`
  return date.toLocaleDateString()
}

const services = [
  { name: 'User Accounts', status: 'online' },
  { name: 'Mobile App API', status: 'online' },
  { name: 'Delivery System', status: 'online' },
  { name: 'Payments', status: 'online' },
  { name: 'Notifications', status: 'issues' },
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>