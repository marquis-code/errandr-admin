<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Earned -->
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 pointer-events-none"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earned</h3>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-auto">
            <span class="text-3xl font-black text-gray-900 font-mono tracking-tight">₦{{ formatAmount(user?.totalEarned || 0) }}</span>
            <p class="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              Lifetime earnings
            </p>
          </div>
        </div>
      </div>

      <!-- Paid Out -->
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Paid Out</h3>
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Banknote class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-auto">
            <span class="text-3xl font-black text-gray-900 font-mono tracking-tight">₦{{ formatAmount((user?.totalEarned || 0) - (user?.walletBalance || 0)) }}</span>
            <p class="text-[11px] font-semibold text-gray-500 mt-2 flex items-center gap-1">
              Successfully withdrawn
            </p>
          </div>
        </div>
      </div>

      <!-- Wallet Balance -->
      <div class="bg-[#FF5C1A] rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full opacity-50 pointer-events-none"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold text-white/80 uppercase tracking-wider">Current Balance</h3>
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <Wallet class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-auto">
            <span class="text-3xl font-black text-white font-mono tracking-tight">₦{{ formatAmount(user?.walletBalance || 0) }}</span>
            <p class="text-[11px] font-semibold text-white/80 mt-2 flex items-center gap-1">
              Available in wallet
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payout History Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div class="p-6 border-b border-gray-100/60 bg-gray-50/30 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A]">
            <History class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Transaction History</h3>
            <p class="text-xs text-gray-500 font-medium">All financial activities for this user.</p>
          </div>
        </div>
      </div>

      <div v-if="loadingTransactions" class="p-12 flex justify-center items-center">
        <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="transactions.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
          <Receipt class="w-8 h-8 text-gray-300" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">No Transactions Found</h3>
        <p class="text-sm text-gray-500 max-w-sm">This user doesn't have any transaction history yet.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="border-b border-gray-100/60 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500">
              <th class="py-4 px-6 font-bold whitespace-nowrap">Date & Time</th>
              <th class="py-4 px-6 font-bold whitespace-nowrap">Details</th>
              <th class="py-4 px-6 font-bold whitespace-nowrap text-right">Amount</th>
              <th class="py-4 px-6 font-bold whitespace-nowrap text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="txn in transactions" :key="txn._id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Date & Time -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900">{{ new Date(txn.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
                  <span class="text-xs font-medium text-gray-500">{{ new Date(txn.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              
              <!-- Transaction Info -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1"
                      :class="txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                    >
                      <ArrowDownLeft v-if="txn.type === 'credit'" class="w-3 h-3" />
                      <ArrowUpRight v-else class="w-3 h-3" />
                      {{ txn.type }}
                    </span>
                    <span class="text-[10px] font-mono font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {{ txn.reference || 'N/A' }}
                    </span>
                  </div>
                  <span class="text-sm font-medium text-gray-700 mt-1.5 truncate max-w-[300px]" :title="txn.description">{{ txn.description || 'No description' }}</span>
                </div>
              </td>
              
              <!-- Amount -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <span 
                  class="text-base font-black font-mono tracking-tight"
                  :class="txn.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'"
                >
                  {{ txn.type === 'credit' ? '+' : '-' }}₦{{ formatAmount(txn.amount) }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <div class="flex justify-end">
                  <StatusBadge :status="txn.status" class="scale-90 origin-right" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer (if needed in the future) -->
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <button 
          @click="page > 1 && fetchTransactions(page - 1)"
          :disabled="page === 1"
          class="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span class="text-sm font-medium text-gray-600">Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="page < totalPages && fetchTransactions(page + 1)"
          :disabled="page === totalPages"
          class="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { admin_api } from '@/api_factory/modules/admin';
import { wallets_api } from '@/api_factory/modules/wallets';
import { TrendingUp, Banknote, Wallet, History, ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-vue-next';
import StatusBadge from '@/components/ui/StatusBadge.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  }
});

const user = ref<any>(null);
const transactions = ref<any[]>([]);
const loadingTransactions = ref(true);
const page = ref(1);
const totalPages = ref(1);

const formatAmount = (amount: number) => {
  return Number(amount).toLocaleString();
};

const fetchUserDetails = async () => {
  try {
    const res = await admin_api.getUser(props.userId);
    user.value = res.data;
  } catch (e) {
    console.error('Error fetching user finances:', e);
  }
};

const fetchTransactions = async (pageNum: number = 1) => {
  loadingTransactions.value = true;
  page.value = pageNum;
  try {
    const res = await wallets_api.getTransactions(pageNum, 20, { userId: props.userId });
    if (res.data?.transactions) {
      transactions.value = res.data.transactions;
      totalPages.value = res.data.totalPages || 1;
    }
  } catch (e) {
    console.error('Error fetching transactions:', e);
  } finally {
    loadingTransactions.value = false;
  }
};

onMounted(() => {
  fetchUserDetails();
  fetchTransactions();
});
</script>
