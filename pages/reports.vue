<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight font-display">System Reports</h1>
        <p class="text-gray-500 mt-1 font-medium">Monitor platform health and resolve merchant/customer disputes.</p>
      </div>
      <div class="flex items-center gap-2 p-1.5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto max-w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="text-xs py-2.5 px-5 rounded-xl transition-all font-bold uppercase tracking-widest whitespace-nowrap"
          :class="activeTab === tab.key ? 'bg-parentPrimary text-white shadow-lg shadow-parentPrimary/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-[2rem] p-8 border border-gray-100 animate-pulse h-48" />
    </div>

    <!-- Content Area -->
    <div v-else-if="filteredReports.length === 0">
      <EmptyState 
        title="All clear!" 
        :description="`No ${activeTab === 'all' ? '' : activeTab} reports require attention at this time.`"
        icon="✅"
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="report in filteredReports"
        :key="report._id"
        class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col"
        @click="selectedReport = report"
      >
        <div class="absolute top-0 right-0 p-6">
           <StatusBadge :status="report.status" />
        </div>

        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner group-hover:rotate-6 transition-transform">
            {{ catEmoji(report.category) }}
          </div>
          <h3 class="font-bold text-gray-900 text-lg tracking-tight pr-16 truncate">{{ report.title }}</h3>
        </div>
        
        <p class="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed flex-1">{{ report.description }}</p>
        
        <div class="flex items-center justify-between pt-6 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {{ report.reporter?.firstName }} {{ report.reporter?.lastName }}
          </div>
          <div class="flex items-center gap-2">
            <Clock class="w-3 h-3" />
            {{ new Date(report.createdAt).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Report Detail Modal -->
    <Transition name="fade">
      <div v-if="selectedReport" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all" @click.self="selectedReport = null">
        <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl relative animate-scale-in flex flex-col max-h-[90vh]">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
               <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner">
                 {{ catEmoji(selectedReport.category) }}
               </div>
               <div>
                  <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ selectedReport.title }}</h2>
                  <p class="text-sm font-bold text-parentPrimary uppercase tracking-widest mt-1">{{ selectedReport.category?.replace('_', ' ') }}</p>
               </div>
            </div>
            <button @click="selectedReport = null" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">✕</button>
          </div>
          
          <div class="overflow-y-auto pr-2 space-y-8 mb-8 flex-1 custom-scrollbar">
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-3">Issue Insight</p>
              <div class="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100 shadow-inner">
                {{ selectedReport.description }}
              </div>
            </div>

            <div v-if="selectedReport.thread?.length">
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-4">Resolution Thread</p>
              <div class="space-y-4">
                <div v-for="msg in selectedReport.thread" :key="msg.timestamp" class="flex flex-col" :class="msg.isAdmin ? 'items-end' : 'items-start'">
                   <div :class="msg.isAdmin ? 'bg-parentPrimary text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'" class="max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm">
                      {{ msg.message }}
                   </div>
                   <span class="text-[9px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">{{ msg.isAdmin ? 'System Admin' : 'Platform User' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Response Area -->
          <div class="pt-8 border-t border-gray-50 space-y-4">
            <div class="relative group">
              <textarea 
                v-model="adminMessage" 
                placeholder="Type your strategic response here..." 
                class="w-full h-28 p-5 rounded-[1.5rem] bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-sm font-medium resize-none shadow-inner" 
              />
            </div>
            <div class="flex gap-3">
              <button 
                @click="handleReply" 
                :disabled="!adminMessage.trim()"
                class="flex-1 py-4 bg-parentPrimary text-white rounded-2xl font-bold text-sm shadow-xl shadow-parentPrimary/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Dispatch Message
              </button>
              <button 
                v-if="selectedReport.status !== 'resolved'"
                @click="handleResolve('resolved')" 
                class="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors active:scale-[0.98]"
              >
                Set Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAdminReports } from '@/composables/modules/admin';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Clock } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'System Reports - Errandr Admin' });

const { reports, loading, fetchReports } = useAdminReports();
const activeTab = ref('all');
const selectedReport = ref<any>(null);
const adminMessage = ref('');

const tabs = [
  { key: 'all', label: 'All Cases' },
  { key: 'pending', label: 'Open' },
  { key: 'investigating', label: 'Under Review' },
  { key: 'resolved', label: 'Resolved' },
];

const filteredReports = computed(() => {
  if (activeTab.value === 'all') return reports.value;
  return reports.value.filter((r) => r.status === activeTab.value);
});

const catEmoji = (c: string) => ({ 
  food_quality: '🍽️', 
  late_delivery: '⏰', 
  wrong_order: '❌', 
  rude_behavior: '😤', 
  overcharging: '💰', 
  hygiene: '🧹' 
}[c] || '📋');

const handleReply = async () => {
  if (!adminMessage.value.trim() || !selectedReport.value) return;
  try {
    const res = await api.post(`/reports/${selectedReport.value._id}/message`, { message: adminMessage.value });
    selectedReport.value = res.data;
    adminMessage.value = '';
    await fetchReports();
  } catch (e) {
    console.error(e);
  }
};

const handleResolve = async (status: string) => {
  try {
    await api.put(`/reports/${selectedReport.value._id}/status`, { status, adminNote: adminMessage.value });
    selectedReport.value = null;
    adminMessage.value = '';
    await fetchReports();
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchReports);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>
