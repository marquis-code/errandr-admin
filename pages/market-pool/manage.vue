<template>
  <div class="p-6 bg-white min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Market Pool Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage weekly campaigns, aggregation, and refunds.</p>
      </div>
      <button @click="showCreateModal = true" class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors">
        <Plus class="w-4 h-4" /> Create Campaign
      </button>
    </div>

    <!-- Active Campaign Section -->
    <div v-if="campaign" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ campaign.title }}</h2>
          <p class="text-xs text-gray-500">
            {{ new Date(campaign.startDate).toLocaleDateString() }} - {{ new Date(campaign.endDate).toLocaleDateString() }}
          </p>
        </div>
        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
          {{ campaign.status }}
        </span>
      </div>

        <div class="flex overflow-x-auto gap-2 p-2 bg-gray-50 border-b border-gray-100 mb-6 mx-2 rounded-xl mt-4">
          <button @click="activeTab = 'aggregation'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'aggregation' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Aggregation Dashboard</button>
          <button @click="activeTab = 'catalog'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'catalog' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Manage Catalog</button>
          <button @click="activeTab = 'categories'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'categories' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Categories</button>
          <button @click="activeTab = 'requests'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'requests' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Student Requests</button>
          <button @click="activeTab = 'payments'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'payments' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Payment Verifications</button>
          <button @click="activeTab = 'settings'" :class="['px-5 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap', activeTab === 'settings' ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700']">Bank Settings</button>
        </div>

        <!-- Aggregation Tab -->
        <div v-if="activeTab === 'aggregation'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Aggregation Dashboard</h3>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 border-r pr-3 border-gray-200">
                <select v-model="bulkStatus" class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-primary outline-none">
                  <option value="">Update Order Milestones...</option>
                  <option value="paid">Paid (Open)</option>
                  <option value="procuring">Procuring</option>
                  <option value="repackaging">Repackaging</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button @click="updateCampaignStatus" :disabled="!bulkStatus" class="text-sm bg-primary text-white font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">Apply</button>
              </div>
              <button @click="fetchAggregation" class="text-sm text-primary font-medium hover:underline">
                Refresh Aggregation
              </button>
            </div>
          </div>

          <div v-if="loadingAggregation" class="text-sm text-gray-500 py-4">Loading aggregation data...</div>
          
          <div v-else-if="aggregation.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-semibold rounded-tl-lg">Item</th>
                <th class="px-4 py-3 font-semibold">Total Qty (Student)</th>
                <th class="px-4 py-3 font-semibold">Estimated Bulk Buy</th>
                <th class="px-4 py-3 font-semibold text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in aggregation" :key="row._id" class="hover:bg-gray-50/50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ row.item.name }}</p>
                  <p class="text-[10px] text-gray-500">Buffer Price: ₦{{ row.item.appPrice.toLocaleString() }}</p>
                </td>
                <td class="px-4 py-3">
                  <span class="font-bold text-lg text-primary">{{ row.totalQuantity }}</span>
                  <span class="text-xs text-gray-500 ml-1">x {{ row.item.studentQuantity }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  <span class="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                    {{ calculateBulk(row.totalQuantity, row.item.studentQuantity) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button 
                    @click="triggerRefund(row.item._id, row.item.name)"
                    class="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded transition-colors"
                  >
                    Trigger Refund
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
            <ShoppingCart class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="font-bold text-gray-900 text-lg tracking-tight mb-1">No Orders Yet</h4>
          <p class="text-sm text-gray-500 max-w-sm">No students have placed orders in this campaign yet. Check back later once the pool starts filling up.</p>
        </div>
        </div>
        <!-- Catalog Tab -->
        <div v-if="activeTab === 'catalog'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Current Catalog Items</h3>
            <button @click="openAddItemModal" class="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-1">
              <Plus class="w-4 h-4" /> Add Item
            </button>
          </div>
          <div class="flex flex-col gap-3">
            <div v-for="item in catalogItems" :key="item._id" class="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img v-if="item.images?.length > 0 || item.imageUrl" :src="item.imageUrl || item.images?.[0]" class="w-full h-full object-cover" />
                  <ShoppingCart v-else class="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-base">{{ item.name }}</h4>
                  <div class="flex items-center gap-2 mt-0.5 mb-1 text-sm text-gray-500">
                    <span class="bg-gray-100 px-2 py-0.5 rounded font-medium">{{ item.studentQuantity }}</span>
                    <span>&bull;</span>
                    <span>Target: {{ item.targetQuantity || 0 }}</span>
                  </div>
                  <p class="text-xs text-gray-400">Buffer Price: <span class="font-bold text-primary text-sm">₦{{ item.appPrice.toLocaleString() }}</span></p>
                </div>
              </div>
              <button @click="editItem(item)" class="text-sm bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700 px-5 py-2 font-semibold rounded-xl transition-colors">Edit</button>
            </div>
          </div>
        </div>

        <!-- Categories Tab -->
        <div v-if="activeTab === 'categories'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Manage Categories</h3>
            <div class="flex gap-2">
              <input v-model="newCategoryName" type="text" placeholder="New Category Name" class="bg-gray-50 border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:ring-primary outline-none">
              <button @click="createNewCategory" :disabled="!newCategoryName || creatingCategory" class="text-sm bg-primary text-white font-medium px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {{ creatingCategory ? '...' : 'Add' }}
              </button>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="cat in categories" :key="cat._id" class="border border-gray-200 rounded-xl p-4 flex justify-between items-center group">
              <span class="font-medium text-gray-800">{{ cat.name }}</span>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="promptEditCategory(cat)" class="text-blue-500 hover:bg-blue-50 p-1.5 rounded-md"><Edit class="w-4 h-4" /></button>
                <button @click="deleteCategory(cat._id)" class="text-red-500 hover:bg-red-50 p-1.5 rounded-md"><Trash2 class="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Requests Tab -->
        <div v-if="activeTab === 'requests'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Custom Item Requests</h3>
            <button @click="fetchCustomRequests" class="text-sm text-primary font-medium hover:underline">
              Refresh
            </button>
          </div>
          <div v-if="customRequests.length > 0" class="space-y-3">
            <div v-for="req in customRequests" :key="req._id" class="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h4 class="font-bold text-gray-900">{{ req.itemName }}</h4>
                <p class="text-sm text-gray-600 mb-1">{{ req.description }}</p>
                <div class="flex gap-3 text-xs text-gray-500">
                  <span class="font-medium bg-gray-100 px-2 py-0.5 rounded">Qty: {{ req.desiredQuantity }}</span>
                  <span>Requested by: {{ req.userId?.name }} ({{ req.userId?.phone }})</span>
                </div>
              </div>
              <button @click="approveRequestToCatalog(req)" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100">
                Add to Catalog
              </button>
            </div>
          </div>
          <div v-else class="py-12 text-center text-gray-500">
            No custom requests from students.
          </div>
        </div>

        <!-- Payments Tab -->
        <div v-if="activeTab === 'payments'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Pending Payments</h3>
            <button @click="fetchCampaignOrders" class="text-sm text-primary font-medium hover:underline">
              Refresh
            </button>
          </div>
          <div v-if="pendingPayments.length > 0" class="space-y-3">
            <div v-for="order in pendingPayments" :key="order._id" class="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-yellow-50/30">
              <div>
                <h4 class="font-bold text-gray-900">Order #{{ order._id.slice(-6).toUpperCase() }}</h4>
                <p class="text-sm text-gray-600 mb-1">{{ order.userId?.firstName }} {{ order.userId?.lastName }} ({{ order.userId?.email }})</p>
                <div class="flex gap-3 text-xs text-gray-500">
                  <span class="font-medium bg-gray-100 px-2 py-0.5 rounded">Total: ₦{{ (order.totalItemCost + order.deliveryFee).toLocaleString() }}</span>
                  <span class="font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Verifying Proof</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="viewReceipt(order.paymentProofUrl)" class="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  View Receipt
                </button>
                <button @click="verifyPayment(order._id, 'approve')" class="text-sm bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Approve
                </button>
                <button @click="verifyPayment(order._id, 'reject')" class="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
          <div v-else class="py-12 text-center text-gray-500">
            No pending payments to verify.
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="p-6 pt-0">
          <div class="max-w-2xl">
            <h3 class="font-bold text-gray-800 mb-4">Bank Account Details</h3>
            <p class="text-sm text-gray-500 mb-6">These details will be displayed to students during checkout so they can transfer the payment.</p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name</label>
                <input v-model="bankSettings.bankName" type="text" placeholder="e.g. Access Bank" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                <input v-model="bankSettings.accountNumber" type="text" placeholder="e.g. 0123456789" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Account Name</label>
                <input v-model="bankSettings.accountName" type="text" placeholder="e.g. Erranders Market Pool" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
              </div>
              <div class="pt-2">
                <button @click="saveBankSettings" :disabled="savingSettings" class="bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {{ savingSettings ? 'Saving...' : 'Save Settings' }}
                </button>
              </div>
            </div>
          </div>

          <hr class="my-8 border-gray-100" />

          <div class="max-w-2xl">
            <h3 class="font-bold text-gray-800 mb-4">General Configuration</h3>
            <p class="text-sm text-gray-500 mb-6">Configure delivery slots and pricing rules for the market pool.</p>
            
            <div class="space-y-6">
              <!-- Delivery Fee Configuration -->
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="font-bold text-sm text-gray-800 mb-3">Delivery Pricing</h4>
                <div class="flex items-center gap-4 mb-4">
                  <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" v-model="marketPoolConfig.feeType" value="flat" class="text-primary focus:ring-primary">
                    Flat Fee (₦)
                  </label>
                  <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" v-model="marketPoolConfig.feeType" value="percentage" class="text-primary focus:ring-primary">
                    Percentage of Cart Total (%)
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                    {{ marketPoolConfig.feeType === 'percentage' ? 'Percentage Value (%)' : 'Flat Amount (₦)' }}
                  </label>
                  <input v-model.number="marketPoolConfig.feeValue" type="number" class="w-full max-w-xs bg-white border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
                </div>
              </div>

              <!-- Delivery Slots Configuration -->
              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 class="font-bold text-sm text-gray-800 mb-3">Delivery Time Slots</h4>
                <div class="space-y-2 mb-3">
                  <div v-for="(slot, index) in marketPoolConfig.slots" :key="index" class="flex gap-2 items-center">
                    <input v-model="marketPoolConfig.slots[index]" type="text" placeholder="e.g. Morning (8am - 12pm)" class="flex-1 bg-white border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
                    <button @click="marketPoolConfig.slots.splice(index, 1)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <button @click="marketPoolConfig.slots.push('')" class="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  Add Time Slot
                </button>
              </div>

              <div class="pt-2">
                <button @click="saveMarketPoolConfig" :disabled="savingConfig" class="bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {{ savingConfig ? 'Saving...' : 'Save General Config' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    

    <div v-else-if="!loading" class="py-24 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <CalendarX class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 tracking-tight">No Active Campaign</h3>
      <p class="text-gray-500 mt-2 max-w-md">There is currently no active market pool campaign running. Create a new campaign to open the pool for students.</p>
      <button @click="showCreateModal = true" class="mt-6 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-colors">
        <Plus class="w-4 h-4" /> Create Campaign
      </button>
    </div>

    <!-- Create Campaign Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Create New Campaign</h3>
            <p class="text-xs text-gray-500 mt-1">Set up a new market pool run</p>
          </div>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Title</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LayoutList class="h-4 w-4 text-gray-400" />
              </div>
              <input v-model="newCampaign.title" type="text" placeholder="e.g. Week 1 Market Run" class="w-full pl-10 bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
              <div class="relative">
                <input v-model="newCampaign.startDate" type="datetime-local" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <div class="relative">
                <input v-model="newCampaign.endDate" type="datetime-local" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
              </div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
            <div class="flex items-center h-5 mt-0.5">
              <input type="checkbox" id="autoPopulate" v-model="autoPopulate" class="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300">
            </div>
            <div class="flex flex-col">
              <label for="autoPopulate" class="text-sm font-bold text-gray-700 cursor-pointer">Auto-populate Standard Catalog</label>
              <p class="text-xs text-gray-500 mt-0.5">Automatically adds staples (Rice, Beans, Garri, Eggs, Indomie) to the pool</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showCreateModal = false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            @click="createCampaign" 
            :disabled="loading"
            class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            Start Campaign
          </button>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ newItem._id ? 'Edit' : 'Add' }} Catalog Item</h3>
            <p class="text-xs text-gray-500 mt-1">Upload an image and define measurement units.</p>
          </div>
          <button @click="showAddItemModal = false" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Images</label>
            <input type="file" multiple @change="handleImageUpload" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer">
            <div v-if="uploadingImage" class="text-xs text-gray-500 mt-2">Uploading images...</div>
            <div class="flex gap-2 mt-3 overflow-x-auto pb-2">
              <div v-for="(img, idx) in [...(newItem.images || []), ...(localImagePreviews || [])]" :key="idx" class="relative group flex-shrink-0">
                <img :src="(typeof img === 'string' && img !== '[object Object]') ? img : (img?.url || '')" class="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                <button @click="removeImage(idx, img)" class="absolute top-1 right-1 bg-white/90 rounded-full p-1 hover:bg-white text-red-500 shadow-sm border border-gray-100">
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Name</label>
            <input v-model="newItem.name" type="text" placeholder="e.g. Sweet Potatoes" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea v-model="newItem.description" placeholder="e.g. Fresh from the farm" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none resize-none"></textarea>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-semibold text-gray-700">Category</label>
              <button @click="showCategoryInput = !showCategoryInput" class="text-xs text-primary font-medium hover:underline">{{ showCategoryInput ? 'Cancel' : '+ New Category' }}</button>
            </div>
            
            <div v-if="showCategoryInput" class="flex gap-2">
              <input v-model="newCategoryName" type="text" placeholder="e.g. Spices & Oils" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
              <button @click="createNewCategory" :disabled="!newCategoryName || creatingCategory" class="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm disabled:opacity-50">
                {{ creatingCategory ? '...' : 'Save' }}
              </button>
            </div>
            <select v-else v-model="newItem.category" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
              <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Measurement / Qty</label>
              <input v-model="newItem.studentQuantity" type="text" placeholder="e.g. 1 Paint Bucket" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">App Price (₦)</label>
              <input v-model="newItem.appPrice" type="number" placeholder="e.g. 4500" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Target Qty</label>
              <input v-model="newItem.targetQuantity" type="number" placeholder="e.g. 50" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Source Location</label>
              <input v-model="newItem.sourceLocation" type="text" placeholder="e.g. Mile 12" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Weight Est.</label>
              <input v-model="newItem.weightEstimate" type="text" placeholder="e.g. ~4.5kg" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showAddItemModal = false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button @click="submitNewItem" :disabled="loading || uploadingImage" class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
            {{ newItem._id ? 'Update Item' : 'Add Item' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="showReceiptModal = false">
      <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Payment Proof</h2>
          <button @click="showReceiptModal = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div class="p-6 bg-gray-50 flex items-center justify-center min-h-[400px]">
          <img v-if="selectedReceiptUrl" :src="selectedReceiptUrl" alt="Payment Proof" class="max-w-full max-h-[70vh] rounded-lg shadow-sm border border-gray-200 object-contain" />
          <div v-else class="text-gray-500 text-sm">No receipt image available</div>
        </div>
        <div class="p-4 border-t border-gray-100 flex justify-end">
          <button @click="showReceiptModal = false" class="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Plus, X, CalendarX, ShoppingCart, LayoutList, UploadCloud, Edit, Trash2 } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'admin'
})

