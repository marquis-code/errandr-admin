<template>
  <div>
    <div class="space-y-6 animate-fade-in max-w-full mx-auto pb-10">
    <!-- Search & Quick Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by store name or category..." 
          class="w-full pl-14 pr-14 py-3.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400 shadow-sm"
        />
      </div>
      
      <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm shrink-0">
        <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center">
          <Store class="w-5 h-5 text-[#FF5C1A]" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-500">Total Vendors</span>
          <span class="text-lg font-bold text-gray-900 leading-none">{{ vendors.length }}</span>
        </div>
      </div>
    </div>

    <!-- Header & Tabs -->
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-gray-900 font-display">Vendors</h1>
          <p class="text-sm font-medium text-gray-500">Manage store applications, status, and details.</p>
        </div>
      </div>
      
      <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.key" 
          @click="activeTab = tab.key" 
          class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap border shrink-0"
          :class="activeTab === tab.key ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white border-gray-100 shadow-sm'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-8">
        <SkeletonTable :rows="8" :cols="5" />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredVendors.length === 0" class="py-20">
        <EmptyState 
          title="No vendors found" 
          :description="emptyStateDescription"
        />
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50">
              <th class="py-4 px-6 font-semibold text-gray-600 text-sm whitespace-nowrap">Store Name</th>
              <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap">Category</th>
              <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap text-center">Status</th>
              <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap">Owner</th>
              <th class="py-4 px-6 font-semibold text-gray-600 text-sm whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vendor in filteredVendors" :key="vendor._id" class="hover:bg-gray-50 transition-colors group">
              <td class="py-4 px-6 min-w-[250px]">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center border border-[#FF5C1A]/20 shrink-0">
                    <Store class="w-4 h-4 text-[#FF5C1A]" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ vendor.storeName }}</p>
                    <p class="text-xs font-medium text-gray-500 truncate">ID: {{ vendor._id.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <span class="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                  {{ vendor.category || 'Standard' }}
                </span>
              </td>
              <td class="py-4 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="vendor.status" class="scale-75" />
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex flex-col">
                  <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ vendor.owner?.firstName }} {{ vendor.owner?.lastName }}</p>
                  <span class="text-xs font-medium text-gray-500">{{ vendor.owner?.email }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button 
                    v-if="vendor.status === 'pending'" 
                    @click="initiateAction('approve', vendor._id)" 
                    class="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Approve Vendor"
                  >
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="vendor.status !== 'suspended'" 
                    @click="initiateAction('reject', vendor._id)" 
                    class="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Suspend Vendor"
                  >
                    <XCircle class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="vendor.status === 'suspended'" 
                    @click="initiateAction('approve', vendor._id)" 
                    class="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Restore Vendor"
                  >
                    <RefreshCcw class="w-4 h-4" />
                  </button>
                  
                  <button @click.stop="router.push(`/vendors/${vendor._id}`)" class="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#FF5C1A] hover:text-white transition-colors" title="View Details">
                    <Eye class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
import { useAdminVendors } from '@/composables/modules/admin';
import { Search, Store, Eye, CheckCircle, XCircle, RefreshCcw } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '@/components/core/EmptyState.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Vendors - Errander Admin' });

const router = useRouter();
const { vendors, loading, fetchVendors, approveVendor, rejectVendor } = useAdminVendors();
const activeTab = ref('all');
const searchQuery = ref('');

const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm',
  actionType: '',
  vendorId: ''
});

const tabs = [
  { key: 'all', label: 'All Stores' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'suspended', label: 'Suspended' },
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
    return `No vendors match "${searchQuery.value}" under ${activeTab.value}.`;
  }
  return `There are currently no vendors under ${activeTab.value}.`;
});

onMounted(fetchVendors);

const initiateAction = (action: 'approve' | 'reject', vendorId: string) => {
  confirmModal.value.vendorId = vendorId;
  confirmModal.value.actionType = action;
  confirmModal.value.isOpen = true;
  
  if (action === 'approve') {
    confirmModal.value.title = 'Approve/Restore Vendor';
    confirmModal.value.message = 'Are you sure you want to approve this vendor application? They will be able to start selling.';
    confirmModal.value.type = 'success';
    confirmModal.value.confirmText = 'Approve';
  } else {
    confirmModal.value.title = 'Suspend/Reject Vendor';
    confirmModal.value.message = 'Are you sure you want to reject or suspend this vendor? Their store will be hidden.';
    confirmModal.value.type = 'danger';
    confirmModal.value.confirmText = 'Suspend';
  }
};

const executeAction = async () => {
  confirmModal.value.isOpen = false;
  const { actionType, vendorId } = confirmModal.value;
  
  if (actionType === 'approve') {
    await approveVendor(vendorId);
  } else {
    await rejectVendor(vendorId);
  }
};
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
