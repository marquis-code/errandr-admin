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
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">express base fee (₦)</label>
              <input 
                v-model.number="form.expressFee"
                type="number"
                required
                min="0"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">buyer convenience fee (₦)</label>
              <input 
                v-model.number="form.convenienceFee"
                type="number"
                required
                min="0"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">runner commission (%)</label>
              <input 
                v-model.number="form.commissionPercentage"
                type="number"
                required
                min="0"
                max="100"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">platform processing fee (₦)</label>
              <input 
                v-model.number="form.platformProcessingFee"
                type="number"
                required
                min="0"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">platform service fee (%)</label>
              <input 
                v-model.number="form.platformServiceFeePercentage"
                type="number"
                required
                min="0"
                max="100"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">food markup (%)</label>
              <input 
                v-model.number="form.foodMarkupPercentage"
                type="number"
                required
                min="0"
                max="100"
                class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
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
      <div class="lg:col-span-5 space-y-8">
        <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
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

        <!-- Communications Settings Card -->
        <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
          <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 lowercase">communications</h3>
              <p class="text-xs font-bold text-gray-400 lowercase">toggle email and push notifications</p>
            </div>
          </div>

          <form @submit.prevent="saveCommunicationsSettings" class="space-y-6">
            <div class="space-y-4">
              <!-- Email Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 lowercase">email notifications</h4>
                  <p class="text-xs text-gray-500 lowercase mt-1">enable or disable all system emails</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="commsForm.emailsEnabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
                </label>
              </div>

              <!-- Push Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 lowercase">push notifications</h4>
                  <p class="text-xs text-gray-500 lowercase mt-1">enable or disable all fcm push messages</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="commsForm.pushNotificationsEnabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
                </label>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button 
                type="submit" 
                :disabled="savingComms"
                class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
              >
                <Loader2 v-if="savingComms" class="w-4 h-4 animate-spin" />
                <span>{{ savingComms ? 'saving...' : 'save changes' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Advert Settings Card -->
      <div class="lg:col-span-12 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-presentation"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">advert configuration</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">control the global advert popup</p>
          </div>
        </div>

        <form @submit.prevent="saveAdvertSettings" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <!-- Enabled Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 lowercase">enable adverts</h4>
                  <p class="text-xs text-gray-500 lowercase mt-1">show the popup modal periodically</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="advertForm.enabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Interval -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-400 ml-1 lowercase">interval (minutes)</label>
                  <input 
                    v-model.number="advertForm.intervalMinutes"
                    type="number"
                    required
                    min="1"
                    class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                  />
                </div>
                <!-- Auto Close -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-400 ml-1 lowercase">auto-close (seconds, 0=disable)</label>
                  <input 
                    v-model.number="advertForm.autoCloseSeconds"
                    type="number"
                    required
                    min="0"
                    class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Content Type -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-400 ml-1 lowercase">content type</label>
                <div class="flex gap-4">
                  <label class="flex-1 flex items-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="radio" v-model="advertForm.contentType" value="dynamic" class="text-[#FF5C1A] focus:ring-[#FF5C1A]">
                    <span class="text-sm font-medium lowercase">dynamic (random)</span>
                  </label>
                  <label class="flex-1 flex items-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="radio" v-model="advertForm.contentType" value="custom" class="text-[#FF5C1A] focus:ring-[#FF5C1A]">
                    <span class="text-sm font-medium lowercase">custom ad</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Custom Ad Form -->
            <div class="space-y-4" :class="{ 'opacity-50 pointer-events-none': advertForm.contentType !== 'custom' }">
              <h4 class="text-sm font-medium text-gray-900 lowercase border-b border-gray-50 pb-2">custom ad details</h4>
              
              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-400 ml-1 lowercase">headline</label>
                <input 
                  v-model="advertForm.customAd.title"
                  type="text"
                  placeholder="e.g. Back to School Promo!"
                  class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-400 ml-1 lowercase">description</label>
                <textarea 
                  v-model="advertForm.customAd.description"
                  rows="2"
                  placeholder="Promo description..."
                  class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-gray-400 ml-1 lowercase">image url</label>
                <input 
                  v-model="advertForm.customAd.imageUrl"
                  type="url"
                  placeholder="https://example.com/image.png"
                  class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-400 ml-1 lowercase">button text</label>
                  <input 
                    v-model="advertForm.customAd.ctaText"
                    type="text"
                    placeholder="Shop Now"
                    class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-medium text-gray-400 ml-1 lowercase">button link</label>
                  <input 
                    v-model="advertForm.customAd.ctaLink"
                    type="text"
                    placeholder="/errands/custom"
                    class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="savingAdvert"
              class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="savingAdvert" class="w-4 h-4 animate-spin" />
              <span>{{ savingAdvert ? 'saving...' : 'save changes' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Exam Brethren Campaign Card -->
      <div class="lg:col-span-12 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">exam brethren campaign</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">toggle night owl free delivery and brethren split discounts</p>
          </div>
        </div>

        <form @submit.prevent="saveExamBrethrenSettings" class="space-y-6">
          <div class="space-y-6">
            <!-- Enabled Toggle -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h4 class="text-sm font-medium text-gray-900 lowercase">enable campaign</h4>
                <p class="text-xs text-gray-500 lowercase mt-1">activates free delivery (10pm-2am) and 10% group discounts</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="examBrethrenForm.isActive" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
              </label>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="savingExamBrethren"
              class="px-6 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="savingExamBrethren" class="w-4 h-4 animate-spin" />
              <span>{{ savingExamBrethren ? 'saving...' : 'save changes' }}</span>
            </button>
          </div>
        </form>
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
  convenienceFee: 50,
  commissionPercentage: 10,
  platformProcessingFee: 500,
  platformServiceFeePercentage: 5,
  foodMarkupPercentage: 5,
});

const commsForm = reactive({
  emailsEnabled: true,
  pushNotificationsEnabled: true,
});

const advertForm = reactive({
  enabled: true,
  intervalMinutes: 15,
  autoCloseSeconds: 0,
  contentType: 'dynamic',
  customAd: {
    title: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
  }
});

const examBrethrenForm = reactive({
  isActive: false,
});

const savingComms = ref(false);
const savingAdvert = ref(false);
const savingExamBrethren = ref(false);

const loadSettings = async () => {
  try {
    const [errandRes, commsRes, advertRes, examBrethrenRes] = await Promise.all([
      admin_api.getCustomErrandSettings(),
      admin_api.getCommunicationsSettings(),
      admin_api.getAdvertSettings(),
      admin_api.getExamBrethrenSettings()
    ]);
    
    if (errandRes.data) {
      form.baseFee = errandRes.data.baseFee || 450;
      form.expressFee = errandRes.data.expressFee || 850;
      form.convenienceFee = errandRes.data.convenienceFee ?? 50;
      form.commissionPercentage = errandRes.data.commissionPercentage ?? 10;
      form.platformProcessingFee = errandRes.data.platformProcessingFee ?? 500;
      form.platformServiceFeePercentage = errandRes.data.platformServiceFeePercentage ?? 5;
      form.foodMarkupPercentage = errandRes.data.foodMarkupPercentage ?? 5;
    }

    if (commsRes.data) {
      commsForm.emailsEnabled = commsRes.data.emailsEnabled ?? true;
      commsForm.pushNotificationsEnabled = commsRes.data.pushNotificationsEnabled ?? true;
    }

    if (advertRes.data) {
      advertForm.enabled = advertRes.data.enabled ?? true;
      advertForm.intervalMinutes = advertRes.data.intervalMinutes ?? 15;
      advertForm.autoCloseSeconds = advertRes.data.autoCloseSeconds ?? 0;
      advertForm.contentType = advertRes.data.contentType || 'dynamic';
      if (advertRes.data.customAd) {
        advertForm.customAd = { ...advertForm.customAd, ...advertRes.data.customAd };
      }
    }
    
    if (examBrethrenRes.data) {
      examBrethrenForm.isActive = examBrethrenRes.data.isActive ?? false;
    }
  } catch (e: any) {
    console.error('Failed to load settings:', e);
    showToast({
      title: 'error',
      message: 'failed to load system settings.',
      toastType: 'error',
    });
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    await admin_api.updateCustomErrandSettings({
      baseFee: Number(form.baseFee),
      expressFee: Number(form.expressFee),
      convenienceFee: Number(form.convenienceFee),
      commissionPercentage: Number(form.commissionPercentage),
      platformProcessingFee: Number(form.platformProcessingFee),
      platformServiceFeePercentage: Number(form.platformServiceFeePercentage),
      foodMarkupPercentage: Number(form.foodMarkupPercentage),
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

const saveCommunicationsSettings = async () => {
  savingComms.value = true;
  try {
    await admin_api.updateCommunicationsSettings({
      emailsEnabled: commsForm.emailsEnabled,
      pushNotificationsEnabled: commsForm.pushNotificationsEnabled,
    });
    showToast({
      title: 'success',
      message: 'communications settings updated!',
      toastType: 'success',
    });
  } catch (e: any) {
    console.error('Failed to save communications settings:', e);
    showToast({
      title: 'error',
      message: e.response?.data?.message || 'failed to save communications settings.',
      toastType: 'error',
    });
  } finally {
    savingComms.value = false;
  }
};

const saveAdvertSettings = async () => {
  savingAdvert.value = true;
  try {
    await admin_api.updateAdvertSettings({
      enabled: advertForm.enabled,
      intervalMinutes: advertForm.intervalMinutes,
      autoCloseSeconds: advertForm.autoCloseSeconds,
      contentType: advertForm.contentType,
      customAd: advertForm.customAd,
    });
    showToast({
      title: 'success',
      message: 'advert configuration updated!',
      toastType: 'success',
    });
  } catch (e: any) {
    console.error('Failed to save advert settings:', e);
    showToast({
      title: 'error',
      message: e.response?.data?.message || 'failed to save advert configuration.',
      toastType: 'error',
    });
  } finally {
    savingAdvert.value = false;
  }
};

const saveExamBrethrenSettings = async () => {
  savingExamBrethren.value = true;
  try {
    await admin_api.updateExamBrethrenSettings({
      isActive: examBrethrenForm.isActive,
    });
    showToast({
      title: 'success',
      message: 'exam brethren campaign status updated!',
      toastType: 'success',
    });
  } catch (e: any) {
    console.error('Failed to save exam brethren settings:', e);
    showToast({
      title: 'error',
      message: e.response?.data?.message || 'failed to save exam brethren settings.',
      toastType: 'error',
    });
  } finally {
    savingExamBrethren.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
