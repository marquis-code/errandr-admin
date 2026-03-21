<template>
  <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Search Bar -->
    <div class="flex items-center justify-between gap-4 mb-4 mt-2">
      <div class="flex-1 relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search or jump to" 
          class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-700 transition-all flex items-center gap-2">
          <Download class="w-4 h-4" /> Export All
        </button>
      </div>
    </div>

    <!-- Header & Filters -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-1">Transactions</h1>
          <p class="text-gray-500 text-sm font-medium">Platform-wide transaction history and revenue surveillance.</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
          <ListFilter class="w-4 h-4" />
          Filters
        </button>
        <span class="text-sm font-medium text-gray-400">No filters applied</span>
      </div>
    </div>

    <!-- Financial Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 relative">Gross Transaction Volume</p>
        <h2 class="text-4xl font-bold text-gray-900 relative tracking-tighter">₦{{ stats?.totalVolume?.toLocaleString() || '0' }}</h2>
        <div class="mt-4 relative flex items-center gap-2">
           <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold">↑ 100%</span>
           <span class="text-[10px] text-gray-400 font-medium">Lifetime performance</span>
        </div>
      </div>

      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-parentPrimary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 relative">Platform Revenue (5%)</p>
        <h2 class="text-4xl font-bold text-parentPrimary relative tracking-tighter">₦{{ stats?.totalCommissions?.toLocaleString() || '0' }}</h2>
        <p class="text-[10px] text-gray-400 mt-4 relative font-medium">Earned from subtotal commissions</p>
      </div>

      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 relative">Net Wallet Floating</p>
        <h2 class="text-4xl font-bold text-gray-900 relative tracking-tighter">₦{{ transactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0).toLocaleString() }}</h2>
        <p class="text-[10px] text-gray-400 mt-4 relative font-medium italic">Aggregated network balance</p>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="bg-white">
       <div class="overflow-x-auto pb-20">
          <div v-if="loading" class="p-20 text-center">
             <SkeletonTable :rows="8" :cols="5" />
          </div>
          
          <div v-else-if="filteredTransactions.length === 0">
             <EmptyState title="No transactions yet" description="All platform transactions will be displayed here." />
          </div>

          <table v-else class="w-full text-left border-collapse">
             <thead>
                <tr class="border-b border-gray-100">
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Created on</th>
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Entity / User</th>
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Amount</th>
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Type</th>
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Description</th>
                   <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-50/50">
                <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedTransaction = tx">
                   <td class="py-4 px-2">
                     <span class="text-xs font-medium text-gray-900">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                   </td>
                   <td class="py-4 px-2 min-w-[200px]">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                            {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
                         </div>
                         <div>
                            <p class="text-[13px] font-medium text-gray-900 leading-tight mb-0.5">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
                            <p class="text-[11px] text-gray-500 truncate max-w-[150px]">{{ tx.wallet?.owner?.email }}</p>
                         </div>
                      </div>
                   </td>
                   <td class="py-4 px-2">
                      <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-[13px] font-bold tracking-tighter">
                         {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount?.toLocaleString() }}
                      </p>
                   </td>
                   <td class="py-4 px-2">
                      <StatusBadge :status="tx.type" class="scale-90 origin-left" />
                   </td>
                   <td class="py-4 px-2 max-w-[200px] truncate">
                      <p class="text-[13px] font-medium text-gray-700 truncate">{{ tx.description }}</p>
                   </td>
                   <td class="py-4 px-2 text-right">
                      <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- SideDrawer for Transaction Details -->
    <SideDrawer :isOpen="!!selectedTransaction" @close="selectedTransaction = null">
      <template v-if="selectedTransaction">
        <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100">
           <div class="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm mb-3">
             {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
           </div>
           <h3 class="text-lg font-bold text-gray-900">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
           <p class="text-sm text-gray-500">{{ selectedTransaction.wallet?.owner?.email }}</p>
           
           <div class="flex flex-col items-center justify-center w-full mt-6 bg-gray-50 p-6 rounded-xl border border-gray-100/50">
             <p class="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Transaction Amount</p>
             <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-3xl font-black mb-1">
               {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ selectedTransaction.amount?.toLocaleString() }}
             </p>
             <StatusBadge :status="selectedTransaction.type" class="scale-90" />
           </div>
        </div>

        <div class="py-6 space-y-6">
          <div>
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Request Details</h4>
            <div class="space-y-4">
               <div class="flex justify-between items-start text-sm">
                 <span class="text-gray-500 font-medium">Transaction ID</span>
                 <span class="text-parentPrimary font-medium font-mono flex items-center gap-1.5">{{ selectedTransaction._id.toUpperCase() }} <Copy class="w-3.5 h-3.5 cursor-pointer hover:text-green-600 transition-colors" /></span>
               </div>
               <div class="flex justify-between items-start text-sm">
                 <span class="text-gray-500 font-medium">Date & Time</span>
                 <span class="text-gray-900 font-bold whitespace-nowrap text-right">
                   {{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }} <br>
                   <span class="text-[11px] text-gray-400 font-medium">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                 </span>
               </div>
               <div class="flex justify-between items-start text-sm">
                 <span class="text-gray-500 font-medium whitespace-nowrap">Description</span>
                 <span class="text-gray-900 font-medium text-right ml-4">{{ selectedTransaction.description }}</span>
               </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100" v-if="selectedTransaction.order">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Related Order</h4>
            <div class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-white">
               <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                   📦
                 </div>
                 <span class="text-sm font-bold text-gray-900 font-mono">#{{ selectedTransaction.order.slice(-8).toUpperCase() }}</span>
               </div>
               <span class="text-[11px] font-bold text-parentPrimary hover:text-green-700 transition-colors px-2 cursor-pointer">View Order</span>
            </div>
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
