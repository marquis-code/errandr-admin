<template>
  <div class="space-y-8 animate-fade-in font-sans">
    <!-- Header Card -->
    <div class="bg-gray-950 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-lg border border-gray-900">
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-[#FF5C1A]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      <div class="relative z-10 space-y-2">
        <h2 class="text-2xl font-medium tracking-tight lowercase">system settings</h2>
        <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-md lowercase">
          manage platform economics, communications, and campaigns. every change includes a real-time impact analysis.
        </p>
      </div>
    </div>

    <!-- Section Navigation Tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-3 rounded-2xl text-xs font-medium lowercase transition-all flex items-center gap-2 border',
          activeTab === tab.id
            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200'
            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-900'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 1: PRICING & REVENUE -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'pricing'" class="space-y-8">

      <!-- 1A: Delivery Fees -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Truck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">delivery fees</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">base pricing students pay for delivery</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Standard Base Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">standard base fee (₦)</label>
              <button @click="showInfo('standardFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.baseFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.baseFee !== originalForm.baseFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.baseFee }} → ₦{{ form.baseFee }}. this affects what students pay for normal custom errands.
            </p>
            <!-- Info Tooltip -->
            <div v-if="activeInfo === 'standardFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the base delivery fee for routine, non-urgent custom errands (e.g. laundry pickup, stationery runs). students see this as the starting delivery price.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Express Base Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">express base fee (₦)</label>
              <button @click="showInfo('expressFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.expressFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.expressFee !== originalForm.expressFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.expressFee }} → ₦{{ form.expressFee }}. this is the premium fee for urgent, time-sensitive errands.
            </p>
            <div v-if="activeInfo === 'expressFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the premium delivery fee for time-sensitive errands (e.g. rush food delivery, urgent documents). the difference between standard and express is the "urgency premium" that incentivizes erranders to prioritize.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1B: Revenue & Commission -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">revenue & commissions</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">how erranders earns money from each transaction</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Buyer Convenience Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">buyer convenience fee (₦)</label>
              <button @click="showInfo('convenienceFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.convenienceFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.convenienceFee !== originalForm.convenienceFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.convenienceFee }} → ₦{{ form.convenienceFee }}. this flat fee goes directly to the platform on every order.
            </p>
            <div v-if="activeInfo === 'convenienceFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a small flat fee added to every order that goes 100% to erranders as platform revenue. students see this as a "convenience" or "service" charge. keep it low (₦50-₦200) so it doesn't discourage orders.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Runner Commission -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">runner commission (%)</label>
              <button @click="showInfo('commission')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.commissionPercentage"
              type="number" required min="0" max="100"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.commissionPercentage !== originalForm.commissionPercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from {{ originalForm.commissionPercentage }}% → {{ form.commissionPercentage }}%. at {{ form.commissionPercentage }}%, a ₦{{ form.baseFee }} delivery earns erranders ₦{{ Math.round(form.baseFee * form.commissionPercentage / 100) }} and the rider keeps ₦{{ Math.round(form.baseFee * (100 - form.commissionPercentage) / 100) }}.
            </p>
            <div v-if="activeInfo === 'commission'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the percentage of the delivery fee that erranders takes as commission. the rest goes to the rider. e.g. at 10%, a ₦450 delivery gives ₦45 to the platform and ₦405 to the rider. increasing this boosts revenue but may reduce rider satisfaction.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Platform Processing Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">platform processing fee (₦)</label>
              <button @click="showInfo('processingFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.platformProcessingFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.platformProcessingFee > 200" class="text-[10px] font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              ⚠️ warning: a high processing fee (₦{{ form.platformProcessingFee }}) may cause students to abandon their orders at checkout. recommended: ₦0 – ₦100.
            </p>
            <p v-else-if="form.platformProcessingFee !== originalForm.platformProcessingFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.platformProcessingFee }} → ₦{{ form.platformProcessingFee }}.
            </p>
            <div v-if="activeInfo === 'processingFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a flat fee added at checkout to cover payment gateway costs (paystack charges ~1.5% + ₦100). high values (₦300+) cause "checkout shock" and abandoned carts. recommended: keep at ₦0 and absorb gateway costs into the convenience fee instead.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Platform Service Fee % -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">platform service fee (%)</label>
              <button @click="showInfo('serviceFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.platformServiceFeePercentage"
              type="number" required min="0" max="100"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from {{ originalForm.platformServiceFeePercentage }}% → {{ form.platformServiceFeePercentage }}%. on a ₦5,000 order, erranders earns ₦{{ Math.round(5000 * form.platformServiceFeePercentage / 100) }} as service fee.
            </p>
            <div v-if="activeInfo === 'serviceFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a percentage of the total order value taken by the platform. this is essentially the vendor commission — the percentage erranders deducts before paying out the vendor. industry standard is 10%–30%. this is your biggest silent revenue driver.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1C: Food Markup -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center">
            <Tag class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">menu pricing strategy</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">controls how menu item prices appear to students</p>
          </div>
        </div>

        <div class="sm:w-1/2 space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-400 ml-1 lowercase">food markup (%)</label>
            <button @click="showInfo('foodMarkup')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
              <Info class="w-3 h-3" />
            </button>
          </div>
          <input 
            v-model.number="form.foodMarkupPercentage"
            type="number" required min="0" max="100"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
          />
          <div v-if="form.foodMarkupPercentage === 0" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium leading-relaxed flex items-center gap-2 border border-emerald-100">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>0% markup = students pay exactly what the vendor charges. this builds maximum trust and drives adoption, but you must compensate with strong service fees and commissions.</span>
          </div>
          <p v-else-if="form.foodMarkupPercentage !== originalForm.foodMarkupPercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <AlertTriangle class="w-3 h-3" />
            changing from {{ originalForm.foodMarkupPercentage }}% → {{ form.foodMarkupPercentage }}%. a ₦2,000 item will now show as ₦{{ Math.round(2000 * (1 + form.foodMarkupPercentage / 100)) }} on the app.
          </p>
          <div v-if="activeInfo === 'foodMarkup'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
            <p class="font-semibold">what is this?</p>
            <p>inflates vendor menu prices by this percentage on the student app. e.g. at 15%, a ₦2,000 item becomes ₦2,300. the extra ₦300 goes to erranders. set to 0% for "same as in-store" pricing (recommended for trust-building).</p>
            <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
          </div>
        </div>
      </div>

      <!-- Revenue Impact Calculator -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-[2rem] text-white space-y-4 border border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Calculator class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium lowercase">revenue impact calculator</h3>
            <p class="text-xs text-gray-400 lowercase">estimated platform earnings per order based on current settings</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">convenience fee</p>
            <p class="text-xl font-semibold mt-1">₦{{ form.convenienceFee }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">delivery commission</p>
            <p class="text-xl font-semibold mt-1">₦{{ Math.round(form.baseFee * form.commissionPercentage / 100) }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">processing fee</p>
            <p class="text-xl font-semibold mt-1">₦{{ form.platformProcessingFee }}</p>
          </div>
          <div class="bg-[#FF5C1A]/20 rounded-2xl p-4 border border-[#FF5C1A]/30">
            <p class="text-[10px] text-[#FF5C1A] uppercase tracking-wider font-semibold">est. revenue / order</p>
            <p class="text-xl font-semibold mt-1 text-[#FF5C1A]">₦{{ estimatedRevenue }}</p>
          </div>
        </div>
        <p class="text-[10px] text-gray-500 lowercase">* excludes platform service fee ({{ form.platformServiceFeePercentage }}% of food value) which varies per order size. on a ₦5,000 food order, add ₦{{ Math.round(5000 * form.platformServiceFeePercentage / 100) }}.</p>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          @click="confirmSave('pricing')" 
          :disabled="saving"
          class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
        >
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          <span>{{ saving ? 'saving...' : 'save pricing settings' }}</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 2: COMMUNICATIONS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'comms'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Bell class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">notification channels</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">control how the platform communicates with users</p>
          </div>
        </div>

        <!-- Email Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">email notifications</h4>
            <p class="text-xs text-gray-500 lowercase">order confirmations, receipts, OTPs, and marketing emails</p>
            <p v-if="!commsForm.emailsEnabled" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              disabling emails will stop all OTPs, receipts, and transactional emails. users may not be able to log in.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="commsForm.emailsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <!-- Push Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">push notifications</h4>
            <p class="text-xs text-gray-500 lowercase">real-time alerts on mobile and desktop via FCM</p>
            <p v-if="!commsForm.pushNotificationsEnabled" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              disabling push notifications means vendors and riders won't receive instant new order alerts.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="commsForm.pushNotificationsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="confirmSave('comms')" 
            :disabled="savingComms"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingComms" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingComms ? 'saving...' : 'save communications' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 3: ADVERTS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'adverts'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Megaphone class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">advert popup configuration</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">control the in-app promotional popup that students see</p>
          </div>
        </div>

        <!-- Enabled Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">enable adverts</h4>
            <p class="text-xs text-gray-500 lowercase">show the promotional popup modal to students periodically</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="advertForm.enabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">interval (minutes)</label>
              <button @click="showInfo('advertInterval')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="advertForm.intervalMinutes"
              type="number" required min="1"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="advertForm.intervalMinutes < 5" class="text-[10px] font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              showing ads every {{ advertForm.intervalMinutes }} min is very aggressive and may frustrate students.
            </p>
            <div v-if="activeInfo === 'advertInterval'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>how often (in minutes) the advert popup re-appears to the student. lower = more frequent = more annoying. recommended: 10-30 minutes.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium text-gray-400 ml-1 lowercase">auto-close (seconds, 0 = manual close)</label>
            <input 
              v-model.number="advertForm.autoCloseSeconds"
              type="number" required min="0"
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

        <!-- Custom Ad Form -->
        <div class="space-y-4" :class="{ 'opacity-50 pointer-events-none': advertForm.contentType !== 'custom' }">
          <h4 class="text-sm font-medium text-gray-900 lowercase border-b border-gray-50 pb-2">custom ad details</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">headline</label>
              <input v-model="advertForm.customAd.title" type="text" placeholder="e.g. Back to School Promo!" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">image url</label>
              <input v-model="advertForm.customAd.imageUrl" type="url" placeholder="https://example.com/image.png" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-medium text-gray-400 ml-1 lowercase">description</label>
            <textarea v-model="advertForm.customAd.description" rows="2" placeholder="Promo description..." class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">button text</label>
              <input v-model="advertForm.customAd.ctaText" type="text" placeholder="Shop Now" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-medium text-gray-400 ml-1 lowercase">button link</label>
              <input v-model="advertForm.customAd.ctaLink" type="text" placeholder="/errands/custom" class="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="confirmSave('adverts')" 
            :disabled="savingAdvert"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingAdvert" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingAdvert ? 'saving...' : 'save advert settings' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 4: CAMPAIGNS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'campaigns'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <Moon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">exam brethren campaign</h3>
            <p class="text-xs font-bold text-gray-400 lowercase">night owl free delivery and brethren split discounts</p>
          </div>
        </div>

        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">enable campaign</h4>
            <p class="text-xs text-gray-500 lowercase">activates free delivery (10pm-2am) and 10% group discounts</p>
            <p v-if="examBrethrenForm.isActive" class="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <CheckCircle class="w-3 h-3" />
              active — students ordering between 10pm and 2am get free delivery. this boosts late-night orders but absorbs delivery costs.
            </p>
            <p v-else class="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              inactive — no special night promotions are running.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="examBrethrenForm.isActive" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="confirmSave('campaigns')" 
            :disabled="savingExamBrethren"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-xs font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingExamBrethren" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingExamBrethren ? 'saving...' : 'save campaign settings' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- CONFIRMATION MODAL -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmModal.show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="confirmModal.show = false"></div>
          <div class="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-5 animate-scale-in">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <ShieldAlert class="w-7 h-7" />
            </div>

            <div class="text-center space-y-2">
              <h3 class="text-lg font-medium text-gray-900 lowercase">confirm changes</h3>
              <p class="text-sm text-gray-500 lowercase">{{ confirmModal.message }}</p>
            </div>

            <!-- Change Summary -->
            <div v-if="confirmModal.changes.length" class="bg-gray-50 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto border border-gray-100">
              <div v-for="(change, i) in confirmModal.changes" :key="i" class="text-xs font-medium text-gray-600 flex items-start gap-2">
                <span class="text-amber-500 mt-0.5">•</span>
                <span v-html="change"></span>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="confirmModal.show = false" class="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium lowercase hover:bg-gray-200 transition-colors">
                cancel
              </button>
              <button @click="executeConfirmedSave" class="flex-1 px-5 py-3.5 bg-[#FF5C1A] text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#e04e10] transition-colors">
                confirm & save
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { Zap, Loader2, Truck, DollarSign, Tag, Bell, Megaphone, Moon, Info, AlertTriangle, CheckCircle, Calculator, Save, ShieldAlert } from 'lucide-vue-next';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'admin' });

const { showToast } = useCustomToast();

// ─── Tab Navigation ────────────────
const activeTab = ref('pricing');
const tabs = [
  { id: 'pricing', label: 'pricing & revenue', icon: DollarSign },
  { id: 'comms', label: 'communications', icon: Bell },
  { id: 'adverts', label: 'adverts', icon: Megaphone },
  { id: 'campaigns', label: 'campaigns', icon: Moon },
];

// ─── Info Tooltips ────────────────
const activeInfo = ref('');
const showInfo = (key: string) => {
  activeInfo.value = activeInfo.value === key ? '' : key;
};

// ─── Form State ────────────────
const saving = ref(false);
const savingComms = ref(false);
const savingAdvert = ref(false);
const savingExamBrethren = ref(false);

const form = reactive({
  baseFee: 450,
  expressFee: 850,
  convenienceFee: 50,
  commissionPercentage: 10,
  platformProcessingFee: 500,
  platformServiceFeePercentage: 5,
  foodMarkupPercentage: 5,
});

const originalForm = reactive({ ...form });

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

// ─── Revenue Calculator ────────────────
const estimatedRevenue = computed(() => {
  return form.convenienceFee + Math.round(form.baseFee * form.commissionPercentage / 100) + form.platformProcessingFee;
});

// ─── Confirmation Modal ────────────────
const confirmModal = reactive({
  show: false,
  type: '' as string,
  message: '',
  changes: [] as string[],
});

const confirmSave = (type: string) => {
  confirmModal.type = type;
  confirmModal.changes = [];

  if (type === 'pricing') {
    confirmModal.message = 'you are about to update the platform pricing and revenue settings. these changes take effect immediately for all new orders.';
    if (form.baseFee !== originalForm.baseFee) confirmModal.changes.push(`standard base fee: <strong>₦${originalForm.baseFee}</strong> → <strong>₦${form.baseFee}</strong>`);
    if (form.expressFee !== originalForm.expressFee) confirmModal.changes.push(`express base fee: <strong>₦${originalForm.expressFee}</strong> → <strong>₦${form.expressFee}</strong>`);
    if (form.convenienceFee !== originalForm.convenienceFee) confirmModal.changes.push(`convenience fee: <strong>₦${originalForm.convenienceFee}</strong> → <strong>₦${form.convenienceFee}</strong>`);
    if (form.commissionPercentage !== originalForm.commissionPercentage) confirmModal.changes.push(`runner commission: <strong>${originalForm.commissionPercentage}%</strong> → <strong>${form.commissionPercentage}%</strong>`);
    if (form.platformProcessingFee !== originalForm.platformProcessingFee) confirmModal.changes.push(`processing fee: <strong>₦${originalForm.platformProcessingFee}</strong> → <strong>₦${form.platformProcessingFee}</strong>`);
    if (form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage) confirmModal.changes.push(`service fee: <strong>${originalForm.platformServiceFeePercentage}%</strong> → <strong>${form.platformServiceFeePercentage}%</strong>`);
    if (form.foodMarkupPercentage !== originalForm.foodMarkupPercentage) confirmModal.changes.push(`food markup: <strong>${originalForm.foodMarkupPercentage}%</strong> → <strong>${form.foodMarkupPercentage}%</strong>`);
    if (confirmModal.changes.length === 0) confirmModal.changes.push('no changes detected — saving current values.');
  } else if (type === 'comms') {
    confirmModal.message = 'you are about to update communication channel settings. this controls whether users receive emails and push notifications.';
    confirmModal.changes.push(`emails: <strong>${commsForm.emailsEnabled ? 'enabled' : 'disabled'}</strong>`);
    confirmModal.changes.push(`push notifications: <strong>${commsForm.pushNotificationsEnabled ? 'enabled' : 'disabled'}</strong>`);
    if (!commsForm.emailsEnabled) confirmModal.changes.push(`<span class="text-red-600">⚠️ warning: disabling emails will prevent OTP delivery and user login.</span>`);
  } else if (type === 'adverts') {
    confirmModal.message = 'you are about to update advert popup settings. this affects the promotional popups students see inside the app.';
    confirmModal.changes.push(`adverts: <strong>${advertForm.enabled ? 'enabled' : 'disabled'}</strong>`);
    confirmModal.changes.push(`interval: every <strong>${advertForm.intervalMinutes} minutes</strong>`);
    confirmModal.changes.push(`content type: <strong>${advertForm.contentType}</strong>`);
  } else if (type === 'campaigns') {
    confirmModal.message = 'you are about to update the exam brethren campaign. this controls free delivery during late night hours (10pm-2am).';
    confirmModal.changes.push(`campaign: <strong>${examBrethrenForm.isActive ? 'active — free delivery 10pm-2am' : 'inactive'}</strong>`);
    if (examBrethrenForm.isActive) confirmModal.changes.push('note: delivery fees will be waived between 10pm and 2am. this cost is absorbed by the platform.');
  }

  confirmModal.show = true;
};

const executeConfirmedSave = async () => {
  confirmModal.show = false;
  const type = confirmModal.type;

  if (type === 'pricing') await saveSettings();
  else if (type === 'comms') await saveCommunicationsSettings();
  else if (type === 'adverts') await saveAdvertSettings();
  else if (type === 'campaigns') await saveExamBrethrenSettings();
};

// ─── Load Settings ────────────────
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
      // Snapshot the originals for change detection
      Object.assign(originalForm, { ...form });
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
    showToast({ title: 'error', message: 'failed to load system settings.', toastType: 'error' });
  }
};

// ─── Save Functions ────────────────
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
    Object.assign(originalForm, { ...form });
    showToast({ title: 'success', message: 'pricing settings saved successfully!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save settings.', toastType: 'error' });
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
    showToast({ title: 'success', message: 'communications settings updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save communications settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save communications settings.', toastType: 'error' });
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
    showToast({ title: 'success', message: 'advert configuration updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save advert settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save advert configuration.', toastType: 'error' });
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
    showToast({ title: 'success', message: 'exam brethren campaign status updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save exam brethren settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save exam brethren settings.', toastType: 'error' });
  } finally {
    savingExamBrethren.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.25s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
