<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight font-display">Vendor Network</h1>
        <p class="text-gray-500 mt-1 font-medium">Manage merchant partnerships, approvals, and store statuses.</p>
      </div>
      <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-sm font-bold text-gray-900">{{ filteredVendors.length }}</span>
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Merchants</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-1 w-full relative group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by store name or category..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all shadow-sm shadow-gray-100/50"
        />
      </div>
      
      <div class="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-[1.25rem] shadow-sm overflow-x-auto max-w-full">
        <button 
          v-for="tab in tabs" 
          :key="tab.key" 
          @click="activeTab = tab.key" 
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap" 
          :class="activeTab === tab.key 
            ? 'bg-parentPrimary text-white shadow-lg shadow-parentPrimary/20' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-[2rem] p-8 border border-gray-100 animate-pulse h-64" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredVendors.length === 0">
      <EmptyState 
        title="No vendors found" 
        :description="emptyStateDescription"
        icon="🏪"
      />
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="vendor in filteredVendors" :key="vendor._id" class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
        <div class="absolute top-0 right-0 p-6">
           <StatusBadge :status="vendor.status" />
        </div>

        <div class="flex items-start gap-4 mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-parentPrimary/5 to-parentPrimary/10 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform shadow-sm">
            🏪
          </div>
          <div class="min-w-0 pr-12">
            <h3 class="font-bold text-gray-900 truncate text-lg tracking-tight">{{ vendor.storeName }}</h3>
            <p class="text-xs font-bold text-parentPrimary uppercase tracking-wider mt-1">{{ vendor.category || 'General Store' }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-8 flex-1">
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl group-hover:bg-gray-100/50 transition-colors">
            <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-xs shadow-sm">👤</div>
            <div class="min-w-0">
               <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Owner</p>
               <p class="text-sm font-bold text-gray-700 truncate">{{ vendor.owner?.firstName }} {{ vendor.owner?.lastName }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3">
             <Mail class="w-4 h-4 text-gray-300" />
             <p class="text-xs text-gray-500 font-medium truncate">{{ vendor.owner?.email }}</p>
          </div>
        </div>

        <div class="flex gap-2 pt-6 border-t border-gray-50 mt-auto">
          <button 
            v-if="vendor.status === 'pending'" 
            @click="approveVendor(vendor._id)" 
            class="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.98]"
          >
            Approve Store
          </button>
          <button 
            v-if="vendor.status !== 'suspended'" 
            @click="rejectVendor(vendor._id)" 
            class="flex-1 py-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 hover:bg-rose-100 transition-all active:scale-[0.98]"
          >
            Suspend
          </button>
          <button 
            v-if="vendor.status === 'suspended'" 
            @click="approveVendor(vendor._id)" 
            class="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-[0.98]"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminVendors } from '@/composables/modules/admin';
import { Search, Mail } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Vendors - Errandr Admin' });

const { vendors, loading, fetchVendors, approveVendor, rejectVendor } = useAdminVendors();
const activeTab = ref('all');
const searchQuery = ref('');

const tabs = [
  { key: 'all', label: 'All Stores' },
  { key: 'pending', label: 'Awaiting Approval' },
  { key: 'approved', label: 'Verified Partners' },
  { key: 'suspended', label: 'Under Suspension' },
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
    return `No merchants match "${searchQuery.value}" in ${activeTab.value} category.`;
  }
  return `There are currently no merchants in the ${activeTab.value} category.`;
});

onMounted(fetchVendors);
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
