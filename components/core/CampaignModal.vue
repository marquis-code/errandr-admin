<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Edit Campaign' : 'Create Push Campaign' }}</h3>
            <p class="text-sm text-gray-500 mt-1">Configure automated push notifications</p>
          </div>
          <button @click="close" class="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Campaign Title (Supports Emojis)</label>
            <input v-model="form.title" type="text" placeholder="e.g. Hungry? 🍕" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Message Body</label>
            <textarea v-model="form.body" rows="3" placeholder="Enter the notification message..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all resize-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Target Audience</label>
              <select v-model="form.targetAudience" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all appearance-none">
                <option value="student">Students (App)</option>
                <option value="vendor">Vendors</option>
                <option value="all">Everyone</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Interval Value</label>
              <div class="flex gap-2">
                <input v-model.number="form.intervalValue" type="number" min="1" class="w-2/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all" />
                <select v-model="form.intervalUnit" class="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all appearance-none">
                  <option value="seconds">Sec</option>
                  <option value="minutes">Min</option>
                  <option value="hours">Hrs</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <input type="checkbox" id="isActive" v-model="form.isActive" class="w-5 h-5 text-[#FF5C1A] rounded focus:ring-[#FF5C1A] cursor-pointer" />
            <label for="isActive" class="font-medium text-gray-800 cursor-pointer select-none">Campaign is Active</label>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="close" class="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button @click="save" :disabled="loading" class="px-5 py-2.5 bg-[#FF5C1A] text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center gap-2">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean,
  campaign: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditing = computed(() => !!props.campaign)
const loading = ref(false)

const form = ref({
  title: '',
  body: '',
  targetAudience: 'student',
  intervalValue: 6,
  intervalUnit: 'hours',
  isActive: true
})

watch(() => props.campaign, (val) => {
  if (val) {
    form.value = {
      title: val.title,
      body: val.body,
      targetAudience: val.targetAudience,
      intervalValue: val.intervalValue || 6,
      intervalUnit: val.intervalUnit || 'hours',
      isActive: val.isActive
    }
  } else {
    form.value = { title: '', body: '', targetAudience: 'student', intervalValue: 6, intervalUnit: 'hours', isActive: true }
  }
}, { immediate: true })

const close = () => {
  isOpen.value = false
}

const save = async () => {
  if (!form.value.title || !form.value.body) return
  loading.value = true
  emit('save', { id: props.campaign?._id, data: form.value })
  loading.value = false
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
