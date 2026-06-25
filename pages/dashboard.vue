<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Dashboard</h1>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <p class="text-xs font-medium text-gray-500 leading-none">All systems online</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4 bg-white p-2.5 pr-4 rounded-xl border border-gray-200 shadow-sm">
        <div class="flex -space-x-2">
          <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-white bg-[#FF5C1A]/10 flex items-center justify-center text-xs font-bold text-[#FF5C1A]">
            <User class="w-4 h-4" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold text-gray-900">3 Admins</span>
          <span class="text-[10px] font-medium text-emerald-500 mt-0.5">Active Now</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Skeletons for Loading -->
      <template v-if="statsLoading">
        <div v-for="i in 4" :key="`stat-loading-${i}`" class="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between animate-pulse">
          <div class="flex justify-between items-center mb-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg"></div>
            <div class="w-12 h-6 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <div class="w-20 h-3 bg-gray-100 rounded mb-1.5"></div>
            <div class="w-24 h-6 bg-gray-100 rounded"></div>
          </div>
        </div>
      </template>

      <!-- Loaded Stats -->
      <template v-else>
        <div v-for="stat in dashboardStats" :key="stat.label" class="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group overflow-hidden relative shadow-sm">
          <div class="flex items-center justify-between mb-4 relative">
            <div :class="stat.bgClass" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <div v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'" class="text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1">
              <TrendingUp v-if="stat.trend > 0" class="w-3 h-3" />
              <TrendingDown v-else class="w-3 h-3" />
              {{ Math.abs(stat.trend) }}%
            </div>
          </div>
          
          <div class="relative space-y-0.5">
            <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold text-gray-900 font-heading">{{ stat.value }}</h3>
          </div>
        </div>
      </template>
    </div>

    <!-- Middle Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Recent Activity -->
      <div class="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div class="p-5 flex items-center justify-between border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-4 bg-[#FF5C1A] rounded-full"></div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Recent Orders</h3>
              <p class="text-xs font-medium text-gray-500">Latest customer purchases</p>
            </div>
          </div>
          <NuxtLink to="/orders" class="text-xs font-semibold text-[#FF5C1A] hover:bg-[#FF5C1A]/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#FF5C1A]/20">
            View All
          </NuxtLink>
        </div>
        
        <div class="p-0">
          <!-- Order Loading Skeleton -->
          <div v-if="ordersLoading" class="p-5 space-y-4">
            <div v-for="i in 4" :key="`order-loading-${i}`" class="flex items-center gap-4 animate-pulse">
              <div class="w-10 h-10 rounded-lg bg-gray-100" />
              <div class="flex-1 space-y-2 py-1">
                <div class="h-3 bg-gray-100 rounded-full w-2/3" />
                <div class="h-2 bg-gray-100 rounded-full w-1/3" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="recentActivity.length === 0" class="py-12 text-center">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <ShoppingBag class="w-5 h-5 text-gray-400" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">No Orders Yet</h3>
            <p class="text-xs text-gray-500">When customers place orders, they will appear here.</p>
          </div>

          <!-- Order List -->
          <div v-else class="divide-y divide-gray-50">
            <div v-for="activity in recentActivity" :key="activity.id" 
              class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors cursor-default">
              <div :class="activity.iconBg" class="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center border">
                <component :is="activity.icon" class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-0.5">
                  <p class="text-sm text-gray-900 truncate pr-2">
                    <span class="font-semibold text-gray-900">{{ activity.user }}</span>
                    <span class="text-gray-400 text-xs mx-1"> {{ activity.action }} </span>
                    <span class="font-semibold text-[#FF5C1A]">{{ activity.target }}</span>
                  </p>
                  <span class="text-[10px] font-medium text-gray-400 shrink-0">{{ activity.time }}</span>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <p class="text-xs text-gray-500">{{ activity.details }}</p>
                  <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health Board -->
      <div class="space-y-4">
        <!-- Settings CTA -->
        <div class="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden group shadow-sm">
          <div class="relative z-10">
            <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <Settings class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-base font-semibold mb-1.5">Settings</h3>
            <p class="text-gray-400 text-xs leading-relaxed mb-4">Manage platform settings, fees, and operational hours.</p>
            <button class="w-full py-2.5 bg-[#FF5C1A] text-white rounded-lg font-medium text-xs hover:bg-[#E54D12] transition-colors">
              Manage Settings
            </button>
          </div>
        </div>

        <!-- Service Monitor Board -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-5 flex items-center justify-between border-b border-gray-100">
            <h3 class="font-semibold text-gray-900 text-sm">System Status</h3>
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div class="p-5 space-y-4">
            <div v-for="service in services" :key="service.name" class="flex items-center justify-between cursor-default">
              <div class="flex items-center gap-3">
                <div :class="service.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'" class="w-2 h-2 rounded-full" />
                <span class="text-xs font-medium text-gray-700">{{ service.name }}</span>
              </div>
              <div :class="service.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'" class="px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide">
                {{ service.status === 'online' ? 'Online' : 'Issues' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStats } from '@/composables/modules/admin'
import { admin_api } from '@/api_factory/modules/admin'
import { onMounted, ref, computed } from 'vue'
import { 
  DollarSign, ShoppingBag, Store, Users, TrendingUp, TrendingDown,
  User, Settings
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard - Errander Admin'
})

const { stats, loading: statsLoading, fetchStats } = useAdminStats()
const ordersLoading = ref(true)
const recentOrders = ref<any[]>([])

const fetchRecentOrders = async () => {
  ordersLoading.value = true
  try {
    const res = await admin_api.getRecentOrders(5)
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
    label: 'Registered Vendors', 
    value: stats.value?.totalVendors || '0', 
    trend: 4.1, 
    icon: Store, 
    bgClass: 'bg-amber-100 text-amber-600' 
  },
  { 
    label: 'Total Users', 
    value: stats.value?.totalUsers || '0', 
    trend: -2.3, 
    icon: Users, 
    bgClass: 'bg-purple-100 text-purple-600' 
  },
])

const recentActivity = computed(() => {
  return recentOrders.value.map((order: any) => {
    const customer = order.customer || order.user;
    return {
      id: order._id,
      user: `${customer?.firstName || 'Guest'} ${customer?.lastName || ''}`.trim(),
      action: 'ordered for',
      target: `₦${Number(order.total || order.totalAmount || 0).toLocaleString()}`,
      time: formatTimeAgo(order.createdAt),
      details: `Order #${order.orderNumber || order._id?.slice(-8) || ''} • ${order.items?.length || 0} items`,
      icon: ShoppingBag,
      iconBg: 'bg-blue-100 text-blue-600'
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