<template>
  <div class="space-y-10 animate-fade-in pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
      <div class="space-y-1">
        <h1 class="text-4xl font-bold text-gray-900 font-display">Dashboard</h1>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p class="text-sm font-semibold text-gray-500 leading-none">All systems online</p>
        </div>
      </div>
      
      <div class="flex items-center gap-6 bg-gray-50 p-3 pr-6 rounded-2xl border border-gray-100">
        <div class="flex -space-x-3">
          <div v-for="i in 3" :key="i" class="w-11 h-11 rounded-full border-4 border-white bg-[#FF5C1A]/10 flex items-center justify-center text-sm font-bold text-[#FF5C1A]">
            <User class="w-5 h-5" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900">3 Admins</span>
          <span class="text-sm font-medium text-emerald-500 mt-1">Active Now</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Skeletons for Loading -->
      <template v-if="statsLoading">
        <div v-for="i in 4" :key="`stat-loading-${i}`" class="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col justify-between h-40 animate-pulse">
          <div class="flex justify-between items-center mb-6">
            <div class="w-14 h-14 bg-gray-200 rounded-2xl"></div>
            <div class="w-16 h-8 bg-gray-200 rounded-xl"></div>
          </div>
          <div>
            <div class="w-24 h-4 bg-gray-200 rounded-md mb-2"></div>
            <div class="w-32 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </template>

      <!-- Loaded Stats -->
      <template v-else>
        <div v-for="stat in dashboardStats" :key="stat.label" class="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors group overflow-hidden relative">
          <div class="flex items-center justify-between mb-8 relative">
            <div :class="stat.bgClass" class="w-14 h-14 rounded-2xl flex items-center justify-center">
              <component :is="stat.icon" class="w-6 h-6" />
            </div>
            <div v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-rose-700 bg-rose-100 border-rose-200'" class="text-sm font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5">
              <TrendingUp v-if="stat.trend > 0" class="w-4 h-4" />
              <TrendingDown v-else class="w-4 h-4" />
              {{ Math.abs(stat.trend) }}%
            </div>
          </div>
          
          <div class="relative space-y-1">
            <p class="text-sm font-semibold text-gray-500 ml-1">{{ stat.label }}</p>
            <h3 class="text-4xl font-bold text-gray-900 font-display">{{ stat.value }}</h3>
          </div>
        </div>
      </template>
    </div>

    <!-- Middle Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-10">
      <!-- Recent Activity -->
      <div class="xl:col-span-2 bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden flex flex-col">
        <div class="p-8 pb-6 flex items-center justify-between border-b border-gray-200/50">
          <div class="flex items-center gap-4">
            <div class="w-1.5 h-6 bg-[#FF5C1A] rounded-full"></div>
            <div>
              <h3 class="font-bold text-gray-900 text-xl">Recent Orders</h3>
              <p class="text-sm font-medium text-gray-500 mt-0.5">Latest customer purchases</p>
            </div>
          </div>
          <NuxtLink to="/orders" class="text-sm font-bold text-[#FF5C1A] hover:bg-[#FF5C1A]/10 px-5 py-2.5 rounded-xl transition-colors">
            View All
          </NuxtLink>
        </div>
        
        <div class="p-2">
          <!-- Order Loading Skeleton -->
          <div v-if="ordersLoading" class="p-6 space-y-6">
            <div v-for="i in 4" :key="`order-loading-${i}`" class="flex items-center gap-6 animate-pulse">
              <div class="w-14 h-14 rounded-2xl bg-gray-200" />
              <div class="flex-1 space-y-3 py-2">
                <div class="h-4 bg-gray-200 rounded-full w-2/3" />
                <div class="h-3 bg-gray-200 rounded-full w-1/3" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="recentActivity.length === 0" class="py-20 text-center">
            <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">No Orders Yet</h3>
            <p class="text-sm font-medium text-gray-500">When customers place orders, they will appear here.</p>
          </div>

          <!-- Order List -->
          <div v-else class="space-y-1 pb-4">
            <div v-for="activity in recentActivity" :key="activity.id" 
              class="flex items-center gap-6 p-6 hover:bg-white rounded-2xl transition-colors cursor-default border border-transparent hover:border-gray-100">
              <div :class="activity.iconBg" class="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/50">
                <component :is="activity.icon" class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-base text-gray-900">
                    <span class="font-bold text-gray-900">{{ activity.user }}</span>
                    <span class="text-gray-500 font-medium mx-1"> {{ activity.action }} </span>
                    <span class="font-bold text-[#FF5C1A]">{{ activity.target }}</span>
                  </p>
                  <span class="text-sm font-medium text-gray-400 shrink-0 ml-4">{{ activity.time }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <p class="text-sm text-gray-500 font-medium">{{ activity.details }}</p>
                  <div class="w-1 h-1 rounded-full bg-gray-300"></div>
                  <span class="text-sm font-bold text-emerald-500">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health Board -->
      <div class="space-y-10">
        <!-- Settings CTA -->
        <div class="bg-gray-900 rounded-3xl p-10 text-white relative overflow-hidden group">
          <div class="relative z-10">
            <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Settings class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-3">Settings</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-8 font-medium">Manage platform settings, fees, and operational hours.</p>
            <button class="w-full py-4 bg-[#FF5C1A] text-white rounded-xl font-bold text-sm hover:bg-[#E54D12] transition-colors">
              Manage Settings
            </button>
          </div>
        </div>

        <!-- Service Monitor Board -->
        <div class="bg-gray-50 rounded-3xl border border-gray-100 p-8">
          <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 class="font-bold text-gray-900 text-lg">System Status</h3>
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div class="space-y-5">
            <div v-for="service in services" :key="service.name" class="flex items-center justify-between cursor-default">
              <div class="flex items-center gap-4">
                <div :class="service.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'" class="w-2.5 h-2.5 rounded-full" />
                <span class="text-sm font-semibold text-gray-700">{{ service.name }}</span>
              </div>
              <div :class="service.status === 'online' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'" class="px-3 py-1 rounded-lg border text-xs font-bold">
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
  return recentOrders.value.map((order: any) => ({
    id: order._id,
    user: `${order.user?.firstName || 'Guest'} ${order.user?.lastName || ''}`,
    action: 'ordered for',
    target: `₦${Number(order.totalAmount || 0).toLocaleString()}`,
    time: formatTimeAgo(order.createdAt),
    details: `Order #${order._id?.slice(-8) || ''} • ${order.items?.length || 0} items`,
    icon: ShoppingBag,
    iconBg: 'bg-blue-100 text-blue-600'
  }))
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
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>