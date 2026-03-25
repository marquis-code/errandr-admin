<template>
 <div class="space-y-10 animate-fade-in pb-20">
 <!-- Header Section -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
 <div class="space-y-1">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display">Command Center</h1>
 <div class="flex items-center gap-2">
 <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
 <p class="text-xs font-black text-gray-400 tracking-widest leading-none">Platform Systems Live</p>
 </div>
 </div>
 
 <div class="flex items-center gap-6 bg-white p-3 pr-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
 <div class="flex -space-x-3">
 <div v-for="i in 3" :key="i" class="w-11 h-11 rounded-full border-4 border-white bg-gradient-to-br from-[#065fdb]/10 to-[#065fdb]/20 flex items-center justify-center text-[10px] font-black text-[#065fdb] shadow-inner ">
 Ops
 </div>
 </div>
 <div class="flex flex-col">
 <span class="text-xs font-black text-gray-900 tracking-tight">3 Administrators</span>
 <span class="text-[10px] font-black text-emerald-500 tracking-widest mt-1">Verified Session</span>
 </div>
 </div>
 </div>

 <!-- Stats Grid -->
 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 <div v-for="stat in dashboardStats" :key="stat.label" class="bg-white p-8 rounded-[2.5rem] border border-gray-50/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 group overflow-hidden relative">
 <!-- Accent Glow -->
 <div :class="stat.bgClass" class="absolute -right-10 -top-10 w-32 h-32 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-1000 blur-2xl" />
 
 <div class="flex items-center justify-between mb-8 relative">
 <div :class="stat.bgClass" class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/50 group-hover:rotate-6 transition-transform">
 {{ stat.emoji }}
 </div>
 <div v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'" class="text-[10px] font-black px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm">
 {{ stat.trend > 0 ? '↗' : '↘' }} {{ Math.abs(stat.trend) }}%
 </div>
 </div>
 
 <div class="relative space-y-1">
 <p class="text-[10px] font-black text-gray-400 tracking-[0.2em] ml-1">{{ stat.label }}</p>
 <h3 class="text-4xl font-black text-gray-900 tracking-tighter font-display">{{ stat.value }}</h3>
 </div>
 </div>
 </div>

 <!-- Middle Section -->
 <div class="grid grid-cols-1 xl:grid-cols-3 gap-10">
 <!-- Recent Activity Table-style -->
 <div class="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-50/50 shadow-sm overflow-hidden flex flex-col">
 <div class="p-8 pb-6 flex items-center justify-between">
 <div class="flex items-center gap-4">
 <div class="w-1.5 h-6 bg-[#065fdb] rounded-full"></div>
 <div>
 <h3 class="font-black text-gray-900 text-xl tracking-tighter ">Activity Monitor</h3>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-0.5">Live platform operations</p>
 </div>
 </div>
 <NuxtLink to="/orders" class="text-[11px] font-black text-[#065fdb] border border-[#065fdb]/10 hover:bg-[#065fdb] hover:text-white px-5 py-2.5 rounded-2xl transition-all tracking-widest shadow-sm">
 Full Audit Log
 </NuxtLink>
 </div>
 
 <div class="px-2">
 <div v-if="ordersLoading" class="p-8 space-y-6">
 <div v-for="i in 4" :key="i" class="flex items-center gap-6 animate-pulse">
 <div class="w-14 h-14 rounded-2xl bg-gray-50" />
 <div class="flex-1 space-y-3 py-2">
 <div class="h-4 bg-gray-50 rounded-full w-2/3" />
 <div class="h-3 bg-gray-50/50 rounded-full w-1/3" />
 </div>
 </div>
 </div>

 <div v-else-if="recentActivity.length === 0" class="py-24 text-center">
 <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
 <Box class="w-8 h-8 text-gray-300" />
 </div>
 <p class="text-sm font-bold text-gray-400 tracking-widest">No Recent Activity</p>
 </div>

 <div v-else class="space-y-1 pb-4">
 <div v-for="activity in recentActivity" :key="activity.id" 
 class="flex items-center gap-6 p-6 hover:bg-gray-50/50 rounded-[1.5rem] transition-all cursor-default group border border-transparent hover:border-gray-100/50">
 <div :class="activity.iconBg" class="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-sm border border-white/50 transition-all duration-500 group-hover:rotate-6">
 {{ activity.icon }}
 </div>
 <div class="flex-1 min-w-0">
 <div class="flex justify-between items-center mb-1">
 <p class="text-base text-gray-900 tracking-tight leading-tight">
 <span class="font-black text-gray-900">{{ activity.user }}</span>
 <span class="text-gray-400 font-bold mx-1"> {{ activity.action }} </span>
 <span class="font-black text-[#065fdb]">{{ activity.target }}</span>
 </p>
 <span class="text-[10px] font-black text-gray-300 tracking-[0.2em] group-hover:text-[#065fdb] transition-colors shrink-0 ml-4">{{ activity.time }}</span>
 </div>
 <div class="flex items-center gap-3">
 <p class="text-[11px] text-gray-400 font-bold tracking-tight">{{ activity.details }}</p>
 <div class="w-1 h-1 rounded-full bg-gray-200"></div>
 <span class="text-[10px] font-black text-emerald-500 tracking-tighter">Verified</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- System Health Board -->
 <div class="space-y-10">
 <!-- Control Center CTA -->
 <div class="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
 <div class="absolute -right-10 -top-10 w-56 h-56 bg-[#065fdb]/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
 <div class="relative z-10">
 <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-8 backdrop-blur-sm border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
 ⚡
 </div>
 <h3 class="text-3xl font-black mb-4 tracking-tighter leading-tight">System Infrastructure</h3>
 <p class="text-gray-400 text-sm leading-relaxed mb-10 font-bold tracking-tight opacity-80">Full administrative control over all ecosystem layers.</p>
 <button class="w-full py-5 bg-[#065fdb] text-white rounded-[1.5rem] font-black text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-[#065fdb]/30 active:scale-[0.98] outline-none border-2 border-white/10">
 Access Core Engine
 </button>
 </div>
 </div>

 <!-- Service Monitor Board -->
 <div class="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-10">
 <div class="flex items-center justify-between mb-8">
 <h3 class="font-black text-gray-900 text-lg tracking-tighter ">Service Map</h3>
 <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
 </div>
 <div class="space-y-6">
 <div v-for="service in services" :key="service.name" class="flex items-center justify-between group cursor-default">
 <div class="flex items-center gap-5">
 <div class="relative">
 <div :class="service.status === 'online' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-amber-500 shadow-amber-200'" class="w-3 h-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all group-hover:scale-125" />
 <div v-if="service.status === 'online'" class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
 </div>
 <span class="text-[11px] font-black text-gray-900 tracking-widest transition-colors group-hover:text-[#065fdb]">{{ service.name }}</span>
 </div>
 <div :class="service.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'" class="px-3 py-1.5 rounded-xl border text-[9px] font-black tracking-widest shadow-sm">
 {{ service.status }}
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