const { showToast } = useCustomToast()

const activeTab = ref('aggregation')
const loading = ref(true)
const campaign = ref(null)
const loadingAggregation = ref(false)
const aggregation = ref([])
const catalogItems = ref([])
const customRequests = ref([])
const pendingPayments = ref([])
const bankSettings = ref({ bankName: '', accountNumber: '', accountName: '' })
const savingSettings = ref(false)

const showCreateModal = ref(false)
const showAddItemModal = ref(false)
const showReceiptModal = ref(false)
const selectedReceiptUrl = ref('')
const newCampaign = ref({ title: '', startDate: '', endDate: '' })
const autoPopulate = ref(true)

const bulkStatus = ref('')
const categories = ref([])
const showCategoryInput = ref(false)
const newCategoryName = ref('')
const creatingCategory = ref(false)
const newItem = ref({ _id: null, name: '', description: '', category: 'Foodstuffs', studentQuantity: '', wholesaleEstimatedCost: 0, appPrice: '', imageUrl: '', images: [], targetQuantity: 0, sourceLocation: '', weightEstimate: '' })
const uploadingImage = ref(false)
const localImagePreviews = ref([])

const formatDateForInput = (date) => {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const getNextDayOfWeek = (dayOfWeek, hour) => {
  const date = new Date()
  const currentDay = date.getDay()
  const daysUntil = (dayOfWeek + 7 - currentDay) % 7 || 7
  date.setDate(date.getDate() + daysUntil)
  date.setHours(hour, 0, 0, 0)
  return date
}

watch(showCreateModal, (val) => {
  if (val) {
    const nextMonday = getNextDayOfWeek(1, 8)
    const nextWednesday = getNextDayOfWeek(3, 20)
    const weekOfStr = nextMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    newCampaign.value.title = `Campus Market Pool - Week of ${weekOfStr}`
    newCampaign.value.startDate = formatDateForInput(nextMonday)
    newCampaign.value.endDate = formatDateForInput(nextWednesday)
    autoPopulate.value = true
  }
})

onMounted(async () => {
  await Promise.all([
    fetchActiveCampaign(),
    fetchCategories(),
    fetchBankSettings(),
    fetchMarketPoolConfig()
  ])
})

const fetchCategories = async () => {
  try {
    const res = await api.get('/market-pool/categories')
    categories.value = res.data
  } catch (e) {
    console.error('Failed to load categories', e)
  }
}

const createNewCategory = async () => {
  try {
    creatingCategory.value = true
    await api.post('/market-pool/categories', { name: newCategoryName.value })
    showToast({ title: 'Success', message: 'Category added', toastType: 'success' })
    await fetchCategories()
    newItem.value.category = newCategoryName.value
    newCategoryName.value = ''
    showCategoryInput.value = false
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to create category', toastType: 'error' })
  } finally {
    creatingCategory.value = false
  }
}

const promptEditCategory = async (cat) => {
  const newName = prompt('Enter new category name:', cat.name)
  if (newName && newName !== cat.name) {
    try {
      await api.put(`/market-pool/categories/${cat._id}`, { name: newName })
      showToast({ title: 'Success', message: 'Category updated', toastType: 'success' })
      await fetchCategories()
    } catch (e) {
      console.error(e)
      showToast({ title: 'Error', message: 'Failed to update category', toastType: 'error' })
    }
  }
}

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await api.delete(`/market-pool/categories/${id}`)
      showToast({ title: 'Success', message: 'Category deleted', toastType: 'success' })
      await fetchCategories()
    } catch (e) {
      console.error(e)
      showToast({ title: 'Error', message: 'Failed to delete category', toastType: 'error' })
    }
  }
}

