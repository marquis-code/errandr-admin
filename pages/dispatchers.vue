<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dispatcher Verifications</h1>
      <button @click="fetchPending" class="p-2 text-gray-400 hover:text-gray-900 transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100">
      <button 
        @click="activeTab = 'verifications'"
        class="pb-4 text-sm font-bold transition-colors border-b-2 relative -mb-[1px]"
        :class="activeTab === 'verifications' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Pending Verifications
        <span v-if="total > 0" class="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-[10px] w-5 h-5 rounded-full">{{ total }}</span>
      </button>
      <button 
        @click="activeTab = 'all'"
        class="pb-4 text-sm font-bold transition-colors border-b-2 relative -mb-[1px]"
        :class="activeTab === 'all' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        All Dispatchers
      </button>
    </div>

    <!-- Verifications Tab -->
    <div v-show="activeTab === 'verifications'" class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pending Approvals</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ total }}</p>
        </div>
      </div>

    <!-- Pending Table -->
    <!-- Pending Table -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100/60 overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
      <div class="px-6 py-5 border-b border-gray-100/60 bg-gray-50/50">
        <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Requires Admin Review</h3>
      </div>
      
      <div v-if="loading && !dispatchers.length" class="p-8 text-center text-gray-400 text-sm">
        <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading Verifications...
      </div>
      
      <div v-else-if="dispatchers.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-[#FF5C1A]/10 rounded-full flex items-center justify-center text-[#FF5C1A] mx-auto mb-4 shadow-sm border border-[#FF5C1A]/20">
          <CheckSquare class="w-8 h-8" />
        </div>
        <h4 class="font-bold text-gray-900 tracking-tight">All caught up!</h4>
        <p class="text-sm text-gray-500 mt-1">There are no pending dispatcher verifications to review.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
              <th class="px-6 py-4 font-bold">Dispatcher</th>
              <th class="px-6 py-4 font-bold">School & Matric</th>
              <th class="px-6 py-4 font-bold">Level</th>
              <th class="px-6 py-4 font-bold text-center">ID Card</th>
              <th class="px-6 py-4 font-bold text-center">Selfie</th>
              <th class="px-6 py-4 font-bold text-center">NIN</th>
              <th class="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="errander in dispatchers" :key="errander._id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0">
                    <img v-if="errander.user?.avatar" :src="errander.user?.avatar" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                      {{ errander.user?.firstName?.[0] }}
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ errander.user?.firstName }} {{ errander.user?.lastName }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ errander.user?.email }}</p>
                    <p class="text-xs text-gray-500">{{ errander.user?.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-bold text-gray-900">{{ errander.school || 'Not specified' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ errander.matricNumber || 'Not specified' }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">Tier {{ errander.verificationLevel || 1 }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="errander.idCardImage" @click="viewImage(errander.idCardImage)" class="inline-flex w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 hover:border-[#FF5C1A] transition-colors relative group">
                  <img :src="errander.idCardImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span class="text-[10px] text-white font-bold">View</span>
                  </div>
                </button>
                <span v-else class="text-xs text-gray-400">No Image</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="errander.selfieImage" @click="viewImage(errander.selfieImage)" class="inline-flex w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-100 hover:border-[#FF5C1A] transition-colors relative group">
                  <img :src="errander.selfieImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <span class="text-[10px] text-white font-bold">View</span>
                  </div>
                </button>
                <span v-else class="text-xs text-gray-400">No Image</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="errander.ninSlipImage" @click="viewImage(errander.ninSlipImage)" class="inline-flex w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 hover:border-[#FF5C1A] transition-colors relative group">
                  <img :src="errander.ninSlipImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span class="text-[10px] text-white font-bold">View</span>
                  </div>
                </button>
                <span v-else-if="errander.ninNumber" class="text-xs font-bold text-gray-900 border border-gray-100 px-2 py-1 rounded bg-gray-50">{{ errander.ninNumber }}</span>
                <span v-else class="text-xs text-gray-400">N/A</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openApproveModal(errander)" 
                    :disabled="processing === errander._id"
                    class="px-4 py-2 bg-[#FF5C1A]/10 text-[#FF5C1A] font-bold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    Approve
                  </button>
                  <button 
                    @click="openRejectModal(errander)" 
                    :disabled="processing === errander._id"
                    class="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <button 
          @click="page--" 
          :disabled="page === 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-500">Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="page++" 
          :disabled="page === totalPages"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </div>
    
    <!-- All Dispatchers Tab -->
    <div v-show="activeTab === 'all'" class="space-y-6">
      
      <!-- Skeletons for Loading -->
      <div v-if="allLoading && !allDispatchers.length" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="`stat-loading-${i}`" class="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between animate-pulse">
          <div class="flex justify-between items-center mb-4">
            <div class="w-10 h-10 bg-gray-100 rounded-lg"></div>
            <div class="w-12 h-4 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <div class="w-20 h-3 bg-gray-100 rounded mb-1.5"></div>
            <div class="w-24 h-6 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[1.25rem] border border-gray-100/60 transition-all hover:shadow-md group overflow-hidden relative">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
          <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Dispatchers</p>
          <p class="text-3xl font-black text-gray-900 mt-2 tracking-tight">{{ allTotal }}</p>
        </div>
        <div class="bg-white p-5 rounded-[1.25rem] border border-gray-100/60 transition-all hover:shadow-md group overflow-hidden relative">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
          <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Approved</p>
          <p class="text-3xl font-black text-[#FF5C1A] mt-2 tracking-tight">{{ allDispatchers.filter((d: any) => d.isApproved).length }}</p>
        </div>
      </div>

      <div class="bg-white rounded-[1.25rem] border border-gray-100/60 overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
        <div class="px-6 py-5 border-b border-gray-100/60 bg-gray-50/50 flex justify-between items-center">
          <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Registered Dispatchers</h3>
        </div>
        
        <div v-if="allLoading && !allDispatchers.length" class="p-8 text-center text-gray-400 text-sm">
          <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading Directory...
        </div>
        
        <div v-else-if="allDispatchers.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 shadow-sm border border-gray-100">
            <Bike class="w-8 h-8" />
          </div>
          <h4 class="font-bold text-gray-900 tracking-tight">No dispatchers found</h4>
          <p class="text-sm text-gray-500 mt-1">There are currently no registered dispatchers.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <!-- Batch Actions Toolbar -->
          <div v-if="selectedDispatchers.length > 0" class="bg-red-50/80 backdrop-blur-sm px-6 py-4 border-b border-red-100 flex justify-between items-center">
            <span class="text-red-700 font-bold text-sm tracking-tight">{{ selectedDispatchers.length }} dispatcher(s) selected</span>
            <button @click="confirmBatchDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">
              Delete Selected
            </button>
          </div>
          
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100/60 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500">
                <th class="px-6 py-4 w-12 text-center">
                  <input type="checkbox" :checked="selectedDispatchers.length === allDispatchers.length && allDispatchers.length > 0" @change="toggleSelectAll" class="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </th>
                <th class="px-6 py-4 font-bold">Dispatcher</th>
                <th class="px-6 py-4 font-bold">School & Matric</th>
                <th class="px-6 py-4 font-bold">Verification</th>
                <th class="px-6 py-4 font-bold text-center">Deliveries</th>
                <th class="px-6 py-4 font-bold text-center text-[#FF5C1A]">Earnings</th>
                <th class="px-6 py-4 font-bold text-center">Status</th>
                <th class="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="errander in allDispatchers" :key="errander._id" class="hover:bg-gray-50/50 transition-colors" :class="{'bg-red-50/20': selectedDispatchers.includes(errander._id)}">
                <td class="px-6 py-4 text-center">
                  <input type="checkbox" v-model="selectedDispatchers" :value="errander._id" @click.stop class="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      <img v-if="errander.user?.avatar" :src="errander.user?.avatar" class="w-full h-full object-cover">
                      <div v-else class="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                        {{ errander.user?.firstName?.[0] }}
                      </div>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900 text-sm">{{ errander.user?.firstName }} {{ errander.user?.lastName }}</h4>
                      <p class="text-xs text-gray-500 mt-0.5">{{ errander.user?.email }}</p>
                      <p class="text-xs text-gray-500">{{ errander.user?.phone }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-bold text-gray-900">{{ errander.school || 'Not specified' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ errander.matricNumber || 'Not specified' }}</p>
                </td>
                <td class="px-6 py-4">
                  <span v-if="errander.isApproved" class="px-2.5 py-1 bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 text-[#FF5C1A] text-xs font-bold rounded-lg shadow-sm">Approved (Tier {{ errander.verificationLevel || 1 }})</span>
                  <span v-else class="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-lg shadow-sm">Pending (Tier {{ errander.verificationLevel || 1 }})</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">{{ errander.totalDeliveries || 0 }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2.5 py-1 rounded-md border border-[#FF5C1A]/20">₦{{ (errander.totalEarnings || 0).toLocaleString() }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span v-if="errander.status === 'online'" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-1 rounded-full"><div class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A]/100 animate-pulse"></div>Online</span>
                  <span v-else-if="errander.status === 'busy'" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Busy</span>
                  <span v-else class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>Offline</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 relative">
                    <!-- Dropdown Trigger -->
                    <button @click.stop="activeDropdownId = activeDropdownId === errander._id ? null : errander._id" class="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                      <MoreVertical class="w-4 h-4" />
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div v-if="activeDropdownId === errander._id" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <button @click.stop="activeDropdownId = null; openProfileDrawer(errander); activeDrawerTab = 'overview'" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Eye class="w-4 h-4 text-gray-400" /> View Profile
                      </button>
                      <button @click.stop="activeDropdownId = null; openProfileDrawer(errander); enterEditMode()" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Edit class="w-4 h-4 text-gray-400" /> Edit Details
                      </button>
                      
                      <div class="h-px w-full bg-gray-100 my-1"></div>
                      
                      <button 
                        v-if="errander.isApproved"
                        @click.stop="activeDropdownId = null; toggleSuspension(errander._id, 'suspend')" 
                        :disabled="processing === errander._id"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle class="w-4 h-4" /> Suspend
                      </button>
                      
                      <button 
                        v-else
                        @click.stop="activeDropdownId = null; toggleSuspension(errander._id, 'activate')" 
                        :disabled="processing === errander._id"
                        class="w-full text-left px-4 py-2 text-sm text-[#FF5C1A] hover:bg-[#FF5C1A]/10 flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle class="w-4 h-4" /> Reactivate
                      </button>
                      
                      <div class="h-px w-full bg-gray-100 my-1"></div>
                      
                      <button 
                        @click.stop="activeDropdownId = null; deleteDispatcher(errander._id)" 
                        :disabled="processing === errander._id"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 class="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="allTotalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            @click="allPage--" 
            :disabled="allPage === 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-sm text-gray-500">Page {{ allPage }} of {{ allTotalPages }}</span>
          <button 
            @click="allPage++" 
            :disabled="allPage === allTotalPages"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click="selectedImage = null">
      <img :src="selectedImage" class="max-w-full max-h-full rounded-xl" @click.stop>
      <button class="absolute top-6 right-6 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20" @click="selectedImage = null">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Approve Modal -->
    <div v-if="approveModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" @click.self="approveModalOpen = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <div class="w-16 h-16 bg-[#FF5C1A]/10 text-[#FF5C1A] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Approve Dispatcher?</h3>
        <p class="text-sm text-gray-500 mb-4">Are you sure you want to approve <span class="font-bold text-gray-900">{{ selectedDispatcher?.user?.firstName }} {{ selectedDispatcher?.user?.lastName }}</span>? They will gain full access to deliveries.</p>
        
        <div class="mb-6 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
          <label class="block text-xs font-bold text-gray-700 mb-2">Select Tier to Grant</label>
          <select v-model="selectedTier" class="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-base focus:ring-1 focus:ring-emerald-500 outline-none">
            <option :value="1">Tier 1 (Window Shopper)</option>
            <option :value="2">Tier 2 (Basic)</option>
            <option :value="3">Tier 3 (Pro)</option>
          </select>
        </div>

        <div class="flex gap-3">
          <button @click="approveModalOpen = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button @click="confirmApprove" :disabled="processing === selectedDispatcher?._id" class="flex-1 py-2.5 bg-[#FF5C1A]/100 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">Approve</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" @click.self="rejectModalOpen = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-left">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">Reject Verification</h3>
        <p class="text-sm text-gray-500 mb-4 text-center">Rejecting <span class="font-bold text-gray-900">{{ selectedDispatcher?.user?.firstName }} {{ selectedDispatcher?.user?.lastName }}</span> will block their access.</p>
        
        <div class="mb-6">
          <label class="block text-xs font-bold text-gray-700 mb-2">Reason for rejection (Optional)</label>
          <textarea v-model="rejectionReason" placeholder="e.g. ID card is blurry..." class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm resize-none h-24"></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="rejectModalOpen = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button @click="confirmReject" :disabled="processing === selectedDispatcher?._id" class="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50">Reject</button>
        </div>
      </div>
    </div>

    <!-- Profile Drawer -->
    <div v-if="drawerOpen" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="drawerOpen = false"></div>
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-lg font-bold text-gray-900">Dispatcher Profile</h2>
          <button @click="drawerOpen = false" class="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div v-if="selectedProfile" class="p-6 space-y-8 flex-1">
          <!-- Header -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
              <img v-if="selectedProfile.user?.avatar" :src="selectedProfile.user?.avatar" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-xl text-gray-900">{{ selectedProfile.user?.firstName }} {{ selectedProfile.user?.lastName }}</h3>
              <p class="text-sm text-gray-500">{{ selectedProfile.user?.email }}</p>
              <span v-if="selectedProfile.isApproved" class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-[#FF5C1A]/10 text-[#FF5C1A] text-xs font-bold rounded-md">
                <div class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A]/100"></div> Active
              </span>
              <span v-else class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded-md">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspended
              </span>
            </div>
          </div>

          <div class="flex space-x-2 mt-2 mb-4 w-full">
            <button @click="activeDrawerTab = 'overview'" :class="activeDrawerTab === 'overview' ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-600'" class="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors">Overview</button>
            <button @click="enterEditMode" :class="activeDrawerTab === 'edit' ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-600'" class="flex-1 py-2 text-xs font-semibold rounded-lg transition-colors">Edit</button>
          </div>

          <template v-if="activeDrawerTab === 'overview'">
            
            <!-- Personal & Contact Info -->
            <div class="space-y-4">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Identity & Contact</h4>
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.user?.phone || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">School</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.school || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Matric Number</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.matricNumber || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">NIN Number</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.ninNumber || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Guarantor Details -->
            <div v-if="selectedProfile.guarantorDetails" class="space-y-4 mt-6">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Guarantor Information</h4>
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                <div class="col-span-2">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Guarantor Name</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.guarantorDetails.name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.guarantorDetails.phone || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Relationship</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.guarantorDetails.relationship || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Banking & Financials -->
            <div class="space-y-4 mt-6">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Financials & Banking</h4>
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Wallet Balance</p>
                  <p class="text-lg font-black text-[#FF5C1A]">₦{{ Number(selectedProfile.user?.walletBalance || 0).toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Earnings</p>
                  <p class="text-lg font-black text-gray-900">₦{{ Number(selectedProfile.totalEarnings || 0).toLocaleString() }}</p>
                </div>
                <div class="col-span-2 mt-2" v-if="selectedProfile.bankName || selectedProfile.accountNumber">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Bank Details</p>
                    <p class="font-bold text-gray-900 text-sm">{{ selectedProfile.bankName || 'N/A' }}</p>
                    <p class="text-sm text-gray-600 font-mono">{{ selectedProfile.accountNumber || 'N/A' }} - {{ selectedProfile.accountName || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance & Gamification -->
            <div class="space-y-4 mt-6">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Performance Metrics</h4>
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Deliveries</p>
                  <p class="text-xl font-black text-gray-900">{{ selectedProfile.totalDeliveries || 0 }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Rating</p>
                  <div class="flex items-center gap-1.5">
                    <p class="text-xl font-black text-gray-900">{{ (selectedProfile.rating || 0).toFixed(1) }}</p>
                    <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span class="text-xs text-gray-400">({{ selectedProfile.totalRatings || 0 }})</span>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Reward Points</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.user?.points || 0 }} pts</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Activity Streak</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.user?.streakCount || 0 }} 🔥</p>
                </div>
              </div>
            </div>

            <!-- Operations & Verification -->
            <div class="space-y-4 mt-6">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Operations & Status</h4>
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Device Status</p>
                  <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full" :class="selectedProfile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"></div>
                    <p class="font-bold text-gray-900 capitalize">{{ selectedProfile.status || 'Offline' }}</p>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Verification Tier</p>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Tier {{ selectedProfile.verificationLevel || 1 }}</span>
                  </div>
                </div>
                <div v-if="selectedProfile.currentOrder">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Active Order</p>
                  <p class="font-bold text-gray-900 font-mono text-xs">{{ typeof selectedProfile.currentOrder === 'string' ? selectedProfile.currentOrder : selectedProfile.currentOrder._id }}</p>
                </div>
                <div v-if="selectedProfile.batchOrders?.length">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Batched Orders</p>
                  <p class="font-bold text-gray-900">{{ selectedProfile.batchOrders.length }} active</p>
                </div>
                <div class="col-span-2" v-if="selectedProfile.rejectionReason">
                  <div class="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
                    <p class="text-[10px] font-bold uppercase tracking-wider mb-1">Rejection Reason</p>
                    <p class="text-xs">{{ selectedProfile.rejectionReason }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- KYC Documents -->
            <div v-if="selectedProfile.idCardImage || selectedProfile.selfieImage || selectedProfile.ninSlipImage" class="space-y-4 mt-6">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">KYC Documents</h4>
              <div class="grid grid-cols-3 gap-3 px-2">
                <div v-if="selectedProfile.idCardImage" class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer" @click="viewImage(selectedProfile.idCardImage)">
                  <img :src="selectedProfile.idCardImage" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-[10px] text-white font-bold uppercase tracking-wide">ID Card</span>
                  </div>
                </div>
                <div v-if="selectedProfile.selfieImage" class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer" @click="viewImage(selectedProfile.selfieImage)">
                  <img :src="selectedProfile.selfieImage" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-[10px] text-white font-bold uppercase tracking-wide">Selfie</span>
                  </div>
                </div>
                <div v-if="selectedProfile.ninSlipImage" class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer" @click="viewImage(selectedProfile.ninSlipImage)">
                  <img :src="selectedProfile.ninSlipImage" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-[10px] text-white font-bold uppercase tracking-wide">NIN Slip</span>
                  </div>
                </div>
              </div>
            </div>

          </template>

          <!-- Edit Tab -->
          <template v-if="activeDrawerTab === 'edit'">
            <form @submit.prevent="handleUpdateDispatcher" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">School</label>
                  <select v-model="editDispatcherPayload.school" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="UNILAG">UNILAG</option>
                    <option value="CMUL">CMUL</option>
                    <option value="YABATECH">YABATECH</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Matric Number</label>
                  <input v-model="editDispatcherPayload.matricNumber" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">NIN Number</label>
                  <input v-model="editDispatcherPayload.ninNumber" type="text" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Verification Level</label>
                  <select v-model="editDispatcherPayload.verificationLevel" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option :value="1">Tier 1</option>
                    <option :value="2">Tier 2</option>
                    <option :value="3">Tier 3</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Verification Status</label>
                  <select v-model="editDispatcherPayload.verificationStatus" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-gray-700">Status</label>
                  <select v-model="editDispatcherPayload.status" class="w-full p-3 text-base bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>
              </div>
              <button type="submit" :disabled="updatingDispatcher" class="w-full py-3 bg-[#FF5C1A] text-white rounded-xl font-bold hover:bg-[#E04D12] transition-colors disabled:opacity-50">
                {{ updatingDispatcher ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </template>

          <!-- Actions -->
          <div>
            <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Account Actions</h4>
            <div class="space-y-3">
              <button 
                v-if="selectedProfile.isApproved"
                @click="toggleSuspension(selectedProfile._id, 'suspend')" 
                :disabled="processing === selectedProfile._id"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors text-red-700 font-bold group"
              >
                <span>Suspend Dispatcher</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              
              <button 
                v-else
                @click="toggleSuspension(selectedProfile._id, 'activate')" 
                :disabled="processing === selectedProfile._id"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-[#FF5C1A]/20 bg-[#FF5C1A]/10 hover:bg-emerald-100 transition-colors text-[#FF5C1A] font-bold group"
              >
                <span>Reactivate Dispatcher</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              <button 
                @click="deleteDispatcher(selectedProfile._id)" 
                :disabled="processing === selectedProfile._id"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors text-red-700 font-bold group"
              >
                <span>Delete Dispatcher</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center">Suspending a dispatcher prevents them from accepting new deliveries or going online.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Dispatcher</h3>
      <p class="text-sm text-gray-600 mb-6">Are you sure you want to permanently delete this dispatcher? This action cannot be undone.</p>
      <div class="flex gap-3">
        <button @click="showDeleteModal = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">
          Cancel
        </button>
        <button @click="confirmDeleteDispatcher" :disabled="processing !== null" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
          {{ processing !== null ? 'Deleting...' : 'Yes, Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast as useToast } from '@/composables/core/useCustomToast'
import { RefreshCw, X, MoreVertical, Eye, Edit, CheckCircle, XCircle, Trash2, Bike, Users, CheckSquare, Wallet, DollarSign, Package } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dispatchers Management - Admin' })

// Dropdown
const activeDropdownId = ref<string | null>(null)

// Close dropdown when clicking outside
const closeDropdown = () => {
  activeDropdownId.value = null;
};
onMounted(() => {
  document.addEventListener('click', closeDropdown);
  fetchPending();
  fetchAll();
});
import { onUnmounted } from 'vue';
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

// Tabs
const activeTab = ref('verifications') // 'verifications' | 'all'

// Verifications state
const dispatchers = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / 10))

// All dispatchers state
const allDispatchers = ref<any[]>([])
const allLoading = ref(false)
const allPage = ref(1)
const allTotal = ref(0)
const allTotalPages = computed(() => Math.ceil(allTotal.value / 10))

const processing = ref<string | null>(null)
const { showToast } = useToast()
const selectedImage = ref<string | null>(null)

// Modals
const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)
const selectedDispatcher = ref<any>(null)
const rejectionReason = ref('')
const selectedTier = ref(1)

// Drawer
const drawerOpen = ref(false)
const selectedProfile = ref<any>(null)
const activeDrawerTab = ref('overview')
const editDispatcherPayload = ref({ 
  school: 'UNILAG', 
  matricNumber: '', 
  ninNumber: '', 
  verificationLevel: 1,
  verificationStatus: 'pending',
  status: 'offline'
})
const updatingDispatcher = ref(false)

const enterEditMode = () => {
  activeDrawerTab.value = 'edit';
  if (selectedProfile.value) {
    editDispatcherPayload.value = {
      school: selectedProfile.value.school || 'UNILAG',
      matricNumber: selectedProfile.value.matricNumber || '',
      ninNumber: selectedProfile.value.ninNumber || '',
      verificationLevel: selectedProfile.value.verificationLevel || 1,
      verificationStatus: selectedProfile.value.verificationStatus || 'pending',
      status: selectedProfile.value.status || 'offline'
    };
  }
};

const handleUpdateDispatcher = async () => {
  if (!selectedProfile.value) return;
  updatingDispatcher.value = true;
  try {
    const res = await api.put(`/admin/dispatchers/${selectedProfile.value._id}`, editDispatcherPayload.value);
    showToast({ title: 'Success', message: 'Dispatcher updated successfully', toastType: 'success' });
    await fetchAll();
    selectedProfile.value = res.data.errander || res.data;
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to update dispatcher', toastType: 'error' });
  } finally {
    updatingDispatcher.value = false;
  }
};

const fetchPending = async () => {
  loading.value = true
  try {
    const res = await api.get(`/admin/dispatchers/pending?page=${page.value}&limit=10`)
    dispatchers.value = res.data?.dispatchers || []
    total.value = res.data?.total || 0
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch pending dispatchers', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const fetchAll = async () => {
  allLoading.value = true
  try {
    const res = await api.get(`/admin/dispatchers?page=${allPage.value}&limit=10`)
    allDispatchers.value = res.data?.dispatchers || []
    allTotal.value = res.data?.total || 0
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch all dispatchers', toastType: 'error' })
  } finally {
    allLoading.value = false
  }
}

// Watchers
watch(page, fetchPending)
watch(allPage, fetchAll)
watch(activeTab, (newTab) => {
  if (newTab === 'verifications') fetchPending()
  else if (newTab === 'all') fetchAll()
})

const viewImage = (url: string) => {
  selectedImage.value = url
}

const openApproveModal = (errander: any) => {
  selectedDispatcher.value = errander
  if (errander.guarantorDetails?.name) {
    selectedTier.value = 3
  } else if (errander.idCardImage) {
    selectedTier.value = 2
  } else {
    selectedTier.value = (Number(errander.verificationLevel) || 1) + 1
    if (selectedTier.value > 3) selectedTier.value = 3
  }
  approveModalOpen.value = true
}

const openRejectModal = (errander: any) => {
  selectedDispatcher.value = errander
  rejectionReason.value = ''
  rejectModalOpen.value = true
}

const openProfileDrawer = async (errander: any) => {
  processing.value = errander._id
  activeDrawerTab.value = 'overview'
  try {
    const res = await api.get(`/admin/dispatchers/${errander._id}`)
    selectedProfile.value = res.data
    drawerOpen.value = true
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to load profile', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const toggleSuspension = async (id: string, action: 'suspend' | 'activate') => {
  if (!confirm(`Are you sure you want to ${action} this dispatcher?`)) return
  processing.value = id
  try {
    await api.put(`/admin/dispatchers/${id}/${action}`)
    showToast({ title: 'Success', message: `Dispatcher ${action}d successfully`, toastType: 'success' })
    await fetchAll()
    // Refresh drawer data
    const res = await api.get(`/admin/dispatchers/${id}`)
    selectedProfile.value = res.data
  } catch (err) {
    showToast({ title: 'Error', message: `Failed to ${action} dispatcher`, toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const confirmApprove = async () => {
  if (!selectedDispatcher.value) return
  processing.value = selectedDispatcher.value._id
  try {
    await api.put(`/admin/dispatchers/${selectedDispatcher.value._id}/approve`, { level: selectedTier.value })
    showToast({ title: 'Approved', message: 'Dispatcher verified successfully', toastType: 'success' })
    approveModalOpen.value = false
    await fetchPending()
    if (activeTab.value === 'all') await fetchAll()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to approve dispatcher', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const confirmReject = async () => {
  if (!selectedDispatcher.value) return
  processing.value = selectedDispatcher.value._id
  try {
    await api.put(`/admin/dispatchers/${selectedDispatcher.value._id}/reject`, { reason: rejectionReason.value })
    showToast({ title: 'Rejected', message: 'Verification rejected', toastType: 'success' })
    rejectModalOpen.value = false
    await fetchPending()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to reject dispatcher', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const updateTier = async (id: string, tier: number) => {
  if (!confirm(`Are you sure you want to explicitly change this dispatcher to Tier ${tier}?`)) {
    // Re-fetch to revert the select value visually
    openProfileDrawer(selectedProfile.value)
    return;
  }
  processing.value = id
  try {
    await api.put(`/admin/dispatchers/${id}/tier`, { tier: Number(tier) })
    showToast({ title: 'Success', message: `Tier updated successfully`, toastType: 'success' })
    const res = await api.get(`/admin/dispatchers/${id}`)
    selectedProfile.value = res.data
    await fetchAll()
  } catch (err) {
    showToast({ title: 'Error', message: `Failed to update tier`, toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const showDeleteModal = ref(false)
const dispatcherToDelete = ref<string | null>(null)

const deleteDispatcher = (id: string) => {
  dispatcherToDelete.value = id
  showDeleteModal.value = true
}

const selectedDispatchers = ref<string[]>([])

const toggleSelectAll = (e: any) => {
  if (e.target.checked) {
    selectedDispatchers.value = allDispatchers.value.map((d: any) => d._id)
  } else {
    selectedDispatchers.value = []
  }
}

const confirmBatchDelete = async () => {
  if (!confirm(`Are you sure you want to permanently delete ${selectedDispatchers.value.length} dispatcher(s)? This action cannot be undone.`)) return;
  processing.value = 'batch-delete'
  try {
    await api.post(`/admin/dispatchers/batch-delete`, { ids: selectedDispatchers.value })
    showToast({ title: 'Success', message: 'Dispatchers successfully deleted.', toastType: 'success' })
    selectedDispatchers.value = []
    
    await Promise.all([
      fetchPending(),
      fetchAll()
    ])
  } catch (error) {
    console.error('Error batch deleting dispatchers:', error)
    showToast({ title: 'Error', message: 'Failed to batch delete dispatchers', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const confirmDeleteDispatcher = async () => {
  if (!dispatcherToDelete.value) return;
  const id = dispatcherToDelete.value;
  
  processing.value = id
  try {
    await api.delete(`/admin/dispatchers/${id}`)
    showToast({ title: 'Success', message: 'Dispatcher successfully deleted.', toastType: 'success' })
    
    showDeleteModal.value = false
    dispatcherToDelete.value = null
    
    await Promise.all([
      fetchPending(),
      fetchAll()
    ])
    
    if (selectedProfile.value && selectedProfile.value._id === id) {
      drawerOpen.value = false
      selectedProfile.value = null
    }
  } catch (error) {
    console.error('Error deleting dispatcher:', error)
    showToast({ title: 'Error', message: 'Failed to delete dispatcher', toastType: 'error' })
  } finally {
    processing.value = null
  }
}
</script>
