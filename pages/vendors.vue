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
          class="w-full pl-14 pr-14 py-3.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl text-base font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400 shadow-sm"
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
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="py-4 px-6 font-semibold text-gray-600 text-sm whitespace-nowrap">Store Name</th>
              <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap">Type & Category</th>
              <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap">Stats</th>
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
                <div class="flex flex-col gap-1.5 items-start">
                  <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">
                    {{ vendor.category?.replace('_', ' ') || 'Standard' }}
                  </span>
                  <span class="text-xs font-semibold text-gray-500 capitalize">
                    {{ vendor.businessType?.replace('_', ' ') || 'Store' }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-1.5">
                    <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span class="text-xs font-bold text-gray-900">{{ vendor.rating || 0 }}</span>
                  </div>
                  <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{{ vendor.totalOrders || 0 }} Orders</span>
                </div>
              </td>
              <td class="py-4 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="vendor.status" class="scale-75" />
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-1.5 mb-1">
                    <p class="text-sm font-bold text-gray-900 leading-none">{{ vendor.owner?.firstName }} {{ vendor.owner?.lastName }}</p>
                    <span v-if="vendor.isStudentBusiness" class="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0" title="Student Vendor">
                      <GraduationCap class="w-3 h-3" />
                    </span>
                  </div>
                  <span class="text-xs font-medium text-gray-500 truncate max-w-[150px]" :title="vendor.owner?.email">{{ vendor.owner?.email }}</span>
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
                  <!-- Dropdown Trigger -->
                  <button @click.stop="activeDropdownId = activeDropdownId === vendor._id ? null : vendor._id" class="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="activeDropdownId === vendor._id" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <button @click.stop="activeDropdownId = null; selectedVendor = vendor; activeDrawerTab = 'overview'" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Eye class="w-4 h-4 text-gray-400" /> View Profile
                    </button>
                    <button @click.stop="activeDropdownId = null; selectedVendor = vendor; activeDrawerTab = 'edit'" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Edit class="w-4 h-4 text-gray-400" /> Edit Details
                    </button>
                    <NuxtLink :to="`/vendors/${vendor._id}`" class="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium">
                      <LayoutList class="w-4 h-4 text-indigo-500" /> Manage Menu & Promos
                    </NuxtLink>
                    
                    <div class="h-px w-full bg-gray-100 my-1"></div>
                    
                    <button 
                      v-if="vendor.status === 'pending' || vendor.status === 'suspended'"
                      @click.stop="activeDropdownId = null; initiateAction('approve', vendor._id)" 
                      class="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <CheckCircle class="w-4 h-4" /> {{ vendor.status === 'suspended' ? 'Restore Vendor' : 'Approve Vendor' }}
                    </button>
                    
                    <button 
                      v-if="vendor.status !== 'suspended'" 
                      @click.stop="activeDropdownId = null; initiateAction('reject', vendor._id)" 
                      class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <XCircle class="w-4 h-4" /> Suspend Vendor
                    </button>

                    <button 
                      @click.stop="activeDropdownId = null; initiateAction('toggleVisibility', vendor._id, vendor.isVisible !== false ? false : true)" 
                      class="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                    >
                      <EyeOff v-if="vendor.isVisible !== false" class="w-4 h-4" /> 
                      <Eye v-else class="w-4 h-4" /> 
                      {{ vendor.isVisible !== false ? 'Hide from Website' : 'Show on Website' }}
                    </button>

                    <div class="h-px w-full bg-gray-100 my-1"></div>

                    <button 
                      @click.stop="activeDropdownId = null; initiateAction('delete', vendor._id)" 
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 class="w-4 h-4" /> Delete Permanently
                    </button>
                  </div>
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
      :isLoading="isProcessingAction"
      @cancel="confirmModal.isOpen = false"
      @confirm="executeAction"
    />

    <!-- Vendor Details Side Drawer -->
    <SideDrawer :isOpen="!!selectedVendor" size="full" @close="selectedVendor = null">
      <template v-if="selectedVendor">
        <!-- Header -->
        <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100 bg-white">
          <img :src="selectedVendor.logo || 'https://via.placeholder.com/150'" alt="Store Logo" class="w-20 h-20 rounded-2xl object-cover shadow-sm mb-4 border border-gray-100" />
          <h3 class="text-xl font-semibold text-gray-900 font-heading mb-1">{{ selectedVendor.storeName }}</h3>
          <p class="text-xs font-semibold text-[#FF5C1A] uppercase tracking-wide bg-[#FF5C1A]/10 px-3 py-1 rounded-full mb-4">{{ selectedVendor.category?.replace('_', ' ') || 'General' }}</p>

          <div class="flex space-x-2 mt-2 mb-4 w-5/6">
            <button @click="activeDrawerTab = 'overview'" :class="activeDrawerTab === 'overview' ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-600'" class="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors">Overview</button>
            <button @click="activeDrawerTab = 'menu'" :class="activeDrawerTab === 'menu' ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-600'" class="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors">Menu</button>
            <button @click="enterEditMode" :class="activeDrawerTab === 'edit' ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-600'" class="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors">Edit</button>
          </div>

          <div class="flex items-center justify-between w-5/6 bg-white rounded-lg border border-gray-100 divide-x divide-gray-100 shadow-sm">
            <div class="text-center flex-1 py-3">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Rating</p>
              <div class="flex items-center justify-center gap-1">
                <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
                <p class="text-sm font-bold text-gray-900">{{ selectedVendor.rating || 0 }}</p>
              </div>
            </div>
            <div class="text-center flex-1 py-3">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Orders</p>
              <p class="text-sm font-bold text-gray-900">{{ selectedVendor.totalOrders || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="p-6 space-y-6 pb-24 bg-gray-50/30">
          
          <template v-if="activeDrawerTab === 'overview'">
          <!-- Basic Info -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Store Information</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div class="flex items-start gap-3">
                <Store class="w-4 h-4 text-gray-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description</p>
                  <p class="text-xs font-medium text-gray-900 leading-relaxed mt-1">{{ selectedVendor.description || 'No description provided.' }}</p>
                </div>
              </div>
              <div class="w-full h-px bg-gray-100 ml-7" />
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Globe class="w-4 h-4 text-gray-400" />
                  <span class="text-xs font-semibold text-gray-900">{{ selectedVendor.subdomain || 'N/A' }}.erranders.com</span>
                </div>
                <Copy class="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
              </div>
            </div>
          </div>

          <!-- Owner Details -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Owner Profile</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <User class="w-4 h-4 text-gray-400" />
                  <span class="text-xs font-semibold text-gray-900">{{ selectedVendor.owner?.firstName }} {{ selectedVendor.owner?.lastName }}</span>
                </div>
              </div>
              <div class="w-full h-px bg-gray-100 ml-7" />
              <div class="flex items-center gap-3">
                <Mail class="w-4 h-4 text-gray-400" />
                <span class="text-xs font-semibold text-gray-900">{{ selectedVendor.owner?.email }}</span>
              </div>
              <div class="w-full h-px bg-gray-100 ml-7" />
              <div class="flex items-center gap-3">
                <Phone class="w-4 h-4 text-gray-400" />
                <span class="text-xs font-semibold text-gray-900">{{ selectedVendor.owner?.phone || selectedVendor.phone || 'N/A' }}</span>
              </div>
              
              <template v-if="selectedVendor.isStudentBusiness">
                <div class="w-full h-px bg-gray-100" />
                <div class="bg-blue-50 p-3 rounded-lg flex items-start gap-3">
                  <GraduationCap class="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Student Vendor</p>
                    <p class="text-xs font-semibold text-blue-900 mt-0.5">{{ selectedVendor.university || 'University Student' }} ({{ selectedVendor.matricNumber || 'N/A' }})</p>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Logistics & Fees -->
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Logistics & Config</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Business Type</span>
                <span class="text-xs font-bold text-gray-900 capitalize">{{ selectedVendor.businessType?.replace('_', ' ') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Service Location</span>
                <span class="text-xs font-bold text-gray-900 capitalize">{{ selectedVendor.serviceLocation?.replace('_', ' ') || 'N/A' }}</span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Base Delivery Fee</span>
                <span class="text-xs font-bold text-gray-900">₦{{ selectedVendor.baseDeliveryFee || selectedVendor.deliveryFee || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Packaging Fee</span>
                <span class="text-xs font-bold text-gray-900">₦{{ selectedVendor.packagingFee || 0 }}</span>
              </div>
              <div class="w-full h-px bg-gray-100" />
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Min Order</span>
                <span class="text-xs font-bold text-gray-900">₦{{ selectedVendor.minimumOrder || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Prep Time</span>
                <span class="text-xs font-bold text-gray-900">{{ selectedVendor.preparationTime || 0 }} mins</span>
              </div>
              
              <template v-if="selectedVendor.preOrderOnly">
                <div class="w-full h-px bg-gray-100" />
                <div class="bg-amber-50 p-3 rounded-lg flex items-center gap-3">
                  <AlertCircle class="w-4 h-4 text-amber-600" />
                  <p class="text-xs font-semibold text-amber-900">Pre-order Only ({{ selectedVendor.preOrderLeadTime }}hrs lead time)</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Bank Details -->
          <div class="space-y-3" v-if="selectedVendor.bankDetails">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payout Details</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div class="flex items-start gap-3">
                <Banknote class="w-4 h-4 text-gray-400 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs font-bold text-gray-900">{{ selectedVendor.bankDetails.bankName }}</p>
                  <p class="text-[11px] font-semibold text-gray-500 mt-0.5">{{ selectedVendor.bankDetails.accountNumber }}</p>
                  <p class="text-[10px] font-bold text-gray-400 mt-1 uppercase">{{ selectedVendor.bankDetails.accountName }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="space-y-3" v-if="selectedVendor.businessHours?.length">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Business Hours</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <div v-for="hours in selectedVendor.businessHours" :key="hours._id" class="flex items-center justify-between text-xs">
                <span class="font-semibold text-gray-600 capitalize w-24">{{ hours.day }}</span>
                <span v-if="hours.isClosed" class="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md text-[10px] uppercase">Closed</span>
                <span v-else class="font-medium text-gray-900">{{ hours.open }} - {{ hours.close }}</span>
              </div>
            </div>
          </div>

          <!-- Offers / Tags -->
          <div class="space-y-3" v-if="selectedVendor.offers?.length">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Active Offers</h4>
            <div class="space-y-2">
              <div v-for="(offer, idx) in selectedVendor.offers" :key="idx" class="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-start gap-2">
                <Percent class="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <p class="text-xs font-medium text-emerald-900">{{ offer }}</p>
              </div>
            </div>
          </div>
          </template>

          <template v-if="activeDrawerTab === 'menu'">
            <VendorMenuManager :vendorId="selectedVendor._id" />
          </template>

          <!-- Edit Tab -->
          <template v-if="activeDrawerTab === 'edit'">
            <form @submit.prevent="handleUpdateVendor" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2 col-span-2">
                  <label class="text-xs font-semibold text-gray-700">Store Name</label>
                  <input v-model="editVendorPayload.storeName" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2 col-span-2">
                  <label class="text-xs font-semibold text-gray-700">Description</label>
                  <textarea v-model="editVendorPayload.description" rows="2" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"></textarea>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Subdomain</label>
                  <input v-model="editVendorPayload.subdomain" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Category</label>
                  <input v-model="editVendorPayload.category" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Business Type</label>
                  <select v-model="editVendorPayload.businessType" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="physical_product">Physical Product</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Service Location</label>
                  <input v-model="editVendorPayload.serviceLocation" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Base Delivery Fee</label>
                  <input v-model="editVendorPayload.baseDeliveryFee" type="number" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Packaging Fee</label>
                  <input v-model="editVendorPayload.packagingFee" type="number" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Min Order</label>
                  <input v-model="editVendorPayload.minimumOrder" type="number" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Prep Time (mins)</label>
                  <input v-model="editVendorPayload.preparationTime" type="number" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Status</label>
                  <select v-model="editVendorPayload.status" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <button type="submit" :disabled="updatingVendor" class="w-full py-3 bg-[#FF5C1A] text-white rounded-xl font-bold hover:bg-[#E04D12] transition-colors disabled:opacity-50">
                {{ updatingVendor ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </template>
        </div>

        <!-- Actions -->
        <div class="border-t border-gray-100 pt-4 mt-6 flex gap-3">
          <button 
            v-if="selectedVendor.status === 'pending' || selectedVendor.status === 'suspended'"
            @click="initiateAction('approve', selectedVendor._id)"
            class="flex-1 py-3 px-4 rounded-lg text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle class="w-4 h-4" /> {{ selectedVendor.status === 'suspended' ? 'Restore Vendor' : 'Approve Vendor' }}
          </button>
          
          <button 
            v-if="selectedVendor.status !== 'suspended'"
            @click="initiateAction('reject', selectedVendor._id)"
            class="flex-1 py-3 px-4 rounded-lg text-rose-600 font-semibold text-xs bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle class="w-4 h-4" /> Suspend Vendor
          </button>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { useAdminVendors } from '@/composables/modules/admin';
import { Search, Store, Eye, EyeOff, Trash2, CheckCircle, XCircle, RefreshCcw, Star, Globe, Copy, User, Mail, Phone, GraduationCap, Banknote, AlertCircle, Percent, MoreVertical, Edit, Loader2, LayoutList } from 'lucide-vue-next';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import VendorMenuManager from "@/components/vendors/VendorMenuManager.vue";

import EmptyState from '@/components/core/EmptyState.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';

import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Vendors - Errander Admin' });

const router = useRouter();
const { showToast } = useCustomToast();
const { vendors, loading, fetchVendors, approveVendor, rejectVendor, toggleVendorVisibility, deleteVendor } = useAdminVendors();
const activeTab = ref('all');
const searchQuery = ref('');
const selectedVendor = ref<any>(null);
const activeDrawerTab = ref('overview');
const activeDropdownId = ref<string | null>(null);

// Close dropdown when clicking outside
const closeDropdown = () => {
  activeDropdownId.value = null;
};
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const editVendorPayload = ref({ 
  storeName: '', 
  description: '',
  subdomain: '',
  category: '', 
  businessType: 'physical_product', 
  serviceLocation: '',
  baseDeliveryFee: 0,
  packagingFee: 0,
  minimumOrder: 0,
  preparationTime: 0,
  status: 'pending' 
});
const updatingVendor = ref(false);

const enterEditMode = () => {
  activeDrawerTab.value = 'edit';
  if (selectedVendor.value) {
    editVendorPayload.value = {
      storeName: selectedVendor.value.storeName || '',
      description: selectedVendor.value.description || '',
      subdomain: selectedVendor.value.subdomain || '',
      category: selectedVendor.value.category || '',
      businessType: selectedVendor.value.businessType || 'physical_product',
      serviceLocation: selectedVendor.value.serviceLocation || '',
      baseDeliveryFee: selectedVendor.value.baseDeliveryFee || selectedVendor.value.deliveryFee || 0,
      packagingFee: selectedVendor.value.packagingFee || 0,
      minimumOrder: selectedVendor.value.minimumOrder || 0,
      preparationTime: selectedVendor.value.preparationTime || 0,
      status: selectedVendor.value.status || 'pending',
    };
  }
};

const handleUpdateVendor = async () => {
  if (!selectedVendor.value) return;
  updatingVendor.value = true;
  try {
    const res = await admin_api.updateVendor(selectedVendor.value._id, editVendorPayload.value);
    showToast({ title: 'Success', message: 'Vendor updated successfully', toastType: 'success' });
    await fetchVendors();
    selectedVendor.value = res.data.vendor || res.data;
  } catch (e) {
    console.error(e);
    showToast({ title: 'Error', message: 'Failed to update vendor', toastType: 'error' });
  } finally {
    updatingVendor.value = false;
  }
};

const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm',
  actionType: '',
  vendorId: '',
  payload: null as any
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

const initiateAction = (action: 'approve' | 'reject' | 'delete' | 'toggleVisibility', vendorId: string, payload?: any) => {
  confirmModal.value.vendorId = vendorId;
  confirmModal.value.actionType = action;
  confirmModal.value.payload = payload;
  confirmModal.value.isOpen = true;
  
  if (action === 'approve') {
    confirmModal.value.title = 'Approve/Restore Vendor';
    confirmModal.value.message = 'Are you sure you want to approve this vendor application? They will be able to start selling.';
    confirmModal.value.type = 'success';
    confirmModal.value.confirmText = 'Approve';
  } else if (action === 'reject') {
    confirmModal.value.title = 'Suspend/Reject Vendor';
    confirmModal.value.message = 'Are you sure you want to reject or suspend this vendor? Their store will be hidden.';
    confirmModal.value.type = 'danger';
    confirmModal.value.confirmText = 'Suspend';
  } else if (action === 'delete') {
    confirmModal.value.title = 'Delete Vendor Permanently';
    confirmModal.value.message = 'Are you sure you want to permanently delete this vendor? This action cannot be undone.';
    confirmModal.value.type = 'danger';
    confirmModal.value.confirmText = 'Delete';
  } else if (action === 'toggleVisibility') {
    confirmModal.value.title = payload ? 'Show Vendor' : 'Hide Vendor';
    confirmModal.value.message = payload 
      ? 'Are you sure you want to make this vendor visible on the website again?'
      : 'Are you sure you want to hide this vendor from the website? Customers will no longer see them.';
    confirmModal.value.type = 'warning';
    confirmModal.value.confirmText = payload ? 'Show' : 'Hide';
  }
};

const isProcessingAction = ref(false);

const executeAction = async () => {
  isProcessingAction.value = true;
  confirmModal.value.isOpen = false;
  const { actionType, vendorId, payload } = confirmModal.value;
  
  try {
    if (actionType === 'approve') {
      await approveVendor(vendorId);
    } else if (actionType === 'reject') {
      await rejectVendor(vendorId);
    } else if (actionType === 'delete') {
      await deleteVendor(vendorId);
      if (selectedVendor.value?._id === vendorId) {
        selectedVendor.value = null;
      }
    } else if (actionType === 'toggleVisibility') {
      await toggleVendorVisibility(vendorId, payload);
      if (selectedVendor.value?._id === vendorId) {
        selectedVendor.value.isVisible = payload;
      }
    }
  } finally {
    isProcessingAction.value = false;
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
