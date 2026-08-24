<template>
  <div class="space-y-6 max-w-full mx-auto pb-10 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 font-display">Vendor Details</h1>
          <p class="text-sm text-gray-500">View and manage vendor application and status</p>
        </div>
      </div>
      <div v-if="vendor" class="flex gap-3">
        <button 
          v-if="vendor" 
          @click="showManualDebitModal = true" 
          class="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <DollarSign class="w-4 h-4" /> Manual Payout
        </button>
        <button 
          v-if="vendor.status === 'pending' || vendor.status === 'suspended'" 
          @click="handleApprove" 
          class="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <CheckCircle class="w-4 h-4" /> {{ vendor.status === 'pending' ? 'Approve' : 'Restore' }}
        </button>
        <button 
          v-if="vendor.status !== 'suspended' && vendor.status !== 'rejected'" 
          @click="handleReject" 
          class="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100 flex items-center gap-2"
        >
          <XCircle class="w-4 h-4" /> {{ vendor.status === 'pending' ? 'Reject' : 'Suspend' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5C1A]"></div>
    </div>

    <!-- Content -->
    <div v-else-if="vendor" class="space-y-6">
      <!-- Profile Header Card -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
        <div class="w-20 h-20 rounded-2xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] border border-[#FF5C1A]/20 shrink-0">
          <Store class="w-8 h-8" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-xl font-bold text-gray-900">{{ vendor.storeName }}</h2>
            <StatusBadge :status="vendor.status" class="scale-90 origin-left" />
          </div>
          <p class="text-sm text-gray-500 mb-3">{{ vendor.description || 'No description provided.' }}</p>
          <div class="flex items-center gap-4">
            <span class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20 capitalize">
              Category: {{ vendor.category || 'Standard' }}
            </span>
            <span class="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              Applied {{ new Date(vendor.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-6 py-3 text-sm font-semibold transition-colors border-b-2 mb-[-1px]"
          :class="activeTab === tab.key ? 'border-[#FF5C1A] text-[#FF5C1A]' : 'border-transparent text-gray-500 hover:text-gray-900'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tabs Content -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[300px]">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-8">
          
          <div>
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Store Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Vendor ID</p>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium text-gray-900 break-all">{{ vendor._id }}</p>
                  <Copy class="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-900" @click="copyToClipboard(vendor._id)" />
                </div>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Store Name</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.storeName }}</p>
              </div>
              <div v-if="vendor.businessRegistrationNumber">
                <p class="text-xs font-semibold text-gray-500 mb-1">Business Reg. No.</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.businessRegistrationNumber }}</p>
              </div>
              <div v-if="vendor.address">
                <p class="text-xs font-semibold text-gray-500 mb-1">Store Address</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.address }}</p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100" v-if="vendor.owner">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Owner Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Full Name</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.owner.firstName }} {{ vendor.owner.lastName }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Email Address</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.owner.email }}</p>
              </div>
              <div v-if="vendor.owner.phone">
                <p class="text-xs font-semibold text-gray-500 mb-1">Phone Number</p>
                <p class="text-sm font-medium text-gray-900">{{ vendor.owner.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">No Documents Uploaded</h3>
            <p class="text-sm text-gray-500 max-w-sm">This vendor hasn't uploaded any verification documents yet.</p>
          </div>
        </div>

        <!-- Menu Tab -->
        <div v-if="activeTab === 'menu'" class="space-y-6">
          <VendorMenuManager :vendorId="vendorId" />
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
      <p class="text-gray-500 mb-6">The vendor application you are looking for does not exist or has been removed.</p>
      <button @click="router.push('/vendors')" class="px-6 py-2 rounded-xl bg-[#FF5C1A] text-white font-semibold">
        Back to Vendors
      </button>
    </div>

    <ConfirmationModal
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirmText="confirmModal.confirmText"
      @cancel="confirmModal.isOpen = false"
      @confirm="executeAction"
    />

    <!-- Manual Debit Modal -->
    <div v-if="showManualDebitModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Manual Payout / Deduct</h3>
          <button @click="showManualDebitModal = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Use this to manually deduct funds if you've paid out the vendor directly outside of the system.</p>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Amount (₦)</label>
            <input v-model="debitAmount" type="number" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]" placeholder="e.g. 5000">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Reason / Description</label>
            <input v-model="debitReason" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]" placeholder="e.g. Manual payout">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Proof of Transaction (Optional)</label>
            <input type="file" @change="handleFileUpload" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF5C1A]/10 file:text-[#FF5C1A] hover:file:bg-[#FF5C1A]/20">
          </div>
          <button 
            @click="submitManualDebit" 
            :disabled="!debitAmount || isSubmittingDebit"
            class="w-full py-3 bg-[#FF5C1A] text-white rounded-lg font-bold hover:bg-[#E54D12] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <span v-if="isSubmittingDebit" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Process Debit</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { admin_api } from '@/api_factory/modules/admin';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config';
import { ArrowLeft, Store, Copy, Calendar, CheckCircle, XCircle, FileText, DollarSign, X } from 'lucide-vue-next';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import VendorMenuManager from '@/components/vendors/VendorMenuManager.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();

const vendorId = route.params.id as string;
const vendor = ref<any>(null);
const loading = ref(true);

const tabs = [
  { key: 'overview', label: 'Overview & Details' },
  { key: 'menu', label: 'Menu & Combos' },
  { key: 'documents', label: 'Verification Documents' }
];
const activeTab = ref('overview');

const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm',
  actionType: ''
});

