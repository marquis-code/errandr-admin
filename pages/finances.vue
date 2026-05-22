<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Search & Quick Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search transactions by name or description..." 
          class="w-full pl-14 pr-14 py-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400"
        />
      </div>
      
      <div class="flex items-center gap-3 shrink-0">
        <button class="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 transition-colors flex items-center gap-2">
          <Download class="w-4 h-4" /> Export
        </button>
      </div>
    </div>

    <!-- Header & Statistics -->
    <div class="space-y-10">
      <div class="space-y-1">
        <h1 class="text-4xl font-bold text-gray-900 font-display">Finances</h1>
        <p class="text-sm font-medium text-gray-500">Track revenue, commissions, and all platform transactions.</p>
      </div>

      <!-- Financial Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Loading State -->
        <template v-if="loading">
          <div v-for="i in 3" :key="`fin-loading-${i}`" class="bg-gray-50 p-8 rounded-3xl border border-gray-100 animate-pulse h-44">
            <div class="w-12 h-12 bg-gray-200 rounded-2xl mb-6"></div>
            <div class="w-28 h-4 bg-gray-200 rounded-md mb-2"></div>
            <div class="w-36 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </template>

        <template v-else>
          <!-- Total Volume Card -->
          <div class="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
              <Wallet class="w-6 h-6 text-emerald-600" />
            </div>
            <p class="text-sm font-semibold text-gray-500 mb-1">Total Volume</p>
            <h2 class="text-3xl font-bold text-gray-900 tabular-nums">₦{{ stats?.totalVolume?.toLocaleString() || '0' }}</h2>
            <div class="flex items-center gap-2 mt-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-sm font-medium text-emerald-600">All time</span>
            </div>
          </div>

          <!-- Commission Card -->
          <div class="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div class="w-12 h-12 rounded-2xl bg-[#FF5C1A]/10 flex items-center justify-center mb-6">
              <TrendingUp class="w-6 h-6 text-[#FF5C1A]" />
            </div>
            <p class="text-sm font-semibold text-gray-500 mb-1">Platform Earnings</p>
            <h2 class="text-3xl font-bold text-[#FF5C1A] tabular-nums">₦{{ stats?.totalCommissions?.toLocaleString() || '0' }}</h2>
            <span class="text-sm font-medium text-gray-500">5% commission</span>
          </div>

          <!-- Net Balance Card -->
          <div class="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
              <ArrowDownLeft class="w-6 h-6 text-indigo-600" />
            </div>
            <p class="text-sm font-semibold text-gray-500 mb-1">Net Balance</p>
            <h2 class="text-3xl font-bold text-gray-900 tabular-nums">₦{{ netBalance.toLocaleString() }}</h2>
            <span class="text-sm font-medium text-indigo-600">Combined wallet balance</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Transaction Ledger -->
    <div class="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden min-h-[500px]">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-700">Transactions</h3>
        <button class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          <ListFilter class="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      <div v-if="loading" class="p-8">
        <SkeletonTable :rows="8" :cols="5" />
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="py-40">
        <EmptyState title="No transactions yet" description="When payments are made, they will show up here." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-100/50">
              <th class="py-5 px-8 font-semibold text-gray-500 text-sm whitespace-nowrap">Date</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">User</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Amount</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap text-center">Type</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Description</th>
              <th class="py-5 px-8 font-semibold text-gray-500 text-sm whitespace-nowrap text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/50">
            <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-white transition-colors group cursor-pointer" @click="selectedTransaction = tx">
              <td class="py-5 px-8 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-xs font-medium text-gray-500">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-5 px-4 min-w-[220px]">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold border border-indigo-200 shrink-0">
                    {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900 leading-none mb-1 truncate">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
                    <p class="text-xs font-medium text-gray-500 truncate">{{ tx.wallet?.owner?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-5 px-4">
                <div class="inline-flex items-center gap-2 pr-3 py-1.5 pl-1.5 bg-white border border-gray-200 rounded-xl">
                  <div :class="tx.type === 'credit' ? 'bg-emerald-500' : 'bg-rose-500'" class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {{ tx.type === 'credit' ? '+' : '-' }}
                  </div>
                  <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-sm font-bold tabular-nums">
                    ₦{{ tx.amount?.toLocaleString() }}
                  </p>
                </div>
              </td>
              <td class="py-5 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="tx.type" class="scale-90" />
                </div>
              </td>
              <td class="py-5 px-4 max-w-[250px]">
                <p class="text-sm font-medium text-gray-500 truncate">{{ tx.description }}</p>
              </td>
              <td class="py-5 px-8 text-right">
                <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-500 group-hover:bg-[#FF5C1A] group-hover:text-white transition-colors">
                  <span class="text-sm font-semibold mr-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">View</span>
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
        <div class="flex flex-col items-center justify-center pt-12 pb-10 border-b border-gray-200">
          <div class="relative mb-4">
            <div class="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 font-display mb-1">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
          <p class="text-sm font-medium text-gray-500 mb-8">{{ selectedTransaction.wallet?.owner?.email }}</p>
          
          <div class="flex flex-col items-center justify-center w-4/5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p class="text-sm font-semibold text-gray-500 mb-2">Amount</p>
            <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-3xl font-bold mb-2 tabular-nums">
              {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ selectedTransaction.amount?.toLocaleString() }}
            </p>
            <StatusBadge :status="selectedTransaction.type" />
          </div>
        </div>

        <div class="p-8 space-y-10 pb-32">
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-400 uppercase">Transaction Details</h4>
            <div class="space-y-3">
              <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-500">Transaction ID</span>
                  <Copy class="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
                </div>
                <span class="text-sm font-semibold text-gray-900 break-all">{{ selectedTransaction._id }}</span>
              </div>
              
              <div class="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span class="text-sm font-semibold text-gray-500">Date & Time</span>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
                  <p class="text-xs font-medium text-gray-500">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</p>
                </div>
              </div>
              
              <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div class="flex items-start gap-3">
                  <FileText class="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div class="space-y-1">
                    <span class="text-sm font-semibold text-gray-500">Description</span>
                    <p class="text-sm font-medium text-gray-700 leading-relaxed">{{ selectedTransaction.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4" v-if="selectedTransaction.order">
            <h4 class="text-xs font-bold text-gray-400 uppercase">Linked Order</h4>
            <div class="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Package class="w-5 h-5 text-white" />
                </div>
                <div>
                  <span class="text-sm font-bold text-gray-900 block leading-none mb-1">Order</span>
                  <span class="text-sm font-semibold text-[#FF5C1A]">#{{ selectedTransaction.order.slice(-12) }}</span>
                </div>
              </div>
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <!-- Download action -->
          <div class="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-10">
            <button class="w-full py-4 px-6 rounded-2xl text-white font-bold text-sm bg-gray-900 hover:bg-black transition-colors flex items-center justify-center gap-2">
              <Download class="w-4 h-4" /> Download Receipt
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

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>
