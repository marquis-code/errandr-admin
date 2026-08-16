<template>
  <div class="space-y-6">
    <!-- ── Vendor-Level Prepaid Promo Card ── -->
    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <Zap class="w-5 h-5 text-indigo-500" />
            Vendor-Wide Prepaid Promo
          </h3>
          <p class="text-xs text-gray-500 mt-1 max-w-md">Students pick any items from this vendor's menu. The entire order payout goes to the platform instead of the vendor.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="promoForm.enabled" @change="savePromo" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
        </label>
      </div>

      <div v-if="promoForm.enabled" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Label</label>
          <input type="text" v-model="promoForm.label" @blur="savePromo" placeholder="e.g. Waris Combo" class="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400 bg-white" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Budget/Order (₦)</label>
          <input type="number" v-model.number="promoForm.budgetPerOrder" @blur="savePromo" class="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400 bg-white" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Total Slots</label>
          <input type="number" v-model.number="promoForm.maxOrders" @blur="savePromo" class="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400 bg-white" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Used</label>
          <div class="flex items-center gap-2 h-[38px]">
            <span class="text-lg font-bold" :class="promoForm.usedOrders >= promoForm.maxOrders ? 'text-red-500' : 'text-indigo-600'">{{ promoForm.usedOrders }}</span>
            <span class="text-sm text-gray-400">/ {{ promoForm.maxOrders }}</span>
            <button @click="resetUsedOrders" class="ml-auto text-xs text-indigo-500 hover:underline font-medium">Reset</button>
          </div>
        </div>
        <div class="col-span-2 md:col-span-4">
          <label class="text-xs font-semibold text-gray-600 block mb-1">Description (Optional)</label>
          <input type="text" v-model="promoForm.description" @blur="savePromo" placeholder="e.g. Special promo combo for students..." class="w-full border border-indigo-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-400 bg-white" />
        </div>
      </div>
      <div v-if="promoForm.enabled && promoForm.usedOrders >= promoForm.maxOrders" class="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
        ⚠️ All promo slots have been used. Students will now pay normally.
      </div>
    </div>

    
    <!-- ── Menu Packs Section ── -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">Vendor Combo Packs</h3>
    </div>

    <div v-if="packs.length === 0" class="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
      <Utensils class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <h4 class="text-gray-900 font-semibold mb-1">No Packs Found</h4>
      <p class="text-gray-500 text-sm">This vendor has not added any combo packs.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="pack in packs" :key="pack._id" class="bg-indigo-50/30 rounded-2xl border border-indigo-100 overflow-hidden hover:border-indigo-300 transition-colors">
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{{ pack.name }}</h4>
            <span class="font-semibold text-indigo-600">₦{{ pack.bundlePrice || pack.price || 0 }}</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{{ pack.description || 'Combo Bundle' }}</p>
          
          <div class="flex justify-between items-center pt-3 border-t border-indigo-100">
            <div class="text-xs font-medium text-gray-500">
              <span v-if="pack.trackStock" :class="pack.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'">
                Stock: {{ pack.stockQuantity }}
              </span>
              <span v-else>Unlimited Stock</span>
            </div>
            <button @click="openEditModal(pack, true)" class="text-indigo-600 text-xs font-bold hover:underline">
              Edit Settings
            </button>
          </div>
        </div>
      </div>
    </div>
