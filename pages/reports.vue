<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-1">
        <h1 class="text-4xl font-bold text-gray-900 font-display">Reports</h1>
        <p class="text-sm font-medium text-gray-500">Review user complaints and manage dispute resolutions.</p>
      </div>

      <div class="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl overflow-x-auto max-w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="text-sm py-2.5 px-5 rounded-xl transition-colors font-semibold whitespace-nowrap"
          :class="activeTab === tab.key ? 'bg-[#FF5C1A] text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-white'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="`report-loading-${i}`" class="bg-gray-50 rounded-3xl p-8 border border-gray-100 animate-pulse h-52">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
          <div class="flex-1 space-y-2">
            <div class="w-20 h-3 bg-gray-200 rounded-md"></div>
            <div class="w-48 h-5 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div class="w-full h-4 bg-gray-200 rounded-md mb-2"></div>
        <div class="w-3/4 h-4 bg-gray-200 rounded-md"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredReports.length === 0" class="py-40 bg-gray-50 rounded-3xl border border-gray-100">
      <EmptyState 
        title="No reports found" 
        :description="`There are no ${activeTab === 'all' ? '' : activeTab} reports at this time.`"
      />
    </div>

    <!-- Report Cards -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="report in filteredReports"
        :key="report._id"
        class="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-white hover:border-gray-200 transition-all cursor-pointer group flex flex-col border-l-4"
        :style="{ borderLeftColor: getCatColor(report.category) }"
        @click="selectedReport = report"
      >
        <!-- Status Indicator -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-gray-200 shrink-0">
              <component :is="catIcon(report.category)" class="w-5 h-5" :style="{ color: getCatColor(report.category) }" />
            </div>
            <div class="min-w-0 flex-1 pt-1">
              <p class="text-xs font-bold mb-1 capitalize" :style="{ color: getCatColor(report.category) }">{{ report.category?.replace('_', ' ') }}</p>
              <h3 class="font-bold text-gray-900 text-lg leading-snug group-hover:text-[#FF5C1A] transition-colors line-clamp-1">{{ report.title }}</h3>
            </div>
          </div>
          <StatusBadge :status="report.status" class="shrink-0 ml-4" />
        </div>
        
        <p class="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed flex-1">{{ report.description }}</p>
        
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-xs font-bold">
              {{ report.reporter?.firstName?.[0] }}
            </div>
            <span class="text-sm font-semibold text-gray-500">{{ report.reporter?.firstName }} {{ report.reporter?.lastName }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Clock class="w-3.5 h-3.5" />
            {{ new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Case Resolution Modal -->
    <Transition name="fade">
      <div v-if="selectedReport" class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6 transition-all" @click.self="selectedReport = null">
        <div class="bg-white rounded-3xl p-0 w-full max-w-2xl relative animate-scale-in flex flex-col max-h-[90vh] overflow-hidden border border-gray-200">
          <!-- Modal Header -->
          <div class="p-8 border-b border-gray-200 flex items-center justify-between bg-white">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200">
                <component :is="catIcon(selectedReport.category)" class="w-5 h-5" :style="{ color: getCatColor(selectedReport.category) }" />
              </div>
              <div class="space-y-1">
                <h2 class="text-xl font-bold text-gray-900 font-display">{{ selectedReport.title }}</h2>
                <p class="text-sm font-semibold capitalize" :style="{ color: getCatColor(selectedReport.category) }">{{ selectedReport.category?.replace('_', ' ') }}</p>
              </div>
            </div>
            <button @click="selectedReport = null" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-colors border border-gray-200">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="overflow-y-auto p-8 space-y-8 flex-1 custom-scrollbar bg-white">
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-gray-400 uppercase">Description</h4>
              <div class="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {{ selectedReport.description }}
              </div>
            </div>

            <div v-if="selectedReport.thread?.length" class="space-y-3">
              <h4 class="text-xs font-bold text-gray-400 uppercase">Conversation</h4>
              <div class="space-y-4">
                <div v-for="msg in selectedReport.thread" :key="msg.timestamp" class="flex flex-col" :class="msg.isAdmin ? 'items-end' : 'items-start'">
                  <div :class="msg.isAdmin ? 'bg-gray-900 text-white rounded-tr-sm' : 'bg-gray-50 text-gray-900 rounded-tl-sm border border-gray-200'" class="max-w-[85%] px-5 py-3 rounded-2xl">
                    <p class="text-sm font-medium leading-relaxed">{{ msg.message }}</p>
                  </div>
                  <div class="flex items-center gap-2 mt-1.5 px-1">
                    <span class="text-xs text-gray-400 font-semibold">{{ msg.isAdmin ? 'Admin' : 'User' }}</span>
                    <div class="w-1 h-1 rounded-full bg-gray-300" />
                    <span class="text-xs text-gray-400 font-medium">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Response Area -->
          <div class="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
            <textarea 
              v-model="adminMessage" 
              placeholder="Write your response..." 
              class="w-full h-28 p-5 rounded-2xl bg-white border border-gray-200 focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 transition-all text-sm font-medium resize-none placeholder:text-gray-400" 
            />
            <div class="flex gap-3">
              <button 
                @click="handleReply" 
                :disabled="!adminMessage.trim()"
                class="flex-1 py-3.5 bg-[#FF5C1A] text-white rounded-xl font-bold text-sm hover:bg-[#E54D12] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Send class="w-4 h-4" /> Send Reply
              </button>
              <button 
                v-if="selectedReport.status !== 'resolved'"
                @click="handleResolve('resolved')" 
                class="px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
              >
                Resolve
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
import { Clock, ChevronRight, X, Send, Utensils, Timer, XCircle, Frown, DollarSign, Sparkles, ClipboardList } from 'lucide-vue-next';
import { onMounted, ref, computed, markRaw } from 'vue';
import EmptyState from '@/components/core/EmptyState.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Reports - Errander Admin' });

const { reports, loading, fetchReports } = useAdminReports();
const activeTab = ref('all');
const selectedReport = ref<any>(null);
const adminMessage = ref('');

const getCatColor = (c: string) => ({ 
  food_quality: '#FF5C1A', 
  late_delivery: '#f59e0b', 
  wrong_order: '#ef4444', 
  rude_behavior: '#8b5cf6', 
  overcharging: '#10b981', 
  hygiene: '#ec4899' 
}[c] || '#6b7280');

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Open' },
  { key: 'investigating', label: 'Reviewing' },
  { key: 'resolved', label: 'Resolved' },
];

const filteredReports = computed(() => {
  if (activeTab.value === 'all') return reports.value;
  return reports.value.filter((r) => r.status === activeTab.value);
});

const catIcon = (c: string) => {
  const icons: Record<string, any> = { 
    food_quality: markRaw(Utensils), 
    late_delivery: markRaw(Timer), 
    wrong_order: markRaw(XCircle), 
    rude_behavior: markRaw(Frown), 
    overcharging: markRaw(DollarSign), 
    hygiene: markRaw(Sparkles) 
  };
  return icons[c] || markRaw(ClipboardList);
};

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
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
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
  background: #e5e5e5;
  border-radius: 10px;
}
</style>
