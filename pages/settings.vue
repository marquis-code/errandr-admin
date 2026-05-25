<template>
  <div class="space-y-8 animate-fade-in font-sans">
    <!-- Header Card -->
    <div class="bg-gray-950 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-lg border border-gray-900">
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-[#FF5C1A]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      <div class="relative z-10 space-y-2">
        <h2 class="text-2xl font-medium tracking-tight lowercase">platform configuration</h2>
        <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-md lowercase">
          configure dynamic system parameters, service fees, and logistics configurations in real-time.
        </p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Errand Config Card (7 Columns) -->
      <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center">
            <Zap class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">custom errand pricing</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">configure baseline pricing parameters</p>
          </div>
        </div>

        <form @submit.prevent="saveSettings" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">standard base fee (₦)</label>
              <input 
                v-model.number="form.baseFee"
                type="number"
                required
                min="0"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">express base fee (₦)</label>
              <input 
                v-model.number="form.expressFee"
                type="number"
                required
                min="0"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="saving"
              class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <span>{{ saving ? 'saving...' : 'save changes' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Info/Explanation Card (5 Columns) -->
      <div class="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <h3 class="text-sm font-medium text-gray-900 border-b border-gray-50 pb-4 lowercase">university logistics notes</h3>
        
        <div class="space-y-4 text-xs font-medium text-gray-500 leading-relaxed lowercase">
          <div class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 space-y-1">
            <p class="font-medium text-emerald-950">real-time updates</p>
            <p>changes are updated dynamically. when a student opens the errand request form, the baseline pricing matches these parameters instantly.</p>
          </div>

          <div class="space-y-2">
            <p class="font-medium text-gray-900">how this operates in a university system:</p>
            <ul class="list-disc pl-4 space-y-1.5">
              <li>standard fee is charged for routine pickups (e.g. laundry, off-campus print shops).</li>
              <li>express fee applies to time-sensitive tasks (e.g. food delivery or rush submissions).</li>
              <li>administrative staff can surge the base fee during heavy rain, exams peak times, or night shifts to incentivize campus erranders (riders).</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Zap, Loader2 } from 'lucide-vue-next';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'admin' });

const { showToast } = useCustomToast();
const saving = ref(false);

const form = reactive({
  baseFee: 450,
  expressFee: 850,
});

const loadSettings = async () => {
  try {
    const res = await admin_api.getCustomErrandSettings();
    const data = res.data;
    if (data) {
      form.baseFee = data.baseFee || 450;
      form.expressFee = data.expressFee || 850;
    }
  } catch (e: any) {
    console.error('Failed to load settings:', e);
    showToast({
      title: 'error',
      message: 'failed to load errand settings.',
      toastType: 'error',
    });
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    const res = await admin_api.updateCustomErrandSettings({
      baseFee: Number(form.baseFee),
      expressFee: Number(form.expressFee),
    });
    showToast({
      title: 'success',
      message: 'errand pricing configurations saved in real-time!',
      toastType: 'success',
    });
  } catch (e: any) {
    console.error('Failed to save settings:', e);
    showToast({
      title: 'error',
      message: e.response?.data?.message || 'failed to save settings.',
      toastType: 'error',
    });
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
