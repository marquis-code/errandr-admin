<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Search & Quick Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by Order ID, Customer, or Vendor..." 
          class="w-full pl-14 pr-14 py-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400"
        />
      </div>
      
      <div class="flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 shrink-0">
        <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center">
          <Package class="w-5 h-5 text-[#FF5C1A]" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-500">Total Orders</span>
          <span class="text-lg font-bold text-gray-900 leading-none">{{ orders.length }}</span>
        </div>
      </div>
    </div>

    <!-- Header & Filters -->
    <div class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-4xl font-bold text-gray-900 font-display">Orders</h1>
          <p class="text-sm font-medium text-gray-500">View and manage all customer orders.</p>
        </div>
      </div>
      
      <div class="flex overflow-x-auto pb-4 hide-scrollbar gap-2">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="selectedStatus = status"
          class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap border shrink-0"
          :class="selectedStatus === status ? 'bg-[#FF5C1A] text-white border-[#FF5C1A]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 bg-white border-gray-200'"
        >
          <span class="capitalize">{{ status }}</span>
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden min-h-[500px]">
      <div v-if="loading" class="p-8">
        <SkeletonTable :rows="10" :cols="6" />
      </div>

      <div v-else-if="filteredOrders.length === 0" class="py-40">
        <EmptyState 
          title="No orders found" 
          description="There are currently no active orders matching your filter."
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-100/50">
              <th class="py-5 px-8 font-semibold text-gray-500 text-sm whitespace-nowrap">Date</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Customer</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Amount</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap text-center">Vendor</th>
              <th class="py-5 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap text-center">Status</th>
              <th class="py-5 px-8 font-semibold text-gray-500 text-sm whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/50">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-white transition-colors group cursor-pointer" @click="selectedOrder = order">
              <td class="py-5 px-8 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-sm font-medium text-gray-500">{{ new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-sm font-bold border border-[#FF5C1A]/20">
                    {{ order.user?.firstName?.[0] || '?' }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                    <p class="text-xs font-medium text-gray-500">ID: {{ order.user?._id?.slice(-6) || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-5 px-4">
                <span class="text-sm font-bold text-gray-900">₦{{ Number(order.totalAmount).toLocaleString() }}</span>
              </td>
              <td class="py-5 px-4 text-center">
                <div class="inline-flex items-center gap-2 pr-3 py-1.5 pl-1.5 bg-gray-100 rounded-xl border border-gray-200 truncate max-w-[150px]">
                  <div class="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                    {{ order.vendor?.storeName?.[0] || 'V' }}
                  </div>
                  <p class="text-xs font-bold text-gray-700 truncate">{{ order.vendor?.storeName || 'N/A' }}</p>
                </div>
              </td>
              <td class="py-5 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="order.status" class="scale-90" />
                </div>
              </td>
              <td class="py-5 px-8 text-right">
                <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-500 group-hover:bg-[#FF5C1A] group-hover:text-white transition-colors">
                  <span class="text-sm font-semibold mr-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">Details</span>
                  <ChevronRight class="w-4 h-4" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer Redesign -->
    <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
      <template v-if="selectedOrder">
        <!-- Header Profile -->
        <div class="flex flex-col items-center justify-center pt-12 pb-10 border-b border-gray-200">
          <div class="relative mb-4">
            <div class="w-20 h-20 rounded-3xl bg-[#FF5C1A] flex items-center justify-center text-white text-2xl font-bold">
              {{ selectedOrder.user?.firstName?.[0] || '?' }}
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 font-display">{{ selectedOrder.user?.firstName }} {{ selectedOrder.user?.lastName }}</h3>
          <p class="text-sm font-medium text-gray-500 mb-6">{{ selectedOrder.user?.email }}</p>
          
          <div class="flex items-center justify-between w-4/5 bg-gray-50 rounded-2xl border border-gray-100 divide-x divide-gray-200">
            <div class="text-center flex-1 py-4">
              <p class="text-xs font-semibold text-gray-500 mb-1">Total</p>
              <p class="text-base font-bold text-gray-900">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</p>
            </div>
            <div class="text-center flex-1 py-4">
              <p class="text-xs font-semibold text-gray-500 mb-1">Date</p>
              <p class="text-sm font-bold text-gray-900">{{ new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="p-8 space-y-10 pb-32">
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              Order Details
            </h4>
            <div class="space-y-3">
              <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-500">Order ID</span>
                  <Copy class="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
                </div>
                <span class="text-sm font-semibold text-gray-900 break-all">{{ selectedOrder._id }}</span>
              </div>
              
              <div class="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span class="text-sm font-semibold text-gray-500">Status</span>
                <StatusBadge :status="selectedOrder.status" class="scale-90 origin-right transition-transform" />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              Pricing Breakdown
            </h4>
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-semibold">Items</span>
                <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-semibold">Delivery Fee</span>
                <span class="text-gray-900 font-bold">₦0.00</span>
              </div>
              <div class="w-full h-px bg-gray-200" />
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-900">Total</span>
                <span class="text-xl font-bold text-gray-900">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              Delivery Address
            </h4>
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div class="flex items-start gap-3">
                <MapPin class="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <p class="text-sm font-semibold text-gray-700 leading-relaxed">{{ selectedOrder.shippingAddress || 'No address provided' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions Panel -->
        <div class="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-10 flex gap-4">
          <button class="flex-1 py-4 px-6 rounded-2xl text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2" 
            v-if="['pending', 'processing'].includes(selectedOrder.status)">
            Cancel Order
          </button>
          <button class="flex-1 py-4 px-6 rounded-2xl text-white font-bold text-sm bg-[#FF5C1A] hover:bg-[#E54D12] transition-colors flex items-center justify-center gap-2" 
            v-if="['pending'].includes(selectedOrder.status)">
            Mark Processing
          </button>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { Package, Search, ChevronRight, Copy, MapPin } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Orders - Errander Admin' });

const loading = ref(true);
const orders = ref<any[]>([]);
const searchQuery = ref('');
const selectedStatus = ref('all');
const selectedOrder = ref<any>(null);

const statuses = ['all', 'pending', 'processing', 'completed', 'cancelled'];

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await admin_api.getRecentOrders(100);
    orders.value = res.data.orders || res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchesStatus = selectedStatus.value === 'all' || o.status === selectedStatus.value;
    const matchesSearch = !searchQuery.value || 
      o._id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (o.user && `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesStatus && matchesSearch;
  });
});

onMounted(fetchOrders);
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
