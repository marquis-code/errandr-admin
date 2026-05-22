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
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-6">
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
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { admin_api } from '@/api_factory/modules/admin';
import { ArrowLeft, Store, Copy, Calendar, CheckCircle, XCircle, FileText } from 'lucide-vue-next';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
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
