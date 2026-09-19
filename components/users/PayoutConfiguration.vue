<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-6">
    <div class="p-6 border-b border-gray-100/60 bg-gray-50/30 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Settings class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">Payout Configuration</h3>
          <p class="text-xs text-gray-500 font-medium">Manage this user's payout frequency and bank details.</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-8">
      <!-- Payout Frequency -->
      <div>
        <h4 class="text-sm font-bold text-gray-900 mb-3">Payout Frequency</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            v-for="freq in ['manual', 'daily', 'weekly', 'monthly']" 
            :key="freq"
            @click="form.preference = freq"
            class="flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left"
            :class="form.preference === freq ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'"
          >
            <div>
              <p class="text-sm font-bold capitalize" :class="form.preference === freq ? 'text-blue-700' : 'text-gray-900'">{{ freq }} Payouts</p>
              <p class="text-xs mt-1" :class="form.preference === freq ? 'text-blue-600/80' : 'text-gray-500'">
                {{ freq === 'manual' ? 'When requested' : freq === 'daily' ? 'Next day processing' : freq === 'weekly' ? 'Every Friday' : '1st of every month' }}
              </p>
            </div>
            <div 
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
              :class="form.preference === freq ? 'border-blue-500' : 'border-gray-300'"
            >
              <div v-if="form.preference === freq" class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            </div>
          </button>
        </div>
      </div>

      <!-- Bank Details -->
      <div>
        <h4 class="text-sm font-bold text-gray-900 mb-3">Bank Account Information</h4>
        <div class="space-y-4 max-w-2xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500">Select Bank</label>
              <select v-model="form.bankDetails.bankCode" @change="onBankChange" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                <option value="" disabled>Choose a bank</option>
                <option v-for="bank in banks" :key="bank.code" :value="bank.code">{{ bank.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500">Account Number</label>
              <input 
                v-model="form.bankDetails.accountNumber" 
                type="text" 
                maxlength="10"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="10-digit account number"
              />
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button 
              @click="resolveAccount" 
              :disabled="resolving || form.bankDetails.accountNumber.length !== 10 || !form.bankDetails.bankCode"
              class="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="resolving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Verify Account
            </button>
            <div v-if="isAccountVerified && form.bankDetails.accountName" class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
              <CheckCircle class="w-4 h-4" />
              <span class="text-sm font-bold">{{ form.bankDetails.accountName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          @click="handleSave" 
          :disabled="saving"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Save Configuration
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Settings, CheckCircle } from 'lucide-vue-next';
import { wallets_api } from '@/api_factory/modules/wallets';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps({
  userId: { type: String, required: true },
  initialWallet: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['updated']);

const { showToast } = useCustomToast();

const banks = ref<any[]>([]);
const resolving = ref(false);
const saving = ref(false);
const isAccountVerified = ref(false);

const form = ref({
  preference: 'manual',
  bankDetails: {
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: ''
  }
});

watch(() => props.initialWallet, (newVal) => {
  if (newVal) {
    if (newVal.payoutPreference) {
      form.value.preference = newVal.payoutPreference;
    }
    if (newVal.bankDetails) {
      form.value.bankDetails = { ...newVal.bankDetails };
      if (newVal.bankDetails.accountName) {
        isAccountVerified.value = true;
      }
    }
  }
}, { immediate: true, deep: true });

const fetchBanks = async () => {
  try {
    const res = await wallets_api.getBanks();
    banks.value = res.data || [];
  } catch (e) {
    console.error('Failed to fetch banks', e);
  }
};

const onBankChange = () => {
  const selectedBank = banks.value.find(b => b.code === form.value.bankDetails.bankCode);
  if (selectedBank) {
    form.value.bankDetails.bankName = selectedBank.name;
  }
  isAccountVerified.value = false;
  form.value.bankDetails.accountName = '';
};

const resolveAccount = async () => {
  if (form.value.bankDetails.accountNumber.length !== 10 || !form.value.bankDetails.bankCode) return;
  resolving.value = true;
  try {
    const res: any = await wallets_api.resolveAccount({
      account_number: form.value.bankDetails.accountNumber,
      bank_code: form.value.bankDetails.bankCode
    });
    form.value.bankDetails.accountName = res.data.account_name;
    isAccountVerified.value = true;
  } catch (e: any) {
    showToast({
      title: 'Verification Failed',
      message: e.data?.message || 'Failed to resolve account',
      toastType: 'error'
    });
  } finally {
    resolving.value = false;
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    await wallets_api.updatePreferencesByAdmin(props.userId, {
      preference: form.value.preference,
      bankDetails: form.value.bankDetails.accountName ? form.value.bankDetails : undefined
    });
    showToast({
      title: 'Success',
      message: 'Payout configuration updated successfully',
      toastType: 'success'
    });
    emit('updated');
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.data?.message || 'Failed to update configuration',
      toastType: 'error'
    });
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchBanks();
});
</script>
