<template>
  <SideDrawer :isOpen="isOpen" @close="close">
    <template v-if="order">
      <!-- Header Profile -->
      <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
        <div class="relative mb-3">
          <div class="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
            {{ order.customer?.firstName?.[0] || order.user?.firstName?.[0] || '?' }}
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 font-heading">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</h3>
        <p class="text-xs font-medium text-gray-500 mb-4">{{ order.customer?.email || order.user?.email }}</p>
        
        <div class="flex items-center justify-between w-4/5 bg-white rounded-lg border border-gray-100 divide-x divide-gray-100">
          <div class="text-center flex-1 py-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total</p>
            <p class="text-sm font-bold text-gray-900">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</p>
          </div>
          <div class="text-center flex-1 py-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
            <p class="text-xs font-semibold text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="py-6 space-y-6 pb-24 bg-gray-50/30 -mx-6 px-6">
        
        <!-- Order ID & Tracking -->
        <div class="space-y-4">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Tracking & Details
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order ID</span>
              <span class="text-xs font-bold text-gray-900 font-mono">{{ order.orderNumber || order._id }}</span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order Type</span>
              <span class="text-xs font-bold text-[#FF5C1A] uppercase tracking-wide">{{ order.type?.replace('_', ' ') || 'standard' }}</span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Current Status</span>
              <div class="capitalize text-xs font-bold px-2 py-1 bg-gray-100 rounded inline-block">{{ order.status }}</div>
            </div>
            <div v-if="order.uniqueCode">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Delivery PIN</span>
              <span class="text-xs font-black text-[#FF5C1A] tracking-wider">{{ order.uniqueCode }}</span>
            </div>
            <div class="col-span-2 mt-2" v-if="order.statusHistory?.length">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-3">Order Timeline</span>
              <div class="relative border-l border-gray-200 ml-2 space-y-4">
                <div v-for="(history, index) in order.statusHistory" :key="index" class="pl-4 relative">
                  <div class="w-2.5 h-2.5 bg-[#FF5C1A] rounded-full absolute -left-[5px] top-1 border-2 border-white"></div>
                  <p class="text-xs font-bold text-gray-900 capitalize">{{ history.status?.replace(/_/g, ' ') }}</p>
                  <p class="text-[10px] font-medium text-gray-500">{{ new Date(history.timestamp).toLocaleString() }}</p>
                  <p v-if="history.note" class="text-[10px] text-gray-600 mt-1 italic">{{ history.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="space-y-4 mt-6">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Customer Information
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
              <p class="font-bold text-gray-900">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-gray-900">{{ order.customer?.phone || order.user?.phone || 'N/A' }}</p>
                <a v-if="(order.customer || order.user)?.phone" :href="`https://wa.me/${formatWhatsAppNumber((order.customer || order.user)?.phone)}?text=Hello, regarding your order ${order.orderNumber || ''}, please be patient as we are working on it.`" target="_blank" class="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors" title="Chat on WhatsApp">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
              </div>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
              <p class="text-xs font-medium text-gray-700 leading-relaxed">{{ order.deliveryAddress || order.specificAddress || order.shippingAddress || 'No address provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Errander Info -->
        <div class="space-y-4 mt-6" v-if="order.errander">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Assigned Dispatcher
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
              <p class="font-bold text-gray-900">{{ order.errander?.firstName }} {{ order.errander?.lastName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
              <p class="font-bold text-gray-900">{{ order.errander?.phone || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Vehicle</p>
              <p class="text-xs font-medium text-gray-700 leading-relaxed capitalize">{{ order.errander?.vehicleType?.replace('_', ' ') || 'Not specified' }} {{ order.errander?.plateNumber ? `(${order.errander.plateNumber})` : '' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Ordered Items -->
        <div class="space-y-4 mt-6" v-if="order.items?.length">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Ordered Items
          </h4>
          <div class="space-y-3 px-2">
            <div v-for="item in order.items" :key="item._id" class="flex items-start justify-between">
              <div class="flex items-start gap-3">
                <span class="text-xs font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded">{{ item.quantity }}x</span>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900">{{ item.name }}</span>
                  <div v-if="item.customizations?.length" class="mt-1 space-y-1">
                    <p v-for="(custom, idx) in item.customizations" :key="idx" class="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                      <span class="text-gray-300">•</span> {{ custom.name }} <span class="font-semibold text-gray-700" v-if="custom.price > 0">(+₦{{ custom.price?.toLocaleString() }})</span>
                    </p>
                  </div>
                </div>
              </div>
              <span class="text-xs font-black text-gray-900">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Payment & Billing -->
        <div class="space-y-4 mt-6">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Billing & Revenue Split
            <span class="px-2 py-0.5 rounded-md font-bold text-[10px]" :class="order.paymentStatus === 'paid' ? 'bg-emerald-100 text-[#FF5C1A]' : 'bg-amber-100 text-amber-700'">{{ order.paymentStatus || 'Pending' }}</span>
          </h4>
          
          <div class="px-2 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Items Subtotal</span>
              <span class="text-gray-900 font-bold">₦{{ Number(order.subtotal || 0).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-xs" v-if="order.packagingFee">
              <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Packaging</span>
              <span class="text-gray-900 font-bold">₦{{ Number(order.packagingFee || 0).toLocaleString() }}</span>
            </div>
            
            <div class="my-3 py-3 border-y border-gray-100 border-dashed space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-bold uppercase tracking-wide text-[10px]">Total Delivery Charged</span>
                <span class="text-gray-900 font-black">₦{{ Number(order.deliveryFee || 0).toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
              <span class="text-xs font-black text-gray-900 uppercase">Total Paid</span>
              <span class="text-lg font-black text-[#FF5C1A]">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div v-if="order" class="p-6 border-t border-gray-100 flex flex-col gap-4">
      <button @click="$emit('takeAction', order)" class="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
        Take Action
      </button>
    </div>
  </SideDrawer>
</template>

<script setup lang="ts">
import SideDrawer from '@/components/ui/SideDrawer.vue';

defineProps<{
  isOpen: boolean;
  order: any;
}>();

const emit = defineEmits(['close', 'takeAction']);

const close = () => emit('close');

const formatWhatsAppNumber = (phone: string) => {
  if (!phone) return '';
  // Remove spaces, dashes, parentheses
  let formatted = phone.replace(/[\s-()]/g, '');
  // If it starts with 0, replace with 234
  if (formatted.startsWith('0')) {
    formatted = '234' + formatted.substring(1);
  }
  // If it doesn't start with + or 234, assuming Nigerian number
  if (!formatted.startsWith('+') && !formatted.startsWith('234')) {
    formatted = '234' + formatted;
  }
  // Remove the + if present for WhatsApp link
  return formatted.replace('+', '');
};
</script>
