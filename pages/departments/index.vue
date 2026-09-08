<template>
  <div>
    <div class="space-y-6 animate-fade-in max-w-full mx-auto pb-10">
      <!-- Header & Filters -->
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-1">
            <h1 class="text-3xl font-bold text-gray-900 font-display">Departments & Roles</h1>
            <p class="text-sm font-medium text-gray-500">Manage departments and configure granular access permissions for your team.</p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="openCreateModal"
              class="px-5 py-2.5 bg-[#FF5C1A] text-white rounded-xl font-bold text-sm hover:bg-[#FF7A45] transition-colors shadow-lg shadow-[#FF5C1A]/20 flex items-center gap-2"
            >
              <Plus class="w-4 h-4" />
              New Department
            </button>
          </div>
        </div>
      </div>

      <!-- Departments List -->
      <div class="bg-white rounded-[1.25rem] border border-gray-100/60 shadow-sm hover:shadow-md transition-all overflow-visible relative">
        <div class="px-6 py-5 border-b border-gray-100/60 bg-gray-50/50 flex justify-between items-center">
          <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Configured Departments</h3>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">
          <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading Departments...
        </div>

        <div v-else-if="departments.length === 0" class="py-20 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 shadow-sm border border-gray-100">
            <Users class="w-8 h-8" />
          </div>
          <h4 class="font-bold text-gray-900 tracking-tight">No departments configured</h4>
          <p class="text-sm text-gray-500 mt-1">Create a department to start assigning roles and permissions.</p>
        </div>

        <div v-else class="max-md:overflow-x-auto md:overflow-visible pb-24 md:pb-0">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">Department Name</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">Description</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">Modules Access</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">Permissions</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/60">
              <tr v-for="dept in departments" :key="dept._id" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-bold text-gray-900">{{ dept.name }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-500">{{ dept.description || 'No description' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ dept.modules?.length || 0 }} modules
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {{ dept.permissions?.length || 0 }} actions
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editDepartment(dept)" class="p-2 text-gray-400 hover:text-blue-500 bg-white hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all" title="Edit Department">
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button @click="deleteDepartment(dept._id)" class="p-2 text-gray-400 hover:text-rose-500 bg-white hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all" title="Delete Department">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Department Form Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4" @click.self="showModal = false">
        <div class="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-gray-100">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10 shrink-0">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 font-display tracking-tight">{{ isEditing ? 'Edit Department' : 'Create Department' }}</h2>
              <p class="text-sm font-medium text-gray-500 mt-1">Configure department access and permissions.</p>
            </div>
            <button @click="showModal = false" class="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors border border-gray-200/60">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
            <div class="grid grid-cols-1 gap-6">
              <!-- Basic Info -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info class="w-4 h-4 text-blue-500" /> General Information
                </h3>
                
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Department Name</label>
                  <input v-model="formData.name" type="text" placeholder="e.g., Finance, Customer Support" class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#FF5C1A]/10 focus:border-[#FF5C1A]/50 transition-all" />
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                  <textarea v-model="formData.description" rows="2" placeholder="Briefly describe the role of this department" class="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#FF5C1A]/10 focus:border-[#FF5C1A]/50 transition-all"></textarea>
                </div>
              </div>

              <!-- Module Access -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layout class="w-4 h-4 text-emerald-500" /> Module Access (Sidebar)
                </h3>
                <p class="text-sm text-gray-500 mb-6">Select which sidebar sections this department can access.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label v-for="module in availableModules" :key="module.path" class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all" :class="formData.modules.includes(module.path) ? 'border-[#FF5C1A] bg-orange-50/30 ring-1 ring-[#FF5C1A]/20' : 'border-gray-200 hover:border-gray-300 bg-white'">
                    <div class="relative flex items-center">
                      <input type="checkbox" :value="module.path" v-model="formData.modules" class="w-5 h-5 border-2 border-gray-300 rounded text-[#FF5C1A] focus:ring-[#FF5C1A] focus:ring-offset-0 transition-all cursor-pointer" />
                    </div>
                    <div class="flex items-center gap-2">
                      <component :is="module.icon" class="w-4 h-4 text-gray-500" :class="{ 'text-[#FF5C1A]': formData.modules.includes(module.path) }" />
                      <span class="text-sm font-semibold" :class="formData.modules.includes(module.path) ? 'text-gray-900' : 'text-gray-600'">{{ module.label }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Granular Permissions -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-purple-500" /> Granular Permissions
                </h3>
                <p class="text-sm text-gray-500 mb-6">Assign specific actions that users in this department can perform.</p>
                
                <div class="space-y-6">
                  <div v-for="(group, groupName) in groupedPermissions" :key="groupName" class="space-y-3">
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ groupName }}</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label v-for="perm in group" :key="perm.id" class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all" :class="formData.permissions.includes(perm.id) ? 'border-purple-500 bg-purple-50/30 ring-1 ring-purple-500/20' : 'border-gray-100 hover:border-gray-200 bg-white'">
                        <input type="checkbox" :value="perm.id" v-model="formData.permissions" class="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0 transition-all cursor-pointer" />
                        <div>
                          <span class="block text-sm font-bold" :class="formData.permissions.includes(perm.id) ? 'text-gray-900' : 'text-gray-700'">{{ perm.label }}</span>
                          <span class="block text-[11px] text-gray-500 mt-0.5 leading-snug">{{ perm.description }}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0 relative z-10">
            <button @click="showModal = false" class="px-6 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button @click="saveDepartment" :disabled="saving" class="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#FF5C1A] hover:bg-[#FF7A45] shadow-lg shadow-[#FF5C1A]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <Save v-else class="w-4 h-4" />
              {{ saving ? 'Saving...' : 'Save Department' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Users, Layout, ShieldCheck, Info, Edit2, Trash2, X, Save } from 'lucide-vue-next'
import { admin_api } from '@/api_factory/modules/admin'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { LayoutDashboard, Store, Package, ShoppingCart, Gift, Wallet, Banknote, Tag, MessageSquare, Bell, FileText, Settings } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin'
})

