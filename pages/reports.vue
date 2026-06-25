<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Reports</h1>
        <p class="text-xs font-medium text-gray-500">Review user complaints and manage dispute resolutions.</p>
      </div>

      <div class="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto max-w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="text-xs py-1.5 px-4 rounded-md transition-all font-medium whitespace-nowrap"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="`report-loading-${i}`" class="bg-white rounded-xl p-5 border border-gray-200 animate-pulse h-40 shadow-sm">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="w-20 h-2 bg-gray-200 rounded"></div>
            <div class="w-40 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="w-full h-3 bg-gray-200 rounded mb-2"></div>
        <div class="w-3/4 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredReports.length === 0" class="py-20 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
      <EmptyState 
        title="No reports found" 
        :description="`There are no ${activeTab === 'all' ? '' : activeTab} reports at this time.`"
      />
    </div>

    <!-- Report Cards -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="report in filteredReports"
        :key="report._id"
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col border-l-4"
        :style="{ borderLeftColor: getCatColor(report.category) }"
        @click="selectedReport = report"
      >
        <!-- Status Indicator -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
              <component :is="catIcon(report.category)" class="w-4 h-4" :style="{ color: getCatColor(report.category) }" />
            </div>
            <div class="min-w-0 flex-1 pt-0.5">
              <p class="text-[10px] font-bold mb-0.5 uppercase tracking-wide" :style="{ color: getCatColor(report.category) }">{{ report.category?.replace('_', ' ') }}</p>
              <h3 class="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#FF5C1A] transition-colors line-clamp-1">{{ report.title }}</h3>
            </div>
          </div>
          <StatusBadge :status="report.status" class="shrink-0 ml-2 scale-75 origin-top-right" />
        </div>
        
        <p class="text-xs text-gray-500 line-clamp-2 mb-4 font-medium leading-relaxed flex-1">{{ report.description }}</p>
        
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded flex items-center justify-center bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
              {{ report.reporter?.firstName?.[0] || 'U' }}
            </div>
            <span class="text-xs font-semibold text-gray-600">{{ report.reporter?.firstName }} {{ report.reporter?.lastName }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            <Clock class="w-3 h-3" />
            {{ new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Case Resolution Modal -->
    <Transition name="fade">
      <div v-if="selectedReport" class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all" @click.self="selectedReport = null">
        <div class="bg-white rounded-xl p-0 w-full max-w-2xl relative animate-scale-in flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 shadow-xl">
          <!-- Modal Header -->
          <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                <component :is="catIcon(selectedReport.category)" class="w-4 h-4" :style="{ color: getCatColor(selectedReport.category) }" />
              </div>
              <div class="space-y-0.5">
                <h2 class="text-base font-semibold text-gray-900 font-heading">{{ selectedReport.title }}</h2>
                <p class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: getCatColor(selectedReport.category) }">{{ selectedReport.category?.replace('_', ' ') }}</p>
              </div>
            </div>
            <button @click="selectedReport = null" class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors border border-gray-200">
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="overflow-y-auto p-5 space-y-6 flex-1 custom-scrollbar bg-gray-50/30">
            <div class="space-y-2">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description</h4>
              <div class="text-xs text-gray-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                {{ selectedReport.description }}
              </div>
            </div>

            <div v-if="selectedReport.thread?.length" class="space-y-2">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Conversation</h4>
              <div class="space-y-3">
                <div v-for="msg in selectedReport.thread" :key="msg.timestamp" class="flex flex-col" :class="msg.isAdmin ? 'items-end' : 'items-start'">
                  <div :class="msg.isAdmin ? 'bg-gray-900 text-white rounded-tr-sm shadow-sm' : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200 shadow-sm'" class="max-w-[85%] px-4 py-2.5 rounded-xl">
                    <p class="text-xs font-medium leading-relaxed">{{ msg.message }}</p>
                  </div>
                  <div class="flex items-center gap-1.5 mt-1 px-1">
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{{ msg.isAdmin ? 'Admin' : 'User' }}</span>
                    <div class="w-1 h-1 rounded-full bg-gray-300" />
                    <span class="text-[10px] text-gray-400 font-semibold">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Response Area -->
          <div class="p-4 bg-white border-t border-gray-200 space-y-3">
            <textarea 
              v-model="adminMessage" 
              placeholder="Write your response..." 
              class="w-full h-24 p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all text-xs font-medium resize-none placeholder:text-gray-400" 
            />
            <div class="flex gap-2">
              <button 
                @click="handleReply" 
                :disabled="!adminMessage.trim()"
                class="flex-1 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-xs hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send class="w-3.5 h-3.5" /> Send Reply
              </button>
              <button 
                v-if="selectedReport.status !== 'resolved'"
                @click="handleResolve('resolved')" 
                class="px-6 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg font-semibold text-xs hover:bg-emerald-100 transition-colors shadow-sm"
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
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