<!-- ── Menu Items Section ── -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-900">Vendor Menu Items</h3>
      <button @click="fetchMenuItems" class="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 text-[#FF5C1A] animate-spin" />
    </div>
    
    <div v-else-if="menuItems.length === 0" class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
      <Utensils class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h4 class="text-gray-900 font-semibold mb-1">No Menu Items Found</h4>
      <p class="text-gray-500 text-sm">This vendor has not added any items yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in menuItems" :key="item._id" class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#FF5C1A]/30 transition-colors">
        <div class="h-32 bg-gray-100 relative">
          <img v-if="item.image || (item.images && item.images.length > 0)" :src="item.image || item.images[0]" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <Image class="w-8 h-8" />
          </div>
          <div class="absolute top-2 right-2 flex flex-col gap-2">
            <span v-if="item.isPrepaidByPlatform" class="px-2 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded shadow-sm">Prepaid Promo</span>
            <span v-if="!item.isAvailable" class="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded shadow-sm">Hidden</span>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-gray-900 line-clamp-1 flex-1 pr-2">{{ item.name }}</h4>
            <span class="font-semibold text-[#FF5C1A]">₦{{ item.pricePerPortion }}</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{{ item.description || 'No description' }}</p>
          
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <div class="text-xs font-medium text-gray-500">
              <span v-if="item.trackStock" :class="item.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'">
                Stock: {{ item.stockQuantity }}
              </span>
              <span v-else>Unlimited Stock</span>
            </div>
            <button @click="openEditModal(item)" class="text-[#FF5C1A] text-xs font-bold hover:underline">
              Edit Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-900">Item Settings</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-5 space-y-5">
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
            <p class="text-sm font-semibold text-gray-900">{{ selectedItem?.name }}</p>
            <p class="text-xs text-gray-500 mt-1">Configure special behaviors like platform prepaid promotions.</p>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-semibold text-gray-700 block">Prepaid by Platform (Promo)</label>
              <p class="text-xs text-gray-500 max-w-[250px]">If true, 100% of vendor payouts for this item goes to the platform.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="editForm.isPrepaidByPlatform" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-semibold text-gray-700 block">Track Stock Limits</label>
              <p class="text-xs text-gray-500">Automatically blur out when sold out.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="editForm.trackStock" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
            </label>
          </div>

          <div v-if="editForm.trackStock">
            <label class="text-sm font-semibold text-gray-700 block mb-1">Stock Quantity</label>
            <input type="number" v-model="editForm.stockQuantity" class="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#FF5C1A] text-sm" />
          </div>
          
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Item Availability</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="editForm.isAvailable" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span class="ml-3 text-sm font-medium text-gray-700">{{ editForm.isAvailable ? 'Visible' : 'Hidden by Vendor' }}</span>
            </label>
          </div>
        </div>
        
        <div class="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button @click="isModalOpen = false" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button @click="saveChanges" :disabled="saving" class="px-6 py-2 text-sm font-semibold bg-[#FF5C1A] text-white rounded-xl hover:bg-[#e65318] transition-colors disabled:opacity-50 flex items-center gap-2">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader2, Image, Utensils, RefreshCw, X, Zap } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const props = defineProps<{
  vendorId: string
}>();

const menuItems = ref<any[]>([]);
const packs = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);

const isModalOpen = ref(false);
const selectedItem = ref<any>(null);
const editForm = ref({
  isPrepaidByPlatform: false,
  trackStock: false,
  stockQuantity: 0,
  isAvailable: true
});

// ── Vendor-Level Promo State ──
const promoForm = ref({
  enabled: false,
  budgetPerOrder: 0,
  maxOrders: 0,
  usedOrders: 0,
  label: '',
  description: ''
});

const fetchVendorPromo = async () => {
  try {
    const res = await api.get(`/vendors/${props.vendorId}`);
    const vendor = res.data;
    if (vendor.prepaidPromo) {
      promoForm.value = {
        enabled: !!vendor.prepaidPromo.enabled,
        budgetPerOrder: vendor.prepaidPromo.budgetPerOrder || 0,
        maxOrders: vendor.prepaidPromo.maxOrders || 0,
        usedOrders: vendor.prepaidPromo.usedOrders || 0,
        label: vendor.prepaidPromo.label || '',
        description: vendor.prepaidPromo.description || ''
      };
    }
  } catch (err) {
    console.error('Failed to fetch vendor promo', err);
  }
};

const savePromo = async () => {
  try {
    await api.patch(`/vendors/admin/update/${props.vendorId}`, {
      prepaidPromo: promoForm.value
    });
  } catch (err) {
    console.error('Failed to save promo', err);
    alert('Failed to save promo settings');
  }
};

const resetUsedOrders = async () => {
  promoForm.value.usedOrders = 0;
  await savePromo();
};

const fetchMenuItems = async () => {
  loading.value = true;
  try {
    const [itemsRes, packsRes] = await Promise.all([
      api.get(`/menu/items/vendor/${props.vendorId}`),
      api.get(`/menu/packs/vendor/${props.vendorId}`)
    ]);
    menuItems.value = itemsRes.data;
    packs.value = packsRes.data;
  } catch (error) {
    console.error('Failed to fetch menu items', error);
  } finally {
    loading.value = false;
  }
};

const isEditingPack = ref(false);
const openEditModal = (item: any, isPack = false) => {
  isEditingPack.value = isPack;
  selectedItem.value = item;
  editForm.value = {
    isPrepaidByPlatform: !!item.isPrepaidByPlatform,
    trackStock: !!item.trackStock,
    stockQuantity: item.stockQuantity || 0,
    isAvailable: !!item.isAvailable
  };
  isModalOpen.value = true;
};

const saveChanges = async () => {
  if (!selectedItem.value) return;
  saving.value = true;
  try {
    const endpoint = isEditingPack.value ? `/menu/packs/admin/update/${selectedItem.value._id}` : `/menu/items/admin/update/${selectedItem.value._id}`;
    await api.patch(endpoint, editForm.value);
    isModalOpen.value = false;
    fetchMenuItems(); // refresh
  } catch (err) {
    console.error('Failed to update', err);
    alert('Failed to update settings');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchVendorPromo();
  fetchMenuItems();
});
</script>