const { showToast } = useCustomToast()
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const departments = ref<any[]>([])

const availableModules = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/dispatchers', label: 'Dispatchers', icon: ShieldCheck },
  { path: '/vendors', label: 'Vendors', icon: Store },
  { path: '/orders', label: 'Orders', icon: Package },
  { path: '/market-pool/manage', label: 'Market Pool', icon: ShoppingCart },
  { path: '/referrals', label: 'Referrals', icon: Gift },
  { path: '/finances', label: 'Finances', icon: Wallet },
  { path: '/ledger', label: 'Payouts & Ledger', icon: Banknote },
  { path: '/promos', label: 'Promo Codes', icon: Tag },
  { path: '/chats', label: 'Support Chats', icon: MessageSquare },
  { path: '/campaigns', label: 'Push Campaigns', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/departments', label: 'Departments & Roles', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings }
]

const groupedPermissions = {
  'User Management': [
    { id: 'can_create_admin', label: 'Create Admins', description: 'Can create new admin users' },
    { id: 'can_suspend_user', label: 'Suspend Users', description: 'Can suspend or block users' },
    { id: 'can_view_user_pii', label: 'View PII', description: 'Can view Personally Identifiable Information' }
  ],
  'Financial Operations': [
    { id: 'can_refund_wallet', label: 'Refund Wallet', description: 'Can issue refunds to user wallets' },
    { id: 'can_approve_payout', label: 'Approve Payouts', description: 'Can approve vendor or dispatcher payouts' },
    { id: 'can_view_finances', label: 'View Finances', description: 'Can view financial reports and ledger' }
  ],
  'Market Pool': [
    { id: 'can_refund_market_pool', label: 'Refund Market Pool', description: 'Can refund market pool items' },
    { id: 'can_manage_campaigns', label: 'Manage Campaigns', description: 'Can create, edit, or close market pool campaigns' }
  ],
  'System Settings': [
    { id: 'can_edit_settings', label: 'Edit Global Settings', description: 'Can modify delivery fees, pricing rules, etc.' },
    { id: 'can_manage_promos', label: 'Manage Promo Codes', description: 'Can create and disable promo codes' }
  ]
}

const formData = ref({
  _id: '',
  name: '',
  description: '',
  modules: [] as string[],
  permissions: [] as string[]
})

const fetchDepartments = async () => {
  loading.value = true
  try {
    const res = await admin_api.getDepartments()
    departments.value = res.data
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to fetch departments', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  formData.value = { _id: '', name: '', description: '', modules: [], permissions: [] }
  showModal.value = true
}

const editDepartment = (dept: any) => {
  isEditing.value = true
  formData.value = {
    _id: dept._id,
    name: dept.name,
    description: dept.description || '',
    modules: [...(dept.modules || [])],
    permissions: [...(dept.permissions || [])]
  }
  showModal.value = true
}

const saveDepartment = async () => {
  if (!formData.value.name) {
    showToast({ title: 'Validation Error', message: 'Department name is required', toastType: 'error' })
    return
  }
  
  saving.value = true
  try {
    if (isEditing.value) {
      await admin_api.updateDepartment(formData.value._id, formData.value)
      showToast({ title: 'Success', message: 'Department updated successfully', toastType: 'success' })
    } else {
      await admin_api.createDepartment(formData.value)
      showToast({ title: 'Success', message: 'Department created successfully', toastType: 'success' })
    }
    showModal.value = false
    await fetchDepartments()
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to save department', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const deleteDepartment = async (id: string) => {
  if (!confirm('Are you sure you want to delete this department? Users assigned to this department might lose access.')) return
  try {
    await admin_api.deleteDepartment(id)
    showToast({ title: 'Success', message: 'Department deleted', toastType: 'success' })
    await fetchDepartments()
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to delete department', toastType: 'error' })
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E2E8F0;
  border-radius: 20px;
}
</style>
