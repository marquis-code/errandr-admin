<template>
 <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
 <!-- Search & Quick Stats -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
 <div class="flex-1 relative max-w-2xl group">
 <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#065fdb] transition-colors" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search merchant, store or category..." 
 class="w-full pl-14 pr-14 py-4 bg-white hover:bg-gray-50/50 transition-all border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-[#065fdb]/5 focus:border-[#065fdb]/20 placeholder:text-gray-300 placeholder:font-bold shadow-sm shadow-gray-100/50"
 />
 </div>
 
 <div class="flex items-center gap-6 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0 transition-transform hover:scale-[1.02]">
 <div class="w-10 h-10 rounded-xl bg-[#065fdb]/5 flex items-center justify-center">
 <Store class="w-5 h-5 text-[#065fdb]" />
 </div>
 <div class="flex flex-col">
 <span class="text-[10px] font-black text-gray-400 tracking-widest">Global Network</span>
 <span class="text-lg font-black text-gray-900 leading-none">{{ vendors.length }} Merchants</span>
 </div>
 </div>
 </div>

 <!-- Header & Tabs -->
 <div class="space-y-8">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div class="space-y-1">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display">Merchant Registry</h1>
 <p class="text-xs font-bold text-gray-400 tracking-widest leading-none">Oversee partnerships and store operational status.</p>
 </div>
 </div>
 
 <div class="flex overflow-x-auto pb-4 hide-scrollbar gap-2">
 <button 
 v-for="tab in tabs" 
 :key="tab.key" 
 @click="activeTab = tab.key" 
 class="px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] whitespace-nowrap border shrink-0"
 :class="activeTab === tab.key ? 'bg-[#065fdb] text-white border-[#065fdb] shadow-lg shadow-[#065fdb]/20' : 'text-gray-400 hover:text-gray-900 bg-white border-gray-100'"
 >
 {{ tab.label }}
 </button>
 </div>
 </div>

 <!-- Table Section -->
 <div class="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
 <!-- Loading State -->
 <div v-if="loading" class="p-8">
 <SkeletonTable :rows="8" :cols="5" />
 </div>

 <!-- Empty State -->
 <div v-else-if="filteredVendors.length === 0" class="py-32">
 <EmptyState 
 title="No Merchants Identified" 
 :description="emptyStateDescription"
 />
 </div>

 <!-- Table View -->
 <div v-else class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-50 bg-gray-50/30">
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Merchant Identity</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Classification</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Status</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Ownership</th>
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-right">Operational Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="vendor in filteredVendors" :key="vendor._id" class="hover:bg-gray-50/50 transition-all group cursor-default">
 <td class="py-6 px-8 min-w-[300px]">
 <div class="flex items-center gap-5">
 <div class="relative">
 <div class="w-14 h-14 rounded-2xl bg-[#065fdb]/5 flex items-center justify-center text-3xl shadow-inner border border-[#065fdb]/5 group-hover:rotate-6 transition-transform">
 🏪
 </div>
 <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white shadow-sm" />
 </div>
 <div class="min-w-0">
 <p class="text-base font-black text-gray-900 leading-none mb-1.5">{{ vendor.storeName }}</p>
 <p class="text-[10px] font-black text-[#065fdb] tracking-[0.15em] opacity-70">ID: {{ vendor._id.slice(-8).toUpperCase() }}</p>
 </div>
 </div>
 </td>
 <td class="py-6 px-4 whitespace-nowrap">
 <span class="text-[9px] font-black text-gray-500 tracking-[0.2em] bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
 {{ vendor.category || 'Standard' }}
 </span>
 </td>
 <td class="py-6 px-4 text-center">
 <div class="flex justify-center">
 <StatusBadge :status="vendor.status" class="scale-90" />
 </div>
 </td>
 <td class="py-6 px-4">
 <div class="flex flex-col">
 <p class="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">{{ vendor.owner?.firstName }} {{ vendor.owner?.lastName }}</p>
 <span class="text-[10px] font-bold text-gray-400 tracking-widest">{{ vendor.owner?.email }}</span>
 </div>
 </td>
 <td class="py-6 px-8 text-right">
 <div class="flex justify-end gap-2 group/actions">
 <button 
 v-if="vendor.status === 'pending'" 
 @click="approveVendor(vendor._id)" 
 class="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
 >
 Authorize
 </button>
 <button 
 v-if="vendor.status !== 'suspended'" 
 @click="rejectVendor(vendor._id)" 
 class="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-500 text-[10px] font-black tracking-widest border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
 >
 Suspend
 </button>
 <button 
 v-if="vendor.status === 'suspended'" 
 @click="approveVendor(vendor._id)" 
 class="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
 >
 Restore
 </button>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { useAdminVendors } from '@/composables/modules/admin';
import { Search, Mail } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';

definePageMeta({
 layout: 'admin'
})

useHead({ title: 'Vendors - Errandr Admin' });

const { vendors, loading, fetchVendors, approveVendor, rejectVendor } = useAdminVendors();
const activeTab = ref('all');
const searchQuery = ref('');

const tabs = [
 { key: 'all', label: 'All Stores' },
 { key: 'pending', label: 'Awaiting Approval' },
 { key: 'approved', label: 'Verified Partners' },
 { key: 'suspended', label: 'Under Suspension' },
];

const filteredVendors = computed(() => {
 return vendors.value.filter((v) => {
 const matchesTab = activeTab.value === 'all' || v.status === activeTab.value;
 const matchesSearch = !searchQuery.value || 
 v.storeName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
 (v.category && v.category.toLowerCase().includes(searchQuery.value.toLowerCase()));
 return matchesTab && matchesSearch;
 });
});

const emptyStateDescription = computed(() => {
 if (searchQuery.value) {
 return `No merchants match "${searchQuery.value}" in ${activeTab.value} category.`;
 }
 return `There are currently no merchants in the ${activeTab.value} category.`;
});

onMounted(fetchVendors);
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
