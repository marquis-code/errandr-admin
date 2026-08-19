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
          class="w-full pl-10 pr-4 py-2.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] placeholder:text-gray-400 shadow-sm"
        />
      </div>
      
      <div class="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100 shrink-0 shadow-sm">
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
      
      <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-1 bg-gray-50 p-1 rounded-lg w-fit border border-gray-100">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="selectedStatus = status"
          class="px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0"
          :class="selectedStatus === status ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-700'"
        >
          <span class="capitalize">{{ status }}</span>
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100/60 shadow-sm hover:shadow-md transition-all overflow-hidden min-h-[400px] relative">
      <div class="px-6 py-5 border-b border-gray-100/60 bg-gray-50/50 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Recent Orders</h3>
      </div>
      
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">
        <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading Orders...
      </div>

      <div v-else-if="filteredOrders.length === 0" class="py-20 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 shadow-sm border border-gray-100">
          <PackageOpen class="w-8 h-8" />
        </div>
        <h4 class="font-bold text-gray-900 tracking-tight">No orders found</h4>
        <p class="text-sm text-gray-500 mt-1">There are currently no active orders matching your filter.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100/60 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500">
              <th class="py-3 px-5 font-bold whitespace-nowrap">Date</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap">Customer</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap">Amount</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap text-center">Vendor</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap text-center">Status</th>
              <th class="py-3 px-5 font-bold whitespace-nowrap text-right">Actions</th>
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
                    {{ (order.customer || order.user)?.firstName?.[0] || '?' }}
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-900 leading-none mb-0.5">{{ (order.customer || order.user)?.firstName }} {{ (order.customer || order.user)?.lastName }}</p>
                    <p class="text-[10px] font-medium text-gray-500">ID: {{ (order.customer || order.user)?._id?.slice(-6) || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="text-xs font-semibold text-gray-900">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <div v-if="order.type === 'custom_errand'" class="inline-flex items-center gap-2 pr-2 py-1 pl-1 bg-white rounded-md border border-gray-100 truncate max-w-[150px]">
                  <div class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[#FF5C1A] shrink-0 bg-[#FF5C1A]/10 border border-[#FF5C1A]/20">
                    C
                  </div>
                  <p class="text-[10px] font-semibold text-gray-700 truncate">Custom Errand</p>
                </div>
                <div v-else class="inline-flex items-center gap-2 pr-2 py-1 pl-1 bg-white rounded-md border border-gray-100 truncate max-w-[150px]">
                  <div class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-gray-900 shrink-0 bg-gray-100 border border-gray-200">
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
                <div class="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 group-hover:bg-gray-100 transition-colors">
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
          
          <div class="flex items-center justify-between w-4/5 bg-white rounded-lg border border-gray-100 divide-x divide-gray-100 shadow-sm">
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
          <div class="space-y-4">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Order Details
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
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Status</span>
                <StatusBadge :status="selectedOrder.status" class="scale-90 origin-left" />
              </div>
              <div v-if="selectedOrder.uniqueCode">
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Verification Code</span>
                <span class="text-xs font-bold text-gray-900 tracking-wider">{{ selectedOrder.uniqueCode }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="space-y-4 mt-6">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
              Customer Information
              <a v-if="selectedOrder.customer?.phone || selectedOrder.user?.phone" :href="`https://wa.me/${(selectedOrder.customer?.phone || selectedOrder.user?.phone || '').replace(/\\D/g, '')}`" target="_blank" class="p-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Chat on WhatsApp">
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </h4>
            <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
                <p class="font-bold text-gray-900">{{ selectedOrder.customer?.firstName || selectedOrder.user?.firstName }} {{ selectedOrder.customer?.lastName || selectedOrder.user?.lastName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                <p class="font-bold text-gray-900">{{ selectedOrder.customer?.phone || selectedOrder.user?.phone || 'N/A' }}</p>
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
              <a v-if="selectedOrder.errander?.phone" :href="`https://wa.me/${selectedOrder.errander.phone.replace(/\\D/g, '')}`" target="_blank" class="p-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Chat on WhatsApp">
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
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

          <!-- Custom Errand Specific -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.type === 'custom_errand' && selectedOrder.customDetails">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Errand Specifics
            </h4>
            <div class="px-2 space-y-4">
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-[#FF5C1A] mt-0.5 shrink-0" />
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Pickup Location</p>
                  <p class="text-xs font-medium text-gray-900">{{ selectedOrder.customDetails.pickupLocation }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Dropoff Location</p>
                  <p class="text-xs font-medium text-gray-900">{{ selectedOrder.customDetails.dropoffLocation }}</p>
                </div>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
                <p class="text-xs font-medium text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">{{ selectedOrder.customDetails.description }}</p>
              </div>
            </div>
          </div>

          <!-- Marketplace Specific -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.type === 'marketplace'">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Items & Vendor
            </h4>
            <div class="px-2 space-y-4">
              <div class="flex items-center justify-between mb-2" v-if="selectedOrder.vendor">
                <div class="flex items-center gap-2">
                  <Store class="w-4 h-4 text-[#FF5C1A]" />
                  <span class="text-xs font-bold text-gray-900">{{ selectedOrder.vendor.storeName }}</span>
                </div>
                <a v-if="selectedOrder.vendor?.phone || selectedOrder.vendor?.owner?.phone" :href="`https://wa.me/${(selectedOrder.vendor?.phone || selectedOrder.vendor?.owner?.phone || '').replace(/\\D/g, '')}`" target="_blank" class="p-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Chat with Vendor on WhatsApp">
                  <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              
              <div class="space-y-4" v-if="selectedOrder.items?.length">
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

              <!-- Packs -->
              <div class="space-y-4 mt-2" v-if="selectedOrder.packs?.length">
                <div v-for="pack in selectedOrder.packs" :key="pack._id" class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div class="flex items-center gap-2 mb-3">
                    <Box class="w-3.5 h-3.5 text-gray-400" />
                    <span class="text-xs font-bold text-gray-900 uppercase tracking-wide">{{ pack.name }}</span>
                  </div>
                  <div class="space-y-2 pl-5">
                    <div v-for="pItem in pack.items" :key="pItem._id" class="flex justify-between items-center text-xs">
                      <span class="text-gray-600 font-medium"><span class="font-bold text-gray-900 mr-1">{{ pItem.quantity }}x</span> {{ pItem.name }}</span>
                      <span class="text-gray-900 font-black">₦{{ Number(pItem.subtotal || 0).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.vendorNote || selectedOrder.adminNote">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Instructions & Notes
            </h4>
            <div class="px-2 space-y-3">
              <div v-if="selectedOrder.vendorNote" class="bg-amber-50 p-3 rounded-xl flex gap-3">
                <MessageSquare class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p class="text-xs font-medium text-amber-900 leading-relaxed"><span class="font-bold block mb-1 uppercase text-[10px]">Customer Note</span> {{ selectedOrder.vendorNote }}</p>
              </div>
              <div v-if="selectedOrder.adminNote" class="bg-blue-50 p-3 rounded-xl flex gap-3">
                <MessageSquare class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p class="text-xs font-medium text-blue-900 leading-relaxed"><span class="font-bold block mb-1 uppercase text-[10px]">Admin Note</span> {{ selectedOrder.adminNote }}</p>
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
                <!-- Breakdown -->
                <div class="pl-3 border-l-2 border-[#FF5C1A]/20 space-y-2" v-if="selectedOrder.erranderPayout || selectedOrder.serviceFee">
                  <div class="flex justify-between items-center text-[11px]" v-if="selectedOrder.erranderPayout">
                    <span class="text-[#FF5C1A] font-bold">↳ Errander Payout</span>
                    <span class="text-[#FF5C1A] font-black">₦{{ Number(selectedOrder.erranderPayout || 0).toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center text-[11px]" v-if="selectedOrder.serviceFee">
                    <span class="text-gray-900 font-bold">↳ Platform Service Fee</span>
                    <span class="text-gray-900 font-black">₦{{ Number(selectedOrder.serviceFee || 0).toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <!-- Discounts / Promos -->
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.discountAmount">
                <span class="text-emerald-500 font-bold uppercase tracking-wide text-[10px]">Discount Applied</span>
                <span class="text-emerald-600 font-black">-₦{{ Number(selectedOrder.discountAmount || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.vendorPrepaidPromoAmount">
                <span class="text-emerald-500 font-bold uppercase tracking-wide text-[10px]">Vendor Prepaid Promo</span>
                <span class="text-emerald-600 font-black">-₦{{ Number(selectedOrder.vendorPrepaidPromoAmount || 0).toLocaleString() }}</span>
              </div>

              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.platformProcessingFee">
                <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Processing Fee</span>
                <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.platformProcessingFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-xs" v-if="selectedOrder.transferFee">
                <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Transfer Fee</span>
                <span class="text-gray-900 font-bold">₦{{ Number(selectedOrder.transferFee || 0).toLocaleString() }}</span>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <span class="text-xs font-black text-gray-900 uppercase">Total Paid</span>
                <span class="text-lg font-black text-[#FF5C1A]">₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Cancellation info -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.status === 'cancelled'">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Cancellation Details
            </h4>
            <div class="bg-rose-50 p-4 rounded-xl">
              <p class="text-[10px] font-bold text-rose-800 uppercase tracking-wide mb-1">Reason</p>
              <p class="text-xs font-medium text-rose-900">{{ selectedOrder.cancellationReason || 'No reason provided' }}</p>
              <div class="mt-2 text-[10px] font-semibold text-rose-700 flex justify-between" v-if="selectedOrder.cancelledBy">
                <span>Cancelled By: <span class="uppercase">{{ selectedOrder.cancelledBy }}</span></span>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="space-y-4 mt-6" v-if="selectedOrder.statusHistory?.length">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Order Timeline
            </h4>
            <div class="px-2 relative pl-6">
              <div class="absolute top-2 bottom-2 left-3 w-px bg-gray-200"></div>
              <div class="space-y-6">
                <div v-for="(hist, idx) in selectedOrder.statusHistory" :key="hist._id || idx" class="flex items-start gap-4 relative z-10">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white border-2"
                    :class="idx === selectedOrder.statusHistory.length - 1 ? 'border-[#FF5C1A] text-[#FF5C1A]' : 'border-gray-200 text-gray-400'">
                    <CheckCircle2 class="w-3.5 h-3.5" v-if="idx < selectedOrder.statusHistory.length - 1" />
                    <div class="w-2 h-2 rounded-full bg-[#FF5C1A]" v-else />
                  </div>
                  <div class="flex-1 min-w-0 pt-0.5">
                    <p class="text-xs font-bold text-gray-900 capitalize">{{ hist.status?.replace(/_/g, ' ') }}</p>
                    <p class="text-[10px] font-medium text-gray-500 mt-0.5 leading-relaxed" v-if="hist.note">{{ hist.note }}</p>
                    <p class="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">{{ new Date(hist.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions Panel -->
        <div class="fixed bottom-0 right-0 w-full md:w-[460px] p-4 bg-white border-t border-gray-100 z-[105] flex gap-3">
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
import { PackageOpen, Package, Search, ChevronRight, Copy, MapPin, Store, Box, CreditCard, CheckCircle2, Clock, MessageSquare } from 'lucide-vue-next';
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
    const customer = o.customer || o.user;
    const matchesSearch = !searchQuery.value || 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      o._id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (customer && `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (o.vendor && o.vendor.storeName && o.vendor.storeName.toLowerCase().includes(searchQuery.value.toLowerCase()));
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
