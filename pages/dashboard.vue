<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight font-display">System Overview</h1>
        <p class="text-gray-500 mt-1 font-medium">Real-time platform performance and ecosystem health.</p>
      </div>
      <div class="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex -space-x-2">
          <div v-for="i in 3" :key="i" class="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
            U{{i}}
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold text-gray-900 leading-none">3 Admins</span>
          <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1 flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Online Now
          </span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in dashboardStats" :key="stat.label" class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
        <div :class="stat.bgClass" class="absolute -right-6 -top-6 w-24 h-24 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700" />
        
        <div class="flex items-center justify-between mb-6 relative">
          <div :class="stat.bgClass" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform">
            {{ stat.emoji }}
          </div>
          <div v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'" class="text-[10px] font-bold px-2 py-1 rounded-lg border border-transparent flex items-center gap-1">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
          </div>
        </div>
        
        <div class="relative">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Middle Section: Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div class="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div>
            <h3 class="font-bold text-gray-900 text-lg tracking-tight">Recent Activity</h3>
            <p class="text-xs text-gray-500 font-medium mt-1">Latest platform events and orders</p>
          </div>
          <NuxtLink to="/orders" class="text-xs font-bold text-parentPrimary bg-parentPrimary/5 px-4 py-2 rounded-xl hover:bg-parentPrimary/10 transition-colors">
            Manage All Orders
          </NuxtLink>
        </div>
        
        <div v-if="ordersLoading" class="p-8 space-y-6">
          <div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
            <div class="w-12 h-12 rounded-full bg-gray-100" />
            <div class="flex-1 space-y-2 py-2">
              <div class="h-3 bg-gray-100 rounded-full w-3/4" />
              <div class="h-2 bg-gray-50 rounded-full w-1/4" />
            </div>
          </div>
        </div>

        <div v-else-if="recentActivity.length === 0" class="p-20 text-center">
           <EmptyState title="No recent activity" description="All platform systems are currently quiet." />
        </div>

        <div v-else class="p-8 flex-1 space-y-8">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-5 group cursor-default">
            <div :class="activity.iconBg" class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
              {{ activity.icon }}
            </div>
            <div class="flex-1 min-w-0 border-b border-gray-50 pb-6 group-last:border-0">
              <div class="flex justify-between items-start mb-1">
                <p class="text-sm text-gray-900 leading-tight">
                  <span class="font-bold text-gray-900">{{ activity.user }}</span>
                  <span class="text-gray-500 font-medium"> {{ activity.action }} </span>
                  <span class="font-bold text-parentPrimary">{{ activity.target }}</span>
                </p>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ activity.time }}</span>
              </div>
              <p class="text-xs text-gray-400 font-medium leading-relaxed">{{ activity.details }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Status -->
      <div class="space-y-8">
        <!-- Quick Support -->
        <div class="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div class="relative z-10">
            <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl mb-6 backdrop-blur-sm border border-white/10">
              🎯
            </div>
            <h3 class="text-xl font-bold mb-3 tracking-tight">System Health</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-8 font-medium">Monitor your infrastructure and resolve merchant issues platform-wide.</p>
            <button class="w-full py-4 bg-parentPrimary text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-parentPrimary/20 active:scale-[0.98]">
              Open Admin Console
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <h3 class="font-bold text-gray-900 mb-6 text-lg tracking-tight">Service Monitor</h3>
          <div class="space-y-5">
             <div v-for="service in services" :key="service.name" class="flex items-center justify-between group">
                <div class="flex items-center gap-4">
                   <div class="relative">
                     <div :class="service.status === 'online' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'" class="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-all group-hover:scale-125" />
                     <div v-if="service.status === 'online'" class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                   </div>
                   <span class="text-sm font-bold text-gray-700 tracking-tight">{{ service.name }}</span>
                </div>
                <StatusBadge :status="service.status" />
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

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Dashboard - Errandr Admin'
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
    label: 'Platform Volume', 
    value: stats.value?.totalVolume ? `₦${Number(stats.value.totalVolume).toLocaleString()}` : '₦0',
    trend: 12.5, 
    emoji: '📈', 
    bgClass: 'bg-emerald-100 text-emerald-600' 
  },
  { 
    label: 'Active Orders', 
    value: stats.value?.totalOrders || '0', 
    trend: 8.2, 
    emoji: '📦', 
    bgClass: 'bg-blue-100 text-blue-600' 
  },
  { 
    label: 'Merchant Network', 
    value: stats.value?.totalVendors || '0', 
    trend: 4.1, 
    emoji: '🏪', 
    bgClass: 'bg-amber-100 text-amber-600' 
  },
  { 
    label: 'User Base', 
    value: stats.value?.totalUsers || '0', 
    trend: 15.3, 
    emoji: '👥', 
    bgClass: 'bg-purple-100 text-purple-600' 
  },
])

const recentActivity = computed(() => {
  return recentOrders.value.map((order: any) => ({
    id: order._id,
    user: `${order.user?.firstName || 'Guest'} ${order.user?.lastName || ''}`,
    action: 'placed an order for',
    target: `₦${Number(order.totalAmount || 0).toLocaleString()}`,
    time: formatTimeAgo(order.createdAt),
    details: `Order ID: #${order._id.slice(-8).toUpperCase()} • ${order.items?.length || 0} items`,
    icon: '📦',
    iconBg: 'bg-blue-50 text-blue-600'
  }))
})

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Recently'
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  
  if (diffInMins < 1) return 'Just now'
  if (diffInMins < 60) return `${diffInMins}m ago`
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`
  return date.toLocaleDateString()
}

const services = [
  { name: 'Identity Engine', status: 'online' },
  { name: 'Unified API Gateway', status: 'online' },
  { name: 'Logistics Orchestrator', status: 'online' },
  { name: 'Financial Switch', status: 'online' },
  { name: 'Real-time Message Bus', status: 'maintenance' },
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