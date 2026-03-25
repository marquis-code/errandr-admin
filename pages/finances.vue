<template>
 <div class="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
 <!-- Search & Quick Actions -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-gray-50">
 <div class="flex-1 relative max-w-2xl group">
 <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#065fdb] transition-colors" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search transaction, ID or entity..." 
 class="w-full pl-14 pr-14 py-4 bg-white hover:bg-gray-50/50 transition-all border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-[#065fdb]/5 focus:border-[#065fdb]/20 placeholder:text-gray-300 placeholder:font-bold shadow-sm"
 />
 </div>
 
 <div class="flex items-center gap-4 shrink-0">
 <button class="px-8 py-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black text-gray-600 tracking-widest transition-all flex items-center gap-3 shadow-sm active:scale-95">
 <Download class="w-4 h-4" /> Comprehensive Export
 </button>
 </div>
 </div>

 <!-- Header & Statistics -->
 <div class="space-y-10">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
 <div class="space-y-1">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#065fdb] to-indigo-600">Financial Surveillance</h1>
 <p class="text-xs font-bold text-gray-400 tracking-[0.2em] leading-none">Real-time ecosystem capital flow and revenue performance monitor.</p>
 </div>
 </div>

 <!-- High-End Financial Cards -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
 <!-- Gross Card -->
 <div class="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#065fdb]/5 transition-all duration-500">
 <div class="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000" />
 <div class="relative z-10 space-y-4">
 <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/5">
 <CreditCard class="w-6 h-6 text-emerald-600" />
 </div>
 <p class="text-[10px] font-black text-gray-400 tracking-[0.3em] leading-none mb-1">Gross Ecosystem Volume</p>
 <h2 class="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2 tabular-nums">₦{{ stats?.totalVolume?.toLocaleString() || '0' }}</h2>
 <div class="flex items-center gap-2">
 <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span class="text-[10px] font-black text-emerald-600 tracking-widest">Aggregate Lifetime Flow</span>
 </div>
 </div>
 </div>

 <!-- Revenue Card -->
 <div class="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#065fdb]/5 transition-all duration-500">
 <div class="absolute -right-8 -top-8 w-40 h-40 bg-[#065fdb]/5 rounded-full group-hover:scale-150 transition-transform duration-1000" />
 <div class="relative z-10 space-y-4">
 <div class="w-12 h-12 rounded-2xl bg-[#065fdb]/10 flex items-center justify-center mb-6 border border-[#065fdb]/5">
 <ArrowUpRight class="w-6 h-6 text-[#065fdb]" />
 </div>
 <p class="text-[10px] font-black text-gray-400 tracking-[0.3em] leading-none mb-1">Protocol Revenue Stream</p>
 <h2 class="text-4xl font-black text-[#065fdb] tracking-tighter leading-none mb-2 tabular-nums">₦{{ stats?.totalCommissions?.toLocaleString() || '0' }}</h2>
 <span class="text-[10px] font-black text-gray-400 tracking-widest">5% Ecosystem Commission Index</span>
 </div>
 </div>

 <!-- Net Balance Card -->
 <div class="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#065fdb]/5 transition-all duration-500">
 <div class="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000" />
 <div class="relative z-10 space-y-4">
 <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/5">
 <ArrowDownLeft class="w-6 h-6 text-indigo-600" />
 </div>
 <p class="text-[10px] font-black text-gray-400 tracking-[0.3em] leading-none mb-1">Net Network Balance</p>
 <h2 class="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2 tabular-nums">₦{{ transactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0).toLocaleString() }}</h2>
 <span class="text-[10px] font-black text-indigo-400 tracking-widest italic leading-none">Aggregated Liquid Capital</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Transaction Ledger -->
 <div class="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden min-h-[500px]">
 <div class="p-6 border-b border-gray-50/50 bg-gray-50/30 flex items-center justify-between">
 <h3 class="text-[11px] font-black text-gray-400 tracking-[0.3em] leading-none">Operational Ledger</h3>
 <button class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-[10px] font-black text-gray-600 border border-gray-100 hover:shadow-sm transition-all active:scale-95">
 <ListFilter class="w-3.5 h-3.5" />
 Control Layer Filters
 </button>
 </div>

 <div v-if="loading" class="p-12">
 <SkeletonTable :rows="8" :cols="5" />
 </div>

 <div v-else-if="filteredTransactions.length === 0" class="py-40">
 <EmptyState title="No Records Detected" description="The financial registry is currently waiting for operational updates." />
 </div>

 <div v-else class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-50 bg-gray-50/30">
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Timestamp</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Entity Signature</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Value Index</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Type Node</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Log Description</th>
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-right">Details</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-all group cursor-pointer" @click="selectedTransaction = tx">
 <td class="py-6 px-8 whitespace-nowrap">
 <div class="flex flex-col">
 <span class="text-xs font-black text-gray-900 tracking-tight leading-none mb-1">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
 <span class="text-[9px] font-bold text-gray-400 tracking-widest leading-none">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
 </div>
 </td>
 <td class="py-6 px-4 min-w-[250px]">
 <div class="flex items-center gap-4">
 <div class="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 text-[11px] font-black shadow-inner border border-indigo-600/5 group-hover:rotate-6 transition-transform">
 {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
 </div>
 <div class="min-w-0">
 <p class="text-sm font-black text-gray-900 leading-none mb-1 truncate">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
 <p class="text-[9px] font-black text-gray-400 tracking-widest leading-none truncate">{{ tx.wallet?.owner?.email }}</p>
 </div>
 </div>
 </td>
 <td class="py-6 px-4">
 <div class="inline-flex items-center gap-2 pr-4 py-1.5 pl-1.5 bg-white border border-gray-100 rounded-xl group-hover:border-[#065fdb]/20 transition-all">
 <div :class="tx.type === 'credit' ? 'bg-emerald-500' : 'bg-rose-500'" class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm shadow-black/5">
 {{ tx.type === 'credit' ? '+' : '-' }}
 </div>
 <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-sm font-black tracking-tighter tabular-nums">
 ₦{{ tx.amount?.toLocaleString() }}
 </p>
 </div>
 </td>
 <td class="py-6 px-4 text-center">
 <div class="flex justify-center">
 <StatusBadge :status="tx.type" class="scale-90" />
 </div>
 </td>
 <td class="py-6 px-4 max-w-[250px]">
 <p class="text-[11px] font-bold text-gray-500 tracking-tight leading-relaxed truncate">{{ tx.description }}</p>
 </td>
 <td class="py-6 px-8 text-right">
 <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#065fdb] group-hover:text-white transition-all duration-300">
 <span class="text-[10px] font-black tracking-widest mr-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all leading-none">View Proof</span>
 <ChevronRight class="w-4 h-4" />
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- SideDrawer Redesign -->
 <SideDrawer :isOpen="!!selectedTransaction" @close="selectedTransaction = null">
 <template v-if="selectedTransaction">
 <div class="flex flex-col items-center justify-center pt-12 pb-10 border-b border-gray-50 relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/5 to-transparent opacity-50" />
 <div class="relative mb-6">
 <div class="w-20 h-20 rounded-[1.75rem] bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-600/30 rotate-3 transition-transform">
 {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
 </div>
 <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-xl border-4 border-white shadow-lg" />
 </div>
 
 <h3 class="text-xl font-black text-gray-900 tracking-tighter font-display leading-none leading-none mb-2">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
 <p class="text-[11px] font-black text-gray-400 tracking-[0.2em] leading-none mb-10">{{ selectedTransaction.wallet?.owner?.email }}</p>
 
 <div class="flex flex-col items-center justify-center w-[85%] bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 relative">
 <p class="text-[10px] tracking-[0.3em] font-black text-gray-400 mb-2 leading-none">Registered Value</p>
 <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-600 text-shadow-emerald' : 'text-rose-600 text-shadow-rose'" class="text-4xl font-black mb-3 tabular-nums tracking-tighter">
 {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ selectedTransaction.amount?.toLocaleString() }}
 </p>
 <StatusBadge :status="selectedTransaction.type" class="scale-100" />
 </div>
 </div>

 <div class="p-10 space-y-12 pb-32">
 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Capital Profile
 </h4>
 <div class="space-y-4">
 <div class="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-100/50">
 <div class="flex items-center justify-between mb-2">
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">Internal Registry ID</span>
 <Copy class="w-4 h-4 text-gray-300 cursor-pointer hover:text-[#065fdb] transition-colors" />
 </div>
 <span class="text-sm font-black text-gray-900 font-mono tracking-widest break-all leading-none">{{ selectedTransaction._id }}</span>
 </div>
 
 <div class="flex justify-between items-center bg-gray-900/5 p-5 rounded-2xl border border-gray-100">
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">Operational Timestamp</span>
 <div class="text-right">
 <p class="text-[11px] font-black text-gray-900 leading-none mb-1">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest leading-none">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</p>
 </div>
 </div>
 
 <div class="bg-[#065fdb]/5 p-6 rounded-[2rem] border border-[#065fdb]/10">
 <div class="flex items-start gap-4">
 <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs shadow-sm shrink-0 border border-[#065fdb]/10">📝</div>
 <div class="space-y-1">
 <span class="text-[10px] font-black text-[#065fdb] tracking-widest leading-none">Log Entry Description</span>
 <p class="text-xs font-bold text-gray-700 leading-relaxed tracking-tight">{{ selectedTransaction.description }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div class="space-y-6" v-if="selectedTransaction.order">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Source Node Binding
 </h4>
 <div class="flex items-center justify-between p-6 rounded-[2rem] border border-gray-50 bg-white group hover:border-[#065fdb]/30 transition-all cursor-pointer shadow-sm relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 <div class="flex items-center gap-4 relative z-10">
 <div class="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/10">📦</div>
 <div>
 <span class="text-xs font-black text-gray-900 tracking-widest block leading-none mb-1">Order Index Binding</span>
 <span class="text-sm font-black text-[#065fdb] font-mono tracking-tighter">#{{ selectedTransaction.order.slice(-12).toUpperCase() }}</span>
 </div>
 </div>
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#065fdb] group-hover:text-white transition-all duration-300 relative z-10">
 <ChevronRight class="w-5 h-5" />
 </div>
 </div>
 </div>
 
 <!-- Proof Actions -->
 <div class="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
 <button class="w-full py-5 px-6 rounded-[1.5rem] text-white font-black text-[11px] tracking-widest bg-gray-900 hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95">
 <Download class="w-4 h-4" /> Download Transaction Ledger Proof
 </button>
 </div>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { useAdminFinances } from '@/composables/modules/admin';
import { Download, CreditCard, ArrowUpRight, ArrowDownLeft, Search, ListFilter, ChevronRight, Copy } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

definePageMeta({
 layout: 'admin'
})

useHead({ title: 'Financial Ledger - Errandr Admin' });

const { stats, transactions, loading, fetchFinances } = useAdminFinances();

const searchQuery = ref('');
const selectedTransaction = ref<any>(null);

const filteredTransactions = computed(() => {
 if (!searchQuery.value) return transactions.value;
 const q = searchQuery.value.toLowerCase();
 return transactions.value.filter(tx => 
 tx.description?.toLowerCase().includes(q) || 
 tx.wallet?.owner?.firstName?.toLowerCase().includes(q) ||
 tx.wallet?.owner?.lastName?.toLowerCase().includes(q)
 );
});

onMounted(fetchFinances);
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
