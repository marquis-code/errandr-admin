<template>
 <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
 <!-- Search & Quick Stats -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
 <div class="flex-1 relative max-w-2xl group">
 <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#065fdb] transition-colors" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search Order ID, Customer, or Vendor..." 
 class="w-full pl-14 pr-14 py-4 bg-white hover:bg-gray-50/50 transition-all border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-[#065fdb]/5 focus:border-[#065fdb]/20 placeholder:text-gray-300 placeholder:font-bold shadow-sm"
 />
 <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
 <kbd class="px-2 py-1 text-[10px] font-black bg-gray-50 text-gray-500 rounded-lg border border-gray-200">⌘</kbd>
 <kbd class="px-2 py-1 text-[10px] font-black bg-gray-50 text-gray-500 rounded-lg border border-gray-200">K</kbd>
 </div>
 </div>
 
 <div class="flex items-center gap-6 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0">
 <div class="w-10 h-10 rounded-xl bg-[#065fdb]/5 flex items-center justify-center">
 <Package class="w-5 h-5 text-[#065fdb]" />
 </div>
 <div class="flex flex-col">
 <span class="text-[10px] font-black text-gray-400 tracking-widest">Active Operations</span>
 <span class="text-lg font-black text-gray-900 leading-none">{{ orders.length }} Orders</span>
 </div>
 </div>
 </div>

 <!-- Header & Filters Header -->
 <div class="space-y-8">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div class="space-y-1">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#065fdb] to-indigo-600">Fulfillment Engine</h1>
 <p class="text-xs font-bold text-gray-400 tracking-[0.2em] leading-none">Monitor and orchestrate ecosystem-wide order flow.</p>
 </div>
 
 <div class="flex items-center gap-3">
 <button class="flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-gray-50 rounded-2xl text-[11px] font-black text-gray-900 transition-all border border-gray-100 tracking-[0.1em] shadow-sm active:scale-95">
 <ListFilter class="w-4 h-4" />
 Control Filters
 </button>
 </div>
 </div>
 
 <div class="flex overflow-x-auto pb-4 hide-scrollbar gap-2">
 <button 
 v-for="status in statuses" 
 :key="status"
 @click="selectedStatus = status"
 class="px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] whitespace-nowrap border shrink-0"
 :class="selectedStatus === status ? 'bg-[#065fdb] text-white border-[#065fdb] shadow-lg shadow-[#065fdb]/20' : 'text-gray-400 hover:text-gray-900 bg-white border-gray-100'"
 >
 {{ status }}
 </button>
 </div>
 </div>

 <!-- Table Section -->
 <div class="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden min-h-[500px]">
 <div v-if="loading" class="p-8">
 <SkeletonTable :rows="10" :cols="6" />
 </div>

 <div v-else-if="filteredOrders.length === 0" class="py-40">
 <EmptyState 
 title="No Active Orders" 
 description="The platform fulfillment engine is currently waiting for new requests."
 />
 </div>

 <div v-else class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-50 bg-gray-50/30">
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Timestamp</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Requester Identity</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Asset Value</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Protocol Node (Vendor)</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Status Index</th>
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50/50 transition-all group cursor-pointer" @click="selectedOrder = order">
 <td class="py-6 px-8 whitespace-nowrap min-w-[150px]">
 <div class="flex flex-col">
 <span class="text-xs font-black text-gray-900 tracking-tight">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
 <span class="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">{{ new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
 </div>
 </td>
 <td class="py-6 px-4 min-w-[250px]">
 <div class="flex items-center gap-4">
 <div class="w-10 h-10 rounded-2xl bg-[#065fdb]/10 flex items-center justify-center text-[#065fdb] text-[11px] font-black shadow-inner border border-[#065fdb]/5 group-hover:rotate-6 transition-transform">
 {{ order.user?.firstName?.[0] || '?' }}
 </div>
 <div>
 <p class="text-sm font-black text-gray-900 leading-none mb-1">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
 <p class="text-[9px] font-black text-gray-400 tracking-widest leading-none">ID Mapping: {{ order.user?._id?.slice(-6).toUpperCase() || 'NULL' }}</p>
 </div>
 </div>
 </td>
 <td class="py-6 px-4">
 <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#065fdb]/5 border border-[#065fdb]/10">
 <span class="text-[10px] font-black text-[#065fdb]">₦</span>
 <p class="text-sm font-black text-gray-900 tracking-tighter">{{ Number(order.totalAmount).toLocaleString() }}</p>
 </div>
 </td>
 <td class="py-6 px-4 text-center min-w-[200px]">
 <div class="inline-flex items-center gap-3 pr-4 py-1.5 pl-1.5 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors max-w-full">
 <div class="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[10px] font-black shadow-sm text-indigo-600 shrink-0">
 {{ order.vendor?.storeName?.[0] || 'V' }}
 </div>
 <p class="text-[11px] font-black text-gray-700 truncate tracking-tight">{{ order.vendor?.storeName || 'N/A' }}</p>
 </div>
 </td>
 <td class="py-6 px-4 text-center">
 <div class="flex justify-center">
 <StatusBadge :status="order.status" class="scale-90" />
 </div>
 </td>
 <td class="py-6 px-8 text-right">
 <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#065fdb] group-hover:text-white transition-all duration-300">
 <span class="text-[10px] font-black tracking-widest mr-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all leading-none">Access Details</span>
 <ChevronRight class="w-4 h-4" />
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- SideDrawer Redesign -->
 <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
 <template v-if="selectedOrder">
 <!-- Header Profile -->
 <div class="flex flex-col items-center justify-center pt-12 pb-10 border-b border-gray-50 relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/5 to-transparent opacity-50" />
 <div class="relative mb-6">
 <div class="w-20 h-20 rounded-[1.75rem] bg-[#065fdb] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#065fdb]/30 rotate-3 transition-transform group-hover:rotate-6">
 {{ selectedOrder.user?.firstName?.[0] || '?' }}
 </div>
 <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-xl border-4 border-white shadow-lg" />
 </div>
 
 <h3 class="text-xl font-black text-gray-900 tracking-tighter font-display leading-none">{{ selectedOrder.user?.firstName }} {{ selectedOrder.user?.lastName }}</h3>
 <p class="text-xs font-bold text-gray-400 mt-2 tracking-[0.2em] leading-none mb-8">{{ selectedOrder.user?.email }}</p>
 
 <div class="flex items-center justify-between w-[85%] mt-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-x divide-gray-50">
 <div class="text-center flex-1 py-5 px-4 bg-gray-50/30">
 <p class="text-[9px] font-black text-gray-400 tracking-widest mb-1 leading-none">Asset Value</p>
 <p class="text-base font-black text-gray-900 tracking-tighter">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</p>
 </div>
 <div class="text-center flex-1 py-5 px-4">
 <p class="text-[9px] font-black text-gray-400 tracking-widest mb-1 leading-none">Registry Date</p>
 <p class="text-sm font-black text-gray-900 tracking-tight">{{ new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
 </div>
 </div>
 </div>

 <!-- DETAILS Section -->
 <div class="p-10 space-y-12 pb-32">
 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Transaction Protocol
 </h4>
 <div class="space-y-4">
 <div class="bg-[#065fdb]/5 p-6 rounded-[2rem] border border-[#065fdb]/10 group transition-all hover:bg-[#065fdb]/10">
 <div class="flex items-center justify-between mb-2">
 <span class="text-[10px] font-black text-[#065fdb] tracking-widest leading-none">Order Identifier</span>
 <Copy class="w-4 h-4 text-[#065fdb]/40 cursor-pointer hover:text-[#065fdb] transition-colors" />
 </div>
 <span class="text-sm font-black text-[#065fdb] font-mono tracking-widest break-all">{{ selectedOrder._id.toUpperCase() }}</span>
 </div>
 
 <div class="flex justify-between items-center bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">Status Level</span>
 <StatusBadge :status="selectedOrder.status" class="scale-90 origin-right transition-transform" />
 </div>
 </div>
 </div>

 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Financial Distribution
 </h4>
 <div class="space-y-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
 <div class="flex justify-between items-center text-xs">
 <span class="text-gray-400 font-bold tracking-tight leading-none">Items Valuation</span>
 <span class="text-gray-900 font-black tracking-tight">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
 </div>
 <div class="flex justify-between items-center text-xs">
 <span class="text-gray-400 font-bold tracking-tight leading-none">Service Logistics</span>
 <span class="text-emerald-500 font-black tracking-tight">₦0.00</span>
 </div>
 <div class="w-full h-px bg-gray-50 my-2" />
 <div class="flex justify-between items-center">
 <span class="text-[10px] font-black text-gray-900 tracking-widest leading-none">Aggregate Total</span>
 <span class="text-2xl font-black text-gray-900 tracking-tighter">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
 </div>
 </div>
 </div>

 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Fulfilling Node
 </h4>
 <div class="flex items-center justify-between p-5 rounded-[1.75rem] border border-gray-100 bg-white group hover:border-[#065fdb]/30 transition-all cursor-pointer shadow-sm">
 <div class="flex items-center gap-4 min-w-0">
 <div class="w-12 h-12 rounded-2xl bg-[#065fdb]/5 flex items-center justify-center text-[#065fdb] text-lg font-black shrink-0 border border-[#065fdb]/5 group-hover:rotate-6 transition-transform">
 {{ selectedOrder.vendor?.storeName?.[0] || 'V' }}
 </div>
 <div class="min-w-0">
 <span class="text-base font-black text-gray-900 tracking-tight block truncate leading-none mb-1">{{ selectedOrder.vendor?.storeName || 'N/A' }}</span>
 <span class="text-[10px] font-bold text-gray-400 tracking-widest leading-none">Merchant Node</span>
 </div>
 </div>
 <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#065fdb] group-hover:text-white transition-all duration-300">
 <ChevronRight class="w-4 h-4" />
 </div>
 </div>
 </div>

 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Logistics Target
 </h4>
 <div class="bg-gray-900/5 p-6 rounded-[2rem] border border-gray-100 text-[13px] font-bold text-gray-700 leading-relaxed shadow-inner">
 <div class="flex items-start gap-4">
 <Package class="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
 <p class=" tracking-tight text-[11px] font-black leading-relaxed opacity-80">{{ selectedOrder.shippingAddress || 'No target coordinates provided' }}</p>
 </div>
 </div>
 </div>
 
 <!-- Actions Panel -->
 <div class="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10 flex gap-4">
 <button class="flex-1 py-5 px-6 rounded-[1.5rem] text-rose-500 font-black text-[11px] tracking-widest bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-3" 
 v-if="['pending', 'processing'].includes(selectedOrder.status)">
 Terminate Order
 </button>
 <button class="flex-1 py-5 px-6 rounded-[1.5rem] text-white font-black text-[11px] tracking-widest bg-[#065fdb] hover:bg-indigo-600 transition-all shadow-xl shadow-[#065fdb]/30 flex items-center justify-center gap-3 active:scale-95" 
 v-if="['pending'].includes(selectedOrder.status)">
 Initialize Processing
 </button>
 </div>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { Package, Search, ListFilter, ChevronRight, Copy } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

definePageMeta({
 layout: 'admin'
})

useHead({ title: 'Order Management - Errandr Admin' });

const loading = ref(true);
const orders = ref<any[]>([]);
const searchQuery = ref('');
const selectedStatus = ref('all');
const selectedOrder = ref<any>(null);

const statuses = ['all', 'pending', 'processing', 'completed', 'cancelled'];

const fetchOrders = async () => {
 loading.value = true;
 try {
 const res = await admin_api.getRecentOrders(100);
 orders.value = res.data.orders || res.data;
 } catch (e) {
 console.error(e);
 } finally {
 loading.value = false;
 }
};

const filteredOrders = computed(() => {
 return orders.value.filter(o => {
 const matchesStatus = selectedStatus.value === 'all' || o.status === selectedStatus.value;
 const matchesSearch = !searchQuery.value || 
 o._id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
 (o.user && `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()));
 return matchesStatus && matchesSearch;
 });
});

const totalVolume = computed(() => {
 return orders.value.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
});

onMounted(fetchOrders);
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
 animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.9) translateY(20px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.font-display {
 font-family: 'Roobert PRO', sans-serif;
}
</style>