const showManualDebitModal = ref(false);
const debitAmount = ref<number | null>(null);
const debitReason = ref('');
const isSubmittingDebit = ref(false);
const proofFile = ref<File | null>(null);

const handleFileUpload = (e: any) => {
  if (e.target.files && e.target.files[0]) {
    proofFile.value = e.target.files[0]
  }
}

const submitManualDebit = async () => {
  const ownerId = vendor.value?.owner?._id || vendor.value?.owner || vendor.value?.user;
  const finalId = typeof ownerId === 'object' ? ownerId._id : ownerId;

  if (!debitAmount.value || debitAmount.value <= 0) {
    showToast({ title: 'Error', message: 'Please enter a valid amount', toastType: 'error' });
    return;
  }
  
  if (!finalId) {
    showToast({ title: 'Error', message: 'Vendor owner information is missing', toastType: 'error' });
    return;
  }
  
  isSubmittingDebit.value = true;
  try {
    let proofUrl = ''
    if (proofFile.value) {
      const formData = new FormData()
      formData.append('file', proofFile.value)
      const uploadRes = await GATEWAY_ENDPOINT_WITH_AUTH.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      proofUrl = uploadRes.data?.url || uploadRes.data?.data?.url || ''
    }

    await GATEWAY_ENDPOINT_WITH_AUTH.post(`/wallets/admin/debit/${finalId}`, {
      amount: debitAmount.value,
      description: debitReason.value || 'Manual Payout / Adjustment',
      proofOfTransaction: proofUrl
    });
    showToast({ title: "Success", message: 'Wallet debited successfully!', toastType: "success" });
    showManualDebitModal.value = false;
    debitAmount.value = null;
    debitReason.value = '';
    proofFile.value = null;
    fetchVendor(); 
  } catch (err: any) {
    console.error('Error debiting wallet', err);
    showToast({ title: "Error", message: err.response?.data?.message || 'Failed to debit wallet', toastType: "error" });
  } finally {
    isSubmittingDebit.value = false;
  }
}

const fetchVendor = async () => {
  loading.value = true;
  try {
    const res = await admin_api.getVendor(vendorId);
    vendor.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleApprove = () => {
  confirmModal.value.actionType = 'approve';
  confirmModal.value.title = 'Approve/Restore Vendor';
  confirmModal.value.message = 'Are you sure you want to approve this vendor application? They will be able to start selling.';
  confirmModal.value.type = 'success';
  confirmModal.value.confirmText = 'Approve';
  confirmModal.value.isOpen = true;
};

const handleReject = () => {
  confirmModal.value.actionType = 'reject';
  confirmModal.value.title = 'Suspend/Reject Vendor';
  confirmModal.value.message = 'Are you sure you want to reject or suspend this vendor? Their store will be hidden.';
  confirmModal.value.type = 'danger';
  confirmModal.value.confirmText = 'Suspend';
  confirmModal.value.isOpen = true;
};

const executeAction = async () => {
  confirmModal.value.isOpen = false;
  try {
    if (confirmModal.value.actionType === 'approve') {
      await admin_api.approveVendor(vendorId);
      showToast({ title: "Success", message: "Vendor approved successfully", toastType: "success" });
    } else {
      await admin_api.rejectVendor(vendorId);
      showToast({ title: "Success", message: "Vendor suspended/rejected successfully", toastType: "success" });
    }
    await fetchVendor();
  } catch (e) {
    console.error(e);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showToast({ title: "Copied", message: "Copied to clipboard", toastType: "success" });
};

onMounted(() => {
  fetchVendor();
});
</script>