const fetchActiveCampaign = async () => {
  try {
    loading.value = true
    const res = await api.get('/market-pool/active')
    if (res.data?.campaign) {
      campaign.value = res.data.campaign
      catalogItems.value = res.data.items || []
      await Promise.all([fetchAggregation(), fetchCustomRequests(), fetchCampaignOrders(), fetchBankSettings()])
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchCampaignOrders = async () => {
  if (!campaign.value) return
  try {
    const res = await api.get(`/market-pool/campaigns/${campaign.value._id}/orders`)
    // Filter for payments that need verification
    pendingPayments.value = res.data.filter(o => o.status === 'payment_verifying')
  } catch (e) {
    console.error(e)
  }
}

const verifyPayment = async (orderId, action) => {
  const isApproving = action === 'approve'
  const confirmed = confirm(`Are you sure you want to ${isApproving ? 'APPROVE' : 'REJECT'} this payment?`)
  if (!confirmed) return

  try {
    await api.put(`/market-pool/orders/${orderId}/verify-payment`, { action })
    showToast({ title: 'Success', message: `Payment ${action}d successfully.`, toastType: 'success' })
    await fetchCampaignOrders()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to verify payment', toastType: 'error' })
  }
}

const viewReceipt = (url) => {
  selectedReceiptUrl.value = url
  showReceiptModal.value = true
}

const triggerRefund = async (itemId, itemName) => {
  // Logic to trigger refund
}

const fetchBankSettings = async () => {
  try {
    const res = await api.get('/settings/market-pool/bank')
    if (res.data) {
      bankSettings.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

const saveBankSettings = async () => {
  try {
    savingSettings.value = true
    await api.put('/settings/market-pool/bank', bankSettings.value)
    showToast({ title: 'Success', message: 'Bank settings updated', toastType: 'success' })
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to update settings', toastType: 'error' })
  } finally {
    savingSettings.value = false
  }
}

const marketPoolConfig = ref({ slots: ['Morning (8am - 12pm)', 'Afternoon (1pm - 5pm)'], feeType: 'flat', feeValue: 500 })
const savingConfig = ref(false)

const fetchMarketPoolConfig = async () => {
  try {
    const res = await api.get('/settings/market-pool/config')
    if (res.data) {
      marketPoolConfig.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

const saveMarketPoolConfig = async () => {
  try {
    savingConfig.value = true
    await api.put('/settings/market-pool/config', marketPoolConfig.value)
    showToast({ title: 'Success', message: 'Config updated successfully', toastType: 'success' })
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to update config', toastType: 'error' })
  } finally {
    savingConfig.value = false
  }
}

const createCampaign = async () => {
  if (!newCampaign.value.title || !newCampaign.value.startDate || !newCampaign.value.endDate) {
    return showToast({ title: 'Error', message: 'Please fill in all fields', toastType: 'error' })
  }
  try {
    loading.value = true
    const res = await api.post('/market-pool/campaigns', {
      title: newCampaign.value.title,
      startDate: new Date(newCampaign.value.startDate),
      endDate: new Date(newCampaign.value.endDate)
    })
    
    const createdCampaign = res.data
    
    if (autoPopulate.value && createdCampaign && createdCampaign._id) {
      const standardCatalog = [
        { name: 'Rice', description: 'Long grain parboiled rice', category: 'Foodstuffs', studentQuantity: '1 Derica', wholesaleEstimatedCost: 1000, appPrice: 1200 },
        { name: 'Beans', description: 'Oloyin beans', category: 'Foodstuffs', studentQuantity: '1 Derica', wholesaleEstimatedCost: 1300, appPrice: 1500 },
        { name: 'Garri', description: 'White/Yellow Garri', category: 'Foodstuffs', studentQuantity: '1 Derica', wholesaleEstimatedCost: 700, appPrice: 800 },
        { name: 'Eggs', description: 'Large farm eggs', category: 'Proteins', studentQuantity: 'Half Crate', wholesaleEstimatedCost: 2200, appPrice: 2500 },
        { name: 'Indomie Noodles', description: 'Onion chicken flavor', category: 'Provisions', studentQuantity: '1 Carton', wholesaleEstimatedCost: 7800, appPrice: 8500 }
      ]
      
      await Promise.all(standardCatalog.map(item => 
        api.post(`/market-pool/campaigns/${createdCampaign._id}/items`, item).catch(e => console.error('Failed to add item', e))
      ))
    }
    
    showCreateModal.value = false
    showToast({ title: 'Success', message: 'Campaign created successfully!', toastType: 'success' })
    await fetchActiveCampaign()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to create campaign', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const fetchAggregation = async () => {
  if (!campaign.value) return
  try {
    loadingAggregation.value = true
    const res = await api.get(`/market-pool/campaigns/${campaign.value._id}/aggregation`)
    aggregation.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingAggregation.value = false
  }
}

const fetchCustomRequests = async () => {
  if (!campaign.value) return
  try {
    const res = await api.get(`/market-pool/campaigns/${campaign.value._id}/custom-requests`)
    customRequests.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return
  
  files.forEach(file => {
    localImagePreviews.value.push(URL.createObjectURL(file))
  })
  
  try {
    uploadingImage.value = true
    
    const uploadPromises = files.map(file => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => res.data.url || res.data.secure_url)
    })
    
    const uploadedUrls = await Promise.all(uploadPromises)
    newItem.value.images = [...(newItem.value.images || []), ...uploadedUrls]
    if (newItem.value.images.length > 0) {
      newItem.value.imageUrl = newItem.value.images[0]
    }
    
    showToast({ title: 'Success', message: 'Images uploaded successfully!', toastType: 'success' })
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to upload images', toastType: 'error' })
  } finally {
    uploadingImage.value = false
    localImagePreviews.value = []
    event.target.value = ''
  }
}

const removeImage = (index, imgUrl) => {
  if (typeof imgUrl === 'string' && imgUrl.startsWith('blob:')) {
    const localIndex = localImagePreviews.value.indexOf(imgUrl)
    if (localIndex !== -1) localImagePreviews.value.splice(localIndex, 1)
  } else {
    newItem.value.images.splice(index, 1)
    if (newItem.value.images.length > 0) {
      newItem.value.imageUrl = newItem.value.images[0]
    } else {
      newItem.value.imageUrl = ''
    }
  }
}

const submitNewItem = async () => {
  if (!newItem.value.name || !newItem.value.studentQuantity || !newItem.value.appPrice) {
    return showToast({ title: 'Error', message: 'Please fill in name, measurement, and price.', toastType: 'error' })
  }
  try {
    loading.value = true
    const payload = {
      name: newItem.value.name,
      description: newItem.value.description,
      category: newItem.value.category || 'Foodstuffs',
      studentQuantity: newItem.value.studentQuantity,
      appPrice: Number(newItem.value.appPrice),
      wholesaleEstimatedCost: Number(newItem.value.appPrice) * 0.8, // Rough estimate 
      imageUrl: newItem.value.imageUrl,
      images: newItem.value.images || [],
      targetQuantity: Number(newItem.value.targetQuantity),
      sourceLocation: newItem.value.sourceLocation,
      weightEstimate: newItem.value.weightEstimate,
    }

    if (newItem.value._id) {
      await api.put(`/market-pool/items/${newItem.value._id}`, payload)
      showToast({ title: 'Success', message: 'Item updated successfully', toastType: 'success' })
    } else {
      await api.post(`/market-pool/campaigns/${campaign.value._id}/items`, payload)
      showToast({ title: 'Success', message: 'Item added successfully', toastType: 'success' })
    }

    showAddItemModal.value = false
    newItem.value = { _id: null, name: '', description: '', category: 'Foodstuffs', studentQuantity: '', wholesaleEstimatedCost: 0, appPrice: '', imageUrl: '', images: [], targetQuantity: 0, sourceLocation: '', weightEstimate: '' }
    localImagePreviews.value = []
    await fetchActiveCampaign()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to save item', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const openAddItemModal = () => {
  localImagePreviews.value = []
  newItem.value = { _id: null, name: '', description: '', category: categories.value[0]?.name || 'Foodstuffs', studentQuantity: '', wholesaleEstimatedCost: 0, appPrice: '', imageUrl: '', images: [], targetQuantity: 0, sourceLocation: '', weightEstimate: '' }
  showAddItemModal.value = true
}

const editItem = (item) => {
  localImagePreviews.value = []
  newItem.value = { ...item, images: item.images || (item.imageUrl ? [item.imageUrl] : []) }
  showAddItemModal.value = true
}

const updateCampaignStatus = async () => {
  if (!bulkStatus.value || !campaign.value) return
  try {
    loading.value = true
    await api.put(`/market-pool/campaigns/${campaign.value._id}/status`, { status: bulkStatus.value })
    showToast({ title: 'Success', message: 'Order milestones updated successfully', toastType: 'success' })
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to update order milestones', toastType: 'error' })
  } finally {
    loading.value = false
    bulkStatus.value = ''
  }
}

const approveRequestToCatalog = (req) => {
  newItem.value.name = req.itemName
  newItem.value.description = req.description
  newItem.value.studentQuantity = req.desiredQuantity
  activeTab.value = 'catalog'
  showAddItemModal.value = true
}



const calculateBulk = (qty, type) => {
  // Simple heuristic for the admin view
  if (type.toLowerCase().includes('derica')) {
    const bags = Math.floor(qty / 64)
    const remainder = qty % 64
    if (bags > 0) return `${bags} Bag(s) + ${remainder} Derica(s)`
  }
  if (type.toLowerCase().includes('crate')) {
     const fullCrates = Math.floor(qty / 2) // assuming type is 1/2 crate
     return `${fullCrates} Full Crate(s)`
  }
  return 'Check manually'
}
</script>
