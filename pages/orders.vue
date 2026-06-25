<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Search & Quick Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by Order ID, Customer, or Vendor..." 
          class="w-full pl-10 pr-4 py-2.5 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] placeholder:text-gray-400 shadow-sm"
        />
      </div>
      
      <div class="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200 shrink-0 shadow-sm">
        <div class="w-8 h-8 rounded-lg bg-[#FF5C1A]/10 flex items-center justify-center">
          <Package class="w-4 h-4 text-[#FF5C1A]" />
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Total Orders</span>
          <span class="text-base font-bold text-gray-900 leading-none">{{ orders.length }}</span>
        </div>
      </div>
    </div>

    <!-- Header & Filters -->
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Orders</h1>
          <p class="text-xs font-medium text-gray-500">View and manage all customer orders.</p>
        </div>
      </div>
      
      <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-1 bg-gray-50 p-1 rounded-lg w-fit border border-gray-200">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="selectedStatus = status"
          class="px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0"
          :class="selectedStatus === status ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'"
        >
          <span class="capitalize">{{ status }}</span>
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px] shadow-sm">
      <div v-if="loading" class="p-5">
        <SkeletonTable :rows="10" :cols="6" />
      </div>

      <div v-else-if="filteredOrders.length === 0" class="py-20 text-center">
        <EmptyState 
          title="No orders found" 
          description="There are currently no active orders matching your filter."
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50">
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Date</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Customer</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Amount</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-center">Vendor</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-center">Status</th>
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50/50 transition-colors group cursor-pointer" @click="selectedOrder = order">
              <td class="py-3 px-5 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-[10px] font-medium text-gray-500">{{ new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-xs font-bold border border-[#FF5C1A]/20">
                    {{ order.user?.firstName?.[0] || '?' }}
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-900 leading-none mb-0.5">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                    <p class="text-[10px] font-medium text-gray-500">ID: {{ order.user?._id?.slice(-6) || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="text-xs font-semibold text-gray-900">₦{{ Number(order.totalAmount || 0).toLocaleString() }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="inline-flex items-center gap-2 pr-2 py-1 pl-1 bg-white rounded-md border border-gray-200 truncate max-w-[150px]">
                  <div class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0 bg-indigo-50 border border-indigo-100">
                    {{ order.vendor?.storeName?.[0] || 'V' }}
                  </div>
                  <p class="text-[10px] font-semibold text-gray-700 truncate">{{ order.vendor?.storeName || 'N/A' }}</p>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="order.status" class="scale-75 origin-center" />
                </div>
              </td>
              <td class="py-3 px-5 text-right">
                <div class="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 group-hover:bg-gray-100 transition-colors">
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
        <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
          <div class="relative mb-3">
            <div class="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
              {{ selectedOrder.customer?.firstName?.[0] || selectedOrder.user?.firstName?.[0] || '?' }}
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 font-heading">{{ selectedOrder.customer?.firstName || selectedOrder.user?.firstName }} {{ selectedOrder.customer?.lastName || selectedOrder.user?.lastName }}</h3>
          <p class="text-xs font-medium text-gray-500 mb-4">{{ selectedOrder.customer?.email || selectedOrder.user?.email }}</p>
          
          <div class="flex items-center justify-between w-4/5 bg-white rounded-lg border border-gray-200 divide-x divide-gray-100 shadow-sm">
            <div class="text-center flex-1 py-3">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total</p>
              <p class="text-sm font-bold text-gray-900">₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}</p>
            </div>
            <div class="text-center flex-1 py-3">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
              <p class="text-xs font-semibold text-gray-900">{{ new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="p-6 space-y-6 pb-24 bg-gray-50/30">
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Order Details
            </h4>
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Order ID / No.</span>
                <span class="text-xs font-semibold text-gray-900 break-all font-mono">{{ selectedOrder.orderNumber || selectedOrder._id }}</span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Order Type</span>
                <span class="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">{{ selectedOrder.type?.replace('_', ' ') || 'standard' }}</span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-gray-500">Status</span>
                <StatusBadge :status="selectedOrder.status" class="scale-75 origin-right transition-transform" />
              </div>
              <template v-if="selectedOrder.uniqueCode">
                <div class="w-full h-px bg-gray-100" />
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-500">Unique Code</span>
                  <span class="text-xs font-bold text-gray-900 tracking-wider">{{ selectedOrder.uniqueCode }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Custom Errand Specific -->
          <div class="space-y-3" v-if="selectedOrder.type === 'custom_errand' && selectedOrder.customDetails">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Errand Specifics
            </h4>
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pickup Location</p>
                  <p class="text-xs font-medium text-gray-900 mt-0.5">{{ selectedOrder.customDetails.pickupLocation }}</p>
                </div>
              </div>
              <div class="w-full h-px bg-gray-100 ml-7" />
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Dropoff Location</p>
                  <p class="text-xs font-medium text-gray-900 mt-0.5">{{ selectedOrder.customDetails.dropoffLocation }}</p>
                </div>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p class="text-xs font-medium text-gray-700 leading-relaxed">{{ selectedOrder.customDetails.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Marketplace Specific -->
          <div class="space-y-3" v-if="selectedOrder.type === 'marketplace'">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Items & Vendor
            </h4>
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div class="flex items-center gap-2 pb-3 border-b border-gray-100" v-if="selectedOrder.vendor">
                <Store class="w-4 h-4 text-gray-500" />
                <span class="text-xs font-semibold text-gray-900">{{ selectedOrder.vendor.storeName }}</span>
              </div>
              
              <div class="space-y-3" v-if="selectedOrder.items?.length">
                <div v-for="item in selectedOrder.items" :key="item._id" class="flex items-start justify-between">
                  <div class="flex items-start gap-2">
                    <span class="text-xs font-bold text-gray-900 mt-0.5">{{ item.quantity }}x</span>
                    <span class="text-xs font-medium text-gray-700">{{ item.name }}</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-900">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
                </div>
              </div>

              <!-- Packs -->
              <div class="space-y-3" v-if="selectedOrder.packs?.length">
                <div v-for="pack in selectedOrder.packs" :key="pack._id" class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div class="flex items-center gap-2 mb-2">
                    <Box class="w-3.5 h-3.5 text-gray-500" />
                    <span class="text-xs font-semibold text-gray-900">{{ pack.name }}</span>
                  </div>
                  <div class="space-y-1.5 pl-5">
                    <div v-for="pItem in pack.items" :key="pItem._id" class="flex justify-between items-center text-[11px]">
                      <span class="text-gray-600 font-medium">{{ pItem.quantity }}x {{ pItem.name }}</span>
                      <span class="text-gray-900 font-semibold">₦{{ Number(pItem.subtotal || 0).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Pricing Breakdown
            </h4>
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-semibold">Subtotal</span>
                <span class="text-gray-900 font-semibold">₦{{ Number(selectedOrder.subtotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-semibold">Delivery Fee</span>
                <span class="text-gray-900 font-semibold">₦{{ Number(selectedOrder.deliveryFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.serviceFee">
                <span class="text-gray-500 font-semibold">Service Fee</span>
                <span class="text-gray-900 font-semibold">₦{{ Number(selectedOrder.serviceFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.packagingFee">
                <span class="text-gray-500 font-semibold">Packaging Fee</span>
                <span class="text-gray-900 font-semibold">₦{{ Number(selectedOrder.packagingFee || 0).toLocaleString() }}</span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-gray-900 uppercase">Total</span>
                <span class="text-sm font-bold text-[#FF5C1A]">₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Payment & Delivery
            </h4>
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs font-semibold text-gray-500 flex items-center gap-1.5"><CreditCard class="w-3.5 h-3.5" /> Payment</span>
                <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md" 
                  :class="selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                  {{ selectedOrder.paymentStatus || 'Pending' }}
                </span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex justify-between items-start gap-4">
                <span class="text-xs font-semibold text-gray-500 shrink-0 mt-0.5">Delivery To</span>
                <div class="text-right">
                  <p class="text-xs font-semibold text-gray-900">{{ selectedOrder.recipientName || (selectedOrder.customer?.firstName + ' ' + selectedOrder.customer?.lastName) || 'User' }}</p>
                  <p class="text-[10px] text-gray-500 font-medium">{{ selectedOrder.recipientPhone || 'No phone provided' }}</p>
                  <p class="text-xs font-medium text-gray-700 mt-1">{{ selectedOrder.deliveryAddress || selectedOrder.specificAddress || selectedOrder.shippingAddress || 'No address provided' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="space-y-3" v-if="selectedOrder.statusHistory?.length">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Order Timeline
            </h4>
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative pl-6">
              <div class="absolute top-8 bottom-8 left-[31px] w-px bg-gray-200"></div>
              <div class="space-y-6">
                <div v-for="(hist, idx) in selectedOrder.statusHistory" :key="hist._id || idx" class="flex items-start gap-4 relative z-10">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white border-2"
                    :class="idx === selectedOrder.statusHistory.length - 1 ? 'border-[#FF5C1A] text-[#FF5C1A]' : 'border-gray-200 text-gray-400'">
                    <CheckCircle2 class="w-3.5 h-3.5" v-if="idx < selectedOrder.statusHistory.length - 1" />
                    <div class="w-2 h-2 rounded-full bg-[#FF5C1A]" v-else />
                  </div>
                  <div class="flex-1 min-w-0 pt-0.5">
                    <p class="text-xs font-bold text-gray-900 capitalize">{{ hist.status?.replace(/_/g, ' ') }}</p>
                    <p class="text-[10px] font-medium text-gray-500 mt-0.5 leading-relaxed">{{ hist.note }}</p>
                    <p class="text-[10px] font-semibold text-gray-400 mt-1">{{ new Date(hist.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions Panel -->
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10 flex gap-3">
          <button class="flex-1 py-3 px-4 rounded-lg text-rose-600 font-semibold text-xs bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 border border-rose-100" 
            v-if="['pending', 'awaiting_payment'].includes(selectedOrder.status)">
            Cancel Order
          </button>
          <button class="flex-1 py-3 px-4 rounded-lg text-white font-semibold text-xs bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2" 
            v-if="['pending', 'confirmed'].includes(selectedOrder.status)">
            Mark Processing
          </button>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { Package, Search, ChevronRight, Copy, MapPin, Store, Box, CreditCard, CheckCircle2, Clock } from 'lucide-vue-next';
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
</style>
