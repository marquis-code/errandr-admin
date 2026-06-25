<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Search & Quick Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search transactions by name or description..." 
          class="w-full pl-10 pr-4 py-2.5 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] placeholder:text-gray-400 shadow-sm"
        />
      </div>
      
      <div class="flex items-center gap-2 shrink-0">
        <button class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
          <Download class="w-3.5 h-3.5" /> Export
        </button>
      </div>
    </div>

    <!-- Header & Statistics -->
    <div class="space-y-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Finances</h1>
        <p class="text-xs font-medium text-gray-500">Track revenue, commissions, and all platform transactions.</p>
      </div>

      <!-- Financial Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Loading State -->
        <template v-if="loading">
          <div v-for="i in 3" :key="`fin-loading-${i}`" class="bg-white p-5 rounded-xl border border-gray-200 animate-pulse h-32 shadow-sm">
            <div class="w-8 h-8 bg-gray-200 rounded-lg mb-4"></div>
            <div class="w-24 h-3 bg-gray-200 rounded mb-2"></div>
            <div class="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
        </template>

        <template v-else>
          <!-- Total Volume Card -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-3 border border-emerald-100">
              <Wallet class="w-4 h-4 text-emerald-600" />
            </div>
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total Volume</p>
            <h2 class="text-xl font-bold text-gray-900 tabular-nums">₦{{ (stats?.totalVolume || 0).toLocaleString() }}</h2>
            <div class="flex items-center gap-1.5 mt-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-[10px] font-semibold text-emerald-600">All time</span>
            </div>
          </div>

          <!-- Commission Card -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-[#FF5C1A]/10 flex items-center justify-center mb-3 border border-[#FF5C1A]/20">
              <TrendingUp class="w-4 h-4 text-[#FF5C1A]" />
            </div>
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Platform Earnings</p>
            <h2 class="text-xl font-bold text-[#FF5C1A] tabular-nums">₦{{ (stats?.totalCommissions || 0).toLocaleString() }}</h2>
            <span class="text-[10px] font-semibold text-gray-500 mt-1 block">5% commission</span>
          </div>

          <!-- Net Balance Card -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 border border-indigo-100">
              <ArrowDownLeft class="w-4 h-4 text-indigo-600" />
            </div>
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Net Balance</p>
            <h2 class="text-xl font-bold text-gray-900 tabular-nums">₦{{ (netBalance || 0).toLocaleString() }}</h2>
            <span class="text-[10px] font-semibold text-indigo-600 mt-1 block">Combined wallet balance</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Transaction Ledger -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px] shadow-sm">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wide">Transactions</h3>
        <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
          <ListFilter class="w-3 h-3" />
          Filter
        </button>
      </div>

      <div v-if="loading" class="p-5">
        <SkeletonTable :rows="8" :cols="5" />
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="py-20 text-center">
        <EmptyState title="No transactions yet" description="When payments are made, they will show up here." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50">
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Date</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">User</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Amount</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-center">Type</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Description</th>
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-colors group cursor-pointer" @click="selectedTransaction = tx">
              <td class="py-3 px-5 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-900">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-[10px] font-medium text-gray-500">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-3 px-4 min-w-[200px]">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold border border-indigo-100 shrink-0">
                    {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-none mb-0.5 truncate">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
                    <p class="text-[10px] font-medium text-gray-500 truncate">{{ tx.wallet?.owner?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="inline-flex items-center gap-1.5 pr-2 py-1 pl-1 bg-white border border-gray-200 rounded-md">
                  <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="w-5 h-5 border rounded flex items-center justify-center text-[10px] font-bold shrink-0">
                    {{ tx.type === 'credit' ? '+' : '-' }}
                  </div>
                  <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-xs font-bold tabular-nums">
                    ₦{{ (tx.amount || 0).toLocaleString() }}
                  </p>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="tx.type" class="scale-75 origin-center" />
                </div>
              </td>
              <td class="py-3 px-4 max-w-[200px]">
                <p class="text-[11px] font-medium text-gray-500 truncate">{{ tx.description }}</p>
              </td>
              <td class="py-3 px-5 text-right">
                <div class="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 group-hover:bg-gray-100 transition-colors">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer for Transaction Details -->
    <SideDrawer :isOpen="!!selectedTransaction" @close="selectedTransaction = null">
      <template v-if="selectedTransaction">
        <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
          <div class="relative mb-3">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 font-heading mb-0.5">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
          <p class="text-[11px] font-medium text-gray-500 mb-6">{{ selectedTransaction.wallet?.owner?.email }}</p>
          
          <div class="flex flex-col items-center justify-center w-4/5 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
            <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-xl font-bold mb-2 tabular-nums">
              {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ (selectedTransaction.amount || 0).toLocaleString() }}
            </p>
            <StatusBadge :status="selectedTransaction.type" class="scale-75" />
          </div>
        </div>

        <div class="p-6 space-y-6 pb-24 bg-gray-50/30">
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Transaction Details</h4>
            <div class="space-y-2">
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-gray-500">Transaction ID</span>
                  <Copy class="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
                </div>
                <span class="text-xs font-semibold text-gray-900 break-all font-mono">{{ selectedTransaction._id }}</span>
              </div>
              
              <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span class="text-xs font-semibold text-gray-500">Date & Time</span>
                <div class="text-right">
                  <p class="text-xs font-semibold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                  <p class="text-[10px] font-medium text-gray-500">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex items-start gap-2">
                  <FileText class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div class="space-y-0.5">
                    <span class="text-xs font-semibold text-gray-500">Description</span>
                    <p class="text-xs font-medium text-gray-700 leading-relaxed">{{ selectedTransaction.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3" v-if="selectedTransaction.order">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Linked Order</h4>
            <div class="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Package class="w-4 h-4 text-white" />
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-900 block leading-none mb-0.5">Order</span>
                  <span class="text-[10px] font-semibold text-[#FF5C1A]">#{{ selectedTransaction.order.slice(-12) }}</span>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <!-- Download action -->
          <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10">
            <button class="w-full py-3 px-4 rounded-lg text-white font-semibold text-xs bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Download class="w-3.5 h-3.5" /> Download Receipt
            </button>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { useAdminFinances } from '@/composables/modules/admin';
import { Download, Wallet, TrendingUp, ArrowDownLeft, Search, ListFilter, ChevronRight, Copy, FileText, Package } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Finances - Errander Admin' });

const { stats, transactions, loading, fetchFinances } = useAdminFinances();

const searchQuery = ref('');
const selectedTransaction = ref<any>(null);

const netBalance = computed(() => {
  return transactions.value.reduce((acc: number, t: any) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);
});

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;
  const q = searchQuery.value.toLowerCase();
  return transactions.value.filter((tx: any) => 
    tx.description?.toLowerCase().includes(q) || 
    tx.wallet?.owner?.firstName?.toLowerCase().includes(q) ||
    tx.wallet?.owner?.lastName?.toLowerCase().includes(q)
  );
});

onMounted(fetchFinances);
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
