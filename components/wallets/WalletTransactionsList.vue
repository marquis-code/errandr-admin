<template>
  <div class="space-y-4 relative min-h-[300px]">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-sm">
      <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-if="transactions.length === 0 && !loading" class="text-center py-8">
      <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <Receipt class="w-6 h-6 text-gray-400" />
      </div>
      <p class="font-medium text-gray-900">No transactions found</p>
      <p class="text-xs text-gray-500">This vendor's wallet has no activity yet.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="tx in transactions" :key="tx._id" class="p-3 rounded-xl border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors bg-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            :class="{
              'bg-emerald-50 text-emerald-600': tx.type === 'credit',
              'bg-rose-50 text-rose-600': tx.type === 'debit'
            }">
            <ArrowUpRight v-if="tx.type === 'credit'" class="w-5 h-5" />
            <ArrowDownLeft v-else class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 mb-0.5">
              {{ tx.type === 'credit' ? 'Credit' : 'Debit' }}
            </p>
            <p class="text-xs text-gray-500 truncate max-w-[200px]" :title="tx.description || tx.metadata?.reason">{{ tx.description || tx.metadata?.reason || 'Wallet update' }}</p>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ new Date(tx.createdAt).toLocaleDateString() }} {{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold"
            :class="{
              'text-emerald-600': tx.type === 'credit',
              'text-rose-600': tx.type === 'debit'
            }">
            {{ tx.type === 'credit' ? '+' : '-' }}₦{{ (tx.amount || 0).toLocaleString() }}
          </p>
          <span class="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            :class="{
              'bg-emerald-100 text-emerald-700': tx.status === 'successful',
              'bg-amber-100 text-amber-700': tx.status === 'pending',
              'bg-rose-100 text-rose-700': tx.status === 'failed',
            }">
            {{ tx.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAdminFinances } from '@/composables/modules/admin';
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-vue-next';

const props = defineProps<{
  vendorId: string;
}>();

const { transactions, fetchTransactions, loading } = useAdminFinances();

onMounted(() => {
  if (props.vendorId) {
    fetchTransactions(1, 50, { userId: props.vendorId });
  }
});

watch(() => props.vendorId, (newVal) => {
  if (newVal) {
    fetchTransactions(1, 50, { userId: newVal });
  }
});
</script>
