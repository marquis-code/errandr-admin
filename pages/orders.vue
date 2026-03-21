<template>
  <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Search Bar -->
    <div class="flex items-center justify-between gap-4 mb-4 mt-2">
      <div class="flex-1 relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search or jump to" 
          class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <!-- Dashboard stats instead of big blocks -->
        <span class="text-sm font-medium text-gray-500 hidden md:block">Active Orders: <strong class="text-gray-900">{{ orders.length }}</strong></span>
      </div>
    </div>

    <!-- Header & Filters -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-6">Orders</h1>
      
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
          <ListFilter class="w-4 h-4" />
          Filters
        </button>
        <span class="text-sm font-medium text-gray-400">No filters applied</span>
        
        <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            v-for="status in statuses" 
            :key="status"
            @click="selectedStatus = status"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap"
            :class="selectedStatus === status ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
          >
            {{ status }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div v-if="loading">
      <SkeletonTable :rows="10" :cols="6" />
    </div>

    <div v-else-if="filteredOrders.length === 0">
      <EmptyState 
        title="No orders yet" 
        description="All orders will be displayed here."
      />
    </div>

    <div v-else class="bg-white">
      <div class="overflow-x-auto pb-20">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Created on</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Customer</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Amount</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Vendor</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Status</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/50">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedOrder = order">
              <td class="py-4 px-2">
                <span class="text-xs font-medium text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              </td>
              <td class="py-4 px-2 min-w-[200px]">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                    {{ order.user?.firstName?.[0] || '?' }}
                  </div>
                  <div>
                    <p class="text-[13px] font-medium text-gray-900">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-2">
                <p class="text-[13px] font-medium text-gray-900 outline-none">₦{{ Number(order.totalAmount).toLocaleString() }}</p>
              </td>
              <td class="py-4 px-2 min-w-[200px]">
                 <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                    {{ order.vendor?.storeName?.[0] || 'V' }}
                  </div>
                  <p class="text-[13px] font-medium text-gray-900">{{ order.vendor?.storeName || 'N/A' }}</p>
                </div>
              </td>
              <td class="py-4 px-2">
                <StatusBadge :status="order.status" class="scale-90 origin-left" />
              </td>
              <td class="py-4 px-2 text-right">
                 <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer for Order Details -->
    <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
      <template v-if="selectedOrder">
        <!-- Header Profile -->
        <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100">
           <div class="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-sm mb-3">
             {{ selectedOrder.user?.firstName?.[0] || '?' }}
           </div>
           <h3 class="text-lg font-bold text-gray-900">{{ selectedOrder.user?.firstName }} {{ selectedOrder.user?.lastName }}</h3>
           <p class="text-sm text-gray-500">{{ selectedOrder.user?.email }}</p>
           
           <div class="flex items-center justify-between w-full mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
             <div class="text-center flex-1">
               <p class="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Total Amount</p>
               <p class="text-lg font-bold text-gray-900">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</p>
             </div>
             <div class="w-px h-8 bg-gray-200" />
             <div class="text-center flex-1">
               <p class="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Created Date</p>
               <p class="text-sm font-bold text-gray-900">{{ new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
             </div>
           </div>
        </div>

        <!-- DETAILS Section -->
        <div class="py-6 space-y-6">
          <div>
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Request Details</h4>
            <div class="space-y-4">
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Order ID</span>
                 <span class="text-parentPrimary font-medium font-mono flex items-center gap-1.5">{{ selectedOrder._id.toUpperCase() }} <Copy class="w-3.5 h-3.5 cursor-pointer hover:text-green-600 transition-colors" /></span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Status</span>
                 <StatusBadge :status="selectedOrder.status" class="scale-90 origin-right transition-transform" />
               </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Amount Breakdown</h4>
            <div class="space-y-4">
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Items Subtotal</span>
                 <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Delivery Fee</span>
                 <span class="text-gray-900 font-bold">₦0.00</span>
               </div>
               <div class="w-full h-px bg-gray-50 my-1" />
               <div class="flex justify-between items-center">
                 <span class="text-gray-500 font-bold text-sm">Total Paid</span>
                 <span class="text-gray-900 font-black text-lg">₦{{ Number(selectedOrder.totalAmount).toLocaleString() }}</span>
               </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Vendor Details</h4>
            <div class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-parentPrimary/20 transition-colors cursor-pointer bg-white">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                   {{ selectedOrder.vendor?.storeName?.[0] || 'V' }}
                 </div>
                 <span class="text-sm font-bold text-gray-900">{{ selectedOrder.vendor?.storeName || 'N/A' }}</span>
               </div>
               <span class="text-[11px] font-bold text-parentPrimary hover:text-green-700 transition-colors px-2 relative z-10">View details</span>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Shipping Destination</h4>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-[13px] font-medium text-gray-600 leading-relaxed max-w-sm">
              {{ selectedOrder.shippingAddress || 'No shipping address provided' }}
            </div>
          </div>
          
          <!-- Actions -->
          <div class="pt-6 border-t border-gray-100 flex gap-3">
            <button class="flex-1 py-3 px-4 rounded-full text-rose-500 font-bold text-sm bg-rose-50 hover:bg-rose-100 transition-colors" v-if="['pending', 'processing'].includes(selectedOrder.status)">Cancel Order</button>
            <button class="flex-1 py-3 px-4 rounded-full text-white font-bold text-sm bg-parentPrimary hover:bg-green-600 transition-colors shadow-sm" v-if="['pending'].includes(selectedOrder.status)">Process Order</button>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { Package, Search, ListFilter, ChevronRight, Copy } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Order Management - Errandr Admin' });

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

const totalVolume = computed(() => {
  return orders.value.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
});

onMounted(fetchOrders);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>
