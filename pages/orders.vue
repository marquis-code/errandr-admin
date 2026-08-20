<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Orders</h1>
        <p class="text-xs font-medium text-gray-500">View and manage all customer orders.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Date Filters -->
        <DateRangePicker v-model:start="startDate" v-model:end="endDate" @update:start="fetchOrders" @update:end="fetchOrders" />
        <button @click="clearFilters" v-if="startDate || endDate || selectedCustomer || selectedVendor" class="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2">Clear</button>
      </div>
    </div>
    
    <!-- Order Status Legend -->
    <div class="bg-indigo-50/50 border border-indigo-100 rounded-[1.25rem] p-4 flex flex-col md:flex-row gap-4 items-start md:items-center text-xs text-indigo-900">
      <div class="flex items-center gap-2 font-bold whitespace-nowrap">
        <Activity class="w-4 h-4 text-indigo-600" />
        Status Guide:
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="font-semibold">Pending:</span> Awaiting acceptance</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-400"></span><span class="font-semibold">Processing:</span> Accepted & being fulfilled</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span><span class="font-semibold">Completed:</span> Successfully delivered</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-400"></span><span class="font-semibold">Cancelled:</span> Terminated order</span>
      </div>
    </div>

    <!-- Stats Grid (No Shadows) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-blue-100 text-blue-600">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ totalRecords }}</h3>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none col-span-2 lg:col-span-2">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-emerald-100 text-emerald-600">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">₦{{ totalRevenue.toLocaleString() }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-amber-100 text-amber-600">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.pending }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-purple-100 text-purple-600">
            <Loader2 class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Processing</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.processing }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-teal-100 text-teal-600">
            <CheckCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.completed }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100/60 transition-all group overflow-hidden relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-rose-100 text-rose-600">
            <XCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.cancelled }}</h3>
        </div>
      </div>
    </div>

    <!-- Controls (Dropdowns instead of raw search) -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-1 gap-3 max-w-2xl">
        <SelectInput 
          v-model="selectedCustomer" 
          :options="customerOptions" 
          label="Filter by Customer" 
          class="flex-1 shadow-none"
          position="standalone"
        />
        <SelectInput 
          v-model="selectedVendor" 
          :options="vendorOptions" 
          label="Filter by Vendor" 
          class="flex-1 shadow-none"
          position="standalone"
        />
      </div>
      
      <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-none">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="selectedStatus = status"
          class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 capitalize shadow-none"
          :class="selectedStatus === status ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100/60 overflow-hidden min-h-[400px] shadow-none">
      <div v-if="loading" class="p-10 space-y-6">
        <div v-for="i in 5" :key="`skeleton-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-12 h-12 rounded-full bg-gray-100" />
          <div class="flex-1 space-y-3">
            <div class="h-3 bg-gray-100 rounded-full w-1/3" />
            <div class="h-2 bg-gray-100 rounded-full w-1/4" />
          </div>
          <div class="w-24 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="py-24 text-center bg-gray-50/30">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <ShoppingBag class="w-6 h-6 text-gray-400" />
        </div>
        <h4 class="font-bold text-gray-900 text-lg tracking-tight">No orders found</h4>
        <p class="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your filters or date range to find what you're looking for.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="border-b border-gray-100/50 bg-gray-50/20">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[35%]">Customer & Order</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[25%]">Logistics</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Financials</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/80">
            <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50/50 transition-colors group cursor-pointer" @click="selectedOrder = order">
              <!-- Customer & Order -->
              <td class="px-6 py-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 font-black text-sm uppercase border border-gray-200">
                    {{ (order.customer || order.user)?.firstName?.charAt(0) || '?' }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</p>
                      <a v-if="(order.customer || order.user)?.phone" :href="`https://wa.me/${formatWhatsAppNumber((order.customer || order.user)?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Customer">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                    <p class="text-[11px] font-medium text-gray-500 truncate mb-1.5">{{ (order.customer || order.user)?.email || 'No email' }}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-black bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{{ order.orderNumber || order._id.slice(-8).toUpperCase() }}</span>
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">• {{ order.type === 'custom_errand' ? 'Custom Errand' : ((order.items?.length || 0) + ' items') }}</span>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Logistics -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <Store class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900">{{ order.vendor?.storeName || 'N/A' }}</p>
                      <a v-if="order.vendor?.phone || order.vendor?.owner?.phone" :href="`https://wa.me/${formatWhatsAppNumber(order.vendor?.phone || order.vendor?.owner?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Vendor">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Truck class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900">{{ order.errander?.firstName || 'N/A' }}</p>
                      <a v-if="order.errander?.phone" :href="`https://wa.me/${formatWhatsAppNumber(order.errander?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Errander">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Financials -->
              <td class="px-6 py-4 text-right">
                <p class="text-sm font-black text-gray-900 font-mono tracking-tight">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</p>
                <div class="flex flex-col items-end gap-1 mt-1">
                  <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wide">Plat: ₦{{ Number(order.platformProcessingFee || order.serviceFee || 0).toLocaleString() }}</span>
                  <span class="text-[9px] font-bold text-gray-500">Del: ₦{{ Number(order.deliveryFee || 0).toLocaleString() }}</span>
                </div>
              </td>
              
              <!-- Status & Timeline -->
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end gap-2">
                  <span v-if="order.status === 'delivered'" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle class="w-3.5 h-3.5" /> Delivered
                  </span>
                  <span v-else-if="order.status === 'pending'" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5" /> Pending
                  </span>
                  <span v-else-if="order.status === 'cancelled'" class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle class="w-3.5 h-3.5" /> Cancelled
                  </span>
                  <span v-else class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity class="w-3.5 h-3.5" /> {{ order.status?.replace('_', ' ') }}
                  </span>
                  
                  <span class="text-[10px] font-bold text-gray-400">{{ formatTimeAgo(order.createdAt) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Controls -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100/50 bg-gray-50/20 shadow-none" v-if="totalPages > 1">
          <p class="text-xs font-medium text-gray-500">
            Showing Page <span class="font-bold text-gray-900">{{ currentPage }}</span> of <span class="font-bold text-gray-900">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SideDrawer Redesign with Enhanced Tracking -->
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
          
          <div class="flex items-center justify-between w-4/5 bg-white rounded-lg border border-gray-100 divide-x divide-gray-100">
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
        <div class="py-6 space-y-6 pb-24 bg-gray-50/30 -mx-6 px-6">
          
          <!-- Order ID & Tracking -->
          <div class="space-y-4">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Tracking & Details
            </h4>
            <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
              <div>
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order ID</span>
                <span class="text-xs font-bold text-gray-900 font-mono">{{ selectedOrder.orderNumber || selectedOrder._id }}</span>
              </div>
              <div>
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order Type</span>
                <span class="text-xs font-bold text-[#FF5C1A] uppercase tracking-wide">{{ selectedOrder.type?.replace('_', ' ') || 'standard' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Current Status</span>
                <div class="capitalize text-xs font-bold px-2 py-1 bg-gray-100 rounded inline-block">{{ selectedOrder.status }}</div>
              </div>
              <div v-if="selectedOrder.uniqueCode">
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Delivery PIN</span>
                <span class="text-xs font-black text-[#FF5C1A] tracking-wider">{{ selectedOrder.uniqueCode }}</span>
              </div>
              <div class="col-span-2 mt-2" v-if="selectedOrder.statusHistory?.length">
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-3">Order Timeline</span>
                <div class="relative border-l border-gray-200 ml-2 space-y-4">
                  <div v-for="(history, index) in selectedOrder.statusHistory" :key="index" class="pl-4 relative">
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
                <p class="font-bold text-gray-900">{{ selectedOrder.customer?.firstName || selectedOrder.user?.firstName }} {{ selectedOrder.customer?.lastName || selectedOrder.user?.lastName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                <div class="flex items-center gap-2">
                  <p class="font-bold text-gray-900">{{ selectedOrder.customer?.phone || selectedOrder.user?.phone || 'N/A' }}</p>
                  <a v-if="(selectedOrder.customer || selectedOrder.user)?.phone" :href="`https://wa.me/${formatWhatsAppNumber((selectedOrder.customer || selectedOrder.user)?.phone)}?text=Hello, regarding your order ${selectedOrder.orderNumber || ''}, please be patient as we are working on it.`" target="_blank" class="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors" title="Chat on WhatsApp">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                </div>
              </div>
              <div class="col-span-2">
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
                <p class="text-xs font-medium text-gray-700 leading-relaxed">{{ selectedOrder.deliveryAddress || selectedOrder.specificAddress || selectedOrder.shippingAddress || 'No address provided' }}</p>
              </div>
            </div>
          </div>

          <!-- Errander Info -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.errander">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
              Assigned Dispatcher
            </h4>
            <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
                <p class="font-bold text-gray-900">{{ selectedOrder.errander?.firstName }} {{ selectedOrder.errander?.lastName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                <p class="font-bold text-gray-900">{{ selectedOrder.errander?.phone || 'N/A' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Vehicle</p>
                <p class="text-xs font-medium text-gray-700 leading-relaxed capitalize">{{ selectedOrder.errander?.vehicleType?.replace('_', ' ') || 'Not specified' }} {{ selectedOrder.errander?.plateNumber ? `(${selectedOrder.errander.plateNumber})` : '' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Ordered Items -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.items?.length">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Ordered Items
            </h4>
            <div class="space-y-3 px-2">
              <div v-for="item in selectedOrder.items" :key="item._id" class="flex items-start justify-between">
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
              <span class="px-2 py-0.5 rounded-md font-bold text-[10px]" :class="selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-[#FF5C1A]' : 'bg-amber-100 text-amber-700'">{{ selectedOrder.paymentStatus || 'Pending' }}</span>
            </h4>
            
            <div class="px-2 space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Items Subtotal</span>
                <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.subtotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.packagingFee">
                <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Packaging</span>
                <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.packagingFee || 0).toLocaleString() }}</span>
              </div>
              
              <div class="my-3 py-3 border-y border-gray-100 border-dashed space-y-3">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500 font-bold uppercase tracking-wide text-[10px]">Total Delivery Charged</span>
                  <span class="text-gray-900 font-black">₦{{ Number(selectedOrder.deliveryFee || 0).toLocaleString() }}</span>
                </div>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <span class="text-xs font-black text-gray-900 uppercase">Total Paid</span>
                <span class="text-lg font-black text-[#FF5C1A]">₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div v-if="selectedOrder && ['pending', 'processing', 'confirmed'].includes(selectedOrder.status)" class="p-6 border-t border-gray-100 flex gap-3">
        <button 
          @click="handleCancelOrder(selectedOrder._id)" 
          class="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
        >
          Cancel Order
        </button>
      </div>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { ShoppingBag, DollarSign, Activity, Calendar, Store, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-vue-next';
import { onMounted, ref, computed, watch } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Orders - Errander Admin' });

const loading = ref(true);
const orders = ref<any[]>([]);

// Pagination and Totals
const currentPage = ref(1);
const totalPages = ref(1);
const totalRecords = ref(0);
const limit = ref(20);
const orderStats = ref({
  pending: 0,
  processing: 0,
  completed: 0,
  cancelled: 0
});

// Filters
const selectedStatus = ref('all');
const startDate = ref('');
const endDate = ref('');
const selectedCustomer = ref('');
const selectedVendor = ref('');

const selectedOrder = ref<any>(null);
const statuses = ['all', 'pending', 'processing', 'completed', 'cancelled'];

// Dropdown options
const customerOptions = ref<any[]>([]);
const vendorOptions = ref<any[]>([]);
const dispatcherOptions = ref<any[]>([]);

const assigningErranderId = ref('');
const isAssigning = ref(false);

const fetchDropdowns = async () => {
  try {
    const [usersRes, vendorsRes, dispatchersRes] = await Promise.all([
      admin_api.getUsers(),
      admin_api.getVendors(),
      admin_api.getDispatchers(1, 1000)
    ]);
    customerOptions.value = (usersRes.data?.users || usersRes.data || []).map((u: any) => ({
      label: `${u.firstName || ''} ${u.lastName || ''} - ${u.email}`,
      value: u._id
    }));
    vendorOptions.value = (vendorsRes.data?.vendors || vendorsRes.data || []).map((v: any) => ({
      label: `${v.storeName}`,
      value: v._id
    }));
    
    const dList = dispatchersRes.data?.data?.dispatchers || dispatchersRes.data?.dispatchers || dispatchersRes.data || [];
    dispatcherOptions.value = dList.map((d: any) => ({
      label: `${d.firstName || ''} ${d.lastName || ''} - ${d.phone || 'No phone'}`,
      value: d._id
    }));
  } catch (e) {
    console.error('Failed to load dropdowns', e);
  }
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await admin_api.getRecentOrders(
      currentPage.value,
      limit.value,
      startDate.value || undefined,
      endDate.value || undefined,
      selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
      selectedCustomer.value || undefined,
      selectedVendor.value || undefined
    );
    const payload = res.data.data || res.data;
    orders.value = payload.orders || [];
    totalRecords.value = payload.total || 0;
    totalPages.value = payload.totalPages || 1;
    
    if (payload.stats) {
      orderStats.value = payload.stats;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchOrders();
  }
};

watch([selectedStatus, selectedCustomer, selectedVendor], () => {
  currentPage.value = 1;
  fetchOrders();
});

const clearFilters = () => {
  startDate.value = '';
  endDate.value = '';
  selectedCustomer.value = '';
  selectedVendor.value = '';
  selectedStatus.value = 'all';
  currentPage.value = 1;
  fetchOrders();
};

const totalRevenue = computed(() => {
  // Ideally, total revenue should be returned from backend for accurate total across pages.
  // Here we show it for current view.
  return orders.value.reduce((acc, order) => acc + Number(order.total || order.totalAmount || 0), 0);
});

const activeOrdersCount = computed(() => {
  return orders.value.filter(o => ['pending', 'processing', 'assigned', 'picked_up'].includes(o.status)).length;
});

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins} mins ago`;
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hrs ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatWhatsAppNumber = (phone: string | undefined | null) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `234${digits}`;
  }
  return digits;
};

const handleCancelOrder = async (orderId: string) => {
  const reason = window.prompt("Enter reason for cancelling this order:");
  if (reason) {
    try {
      await admin_api.cancelOrder(orderId, { reason });
      alert('Order cancelled successfully.');
      fetchOrders();
      selectedOrder.value = null;
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order.');
    }
  }
};

const handleAssignDispatcher = async () => {
  if (!assigningErranderId.value) return;
  isAssigning.value = true;
  try {
    await admin_api.assignOrder(selectedOrder.value._id, { erranderId: assigningErranderId.value });
    alert('Dispatcher assigned successfully.');
    fetchOrders();
    selectedOrder.value = null;
    assigningErranderId.value = '';
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to assign dispatcher.');
  } finally {
    isAssigning.value = false;
  }
};

onMounted(() => {
  fetchDropdowns();
  fetchOrders();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
