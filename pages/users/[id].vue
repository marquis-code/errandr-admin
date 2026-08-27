<template>
  <div class="space-y-6 max-w-full mx-auto pb-10 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 font-display">User Details</h1>
          <p class="text-sm text-gray-500">View and manage user information</p>
        </div>
      </div>
      <div v-if="user" class="flex gap-3">
        <button 
          v-if="user.isActive" 
          @click="handleSuspend" 
          class="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100 flex items-center gap-2"
        >
          <UserX2 class="w-4 h-4" /> Suspend
        </button>
        <button 
          v-else 
          @click="handleActivate" 
          class="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <UserCheck2 class="w-4 h-4" /> Activate
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5C1A]"></div>
    </div>

    <!-- Content -->
    <div v-else-if="user" class="space-y-6">
      <!-- Profile Header Card -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
        <div class="w-20 h-20 rounded-2xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-2xl font-bold border border-[#FF5C1A]/20 shrink-0">
          {{ user.firstName[0] }}{{ user.lastName[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-xl font-bold text-gray-900">{{ user.firstName }} {{ user.lastName }}</h2>
            <StatusBadge :status="user.isActive ? 'active' : 'suspended'" class="scale-90 origin-left" />
          </div>
          <p class="text-sm text-gray-500 mb-3">{{ user.email }}</p>
          <div class="flex items-center gap-4">
            <span class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20 capitalize">
              Role: {{ user.role }}
            </span>
            <span class="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              Joined {{ new Date(user.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-6 py-3 text-sm font-semibold transition-colors border-b-2 mb-[-1px]"
          :class="activeTab === tab.key ? 'border-[#FF5C1A] text-[#FF5C1A]' : 'border-transparent text-gray-500 hover:text-gray-900'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tabs Content -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[300px]">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Account Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">User ID</p>
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-900 break-all">{{ user._id }}</p>
                <Copy class="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-900" @click="copyToClipboard(user._id)" />
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Email Address</p>
              <p class="text-sm font-medium text-gray-900">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">First Name</p>
              <p class="text-sm font-medium text-gray-900">{{ user.firstName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Last Name</p>
              <p class="text-sm font-medium text-gray-900">{{ user.lastName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Account Status</p>
              <p class="text-sm font-medium text-gray-900">{{ user.isActive ? 'Active' : 'Suspended' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Last Updated</p>
              <p class="text-sm font-medium text-gray-900">{{ new Date(user.updatedAt).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'">
          <div v-if="ordersLoading" class="py-12 flex justify-center">
            <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else-if="userOrders.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Activity class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">No Activity Found</h3>
            <p class="text-sm text-gray-500 max-w-sm">Activity logs and order history will appear here once the user starts interacting with the platform.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-100/60 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500">
                  <th class="py-4 px-6 font-bold">Order ID</th>
                  <th class="py-4 px-4 font-bold">Date</th>
                  <th class="py-4 px-4 font-bold">Amount</th>
                  <th class="py-4 px-4 font-bold">Status</th>
                  <th class="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="order in userOrders" :key="order._id" class="hover:bg-gray-50 transition-colors">
                  <td class="py-4 px-6 font-mono font-medium text-gray-900 text-sm">
                    {{ order.orderNumber || order._id.slice(-8) }}
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-500">
                    {{ new Date(order.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="py-4 px-4 font-bold text-gray-900 text-sm">
                    ₦{{ (order.total || 0).toLocaleString() }}
                  </td>
                  <td class="py-4 px-4">
                    <StatusBadge :status="order.status" class="scale-90 origin-left" />
                  </td>
                  <td class="py-4 px-6 text-right">
                    <NuxtLink :to="`/orders?search=${order.orderNumber || order._id}`" class="text-[#FF5C1A] text-sm font-semibold hover:underline">
                      View
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Finances Tab -->
        <div v-if="activeTab === 'finances'" class="space-y-6">
          <UserFinances :userId="userId" userRole="student" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="py-20 text-center">
      <h2 class="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
      <p class="text-gray-500 mb-6">The user you are looking for does not exist or has been removed.</p>
      <button @click="router.push('/users')" class="px-6 py-2 rounded-xl bg-[#FF5C1A] text-white font-semibold">
        Back to Users
      </button>
    </div>
    
    <ConfirmationModal
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirmText="confirmModal.confirmText"
      @cancel="confirmModal.isOpen = false"
      @confirm="executeAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { admin_api } from '@/api_factory/modules/admin';
import { ArrowLeft, UserX2, UserCheck2, Copy, Calendar, Activity, Wallet } from 'lucide-vue-next';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import UserFinances from '@/components/users/UserFinances.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();

const userId = route.params.id as string;
const user = ref<any>(null);
const loading = ref(true);

const userOrders = ref<any[]>([]);
const ordersLoading = ref(false);

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'activity', label: 'Activity & History' },
  { key: 'finances', label: 'Finances & Payouts' }
];
const activeTab = ref('overview');

const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm',
  actionType: ''
});

const fetchUser = async () => {
  loading.value = true;
  try {
    const res = await admin_api.getUser(userId);
    user.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchUserOrders = async () => {
  ordersLoading.value = true;
  try {
    const res = await admin_api.getRecentOrders(1, 20, { customerId: userId });
    if (res.data?.orders) {
      userOrders.value = res.data.orders;
    }
  } catch (err) {
    console.error('Error fetching user orders:', err);
  } finally {
    ordersLoading.value = false;
  }
};

const handleSuspend = () => {
  confirmModal.value.actionType = 'suspend';
  confirmModal.value.title = 'Suspend User';
  confirmModal.value.message = 'Are you sure you want to suspend this user? They will not be able to log in.';
  confirmModal.value.type = 'danger';
  confirmModal.value.confirmText = 'Suspend';
  confirmModal.value.isOpen = true;
};

const handleActivate = () => {
  confirmModal.value.actionType = 'activate';
  confirmModal.value.title = 'Activate User';
  confirmModal.value.message = 'Are you sure you want to activate this user? They will regain access to the platform.';
  confirmModal.value.type = 'success';
  confirmModal.value.confirmText = 'Activate';
  confirmModal.value.isOpen = true;
};

const executeAction = async () => {
  confirmModal.value.isOpen = false;
  try {
    const { GATEWAY_ENDPOINT_WITH_AUTH: api } = await import('@/api_factory/axios.config');
    if (confirmModal.value.actionType === 'suspend') {
      await api.put(`/admin/users/${userId}/suspend`);
      showToast({ title: "Success", message: "User suspended successfully", toastType: "success" });
    } else {
      await api.put(`/admin/users/${userId}/activate`);
      showToast({ title: "Success", message: "User activated successfully", toastType: "success" });
    }
    await fetchUser();
  } catch (e) {
    console.error(e);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  showToast({ title: "Copied", message: "Copied to clipboard", toastType: "success" });
};

onMounted(() => {
  fetchUser();
  fetchUserOrders();
});
</script>
