<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Search Input & Selected Badges -->
    <div 
      class="w-full bg-white border border-gray-200 rounded-xl p-2 text-sm focus-within:border-parentPrimary focus-within:ring-1 focus-within:ring-parentPrimary min-h-[42px] flex flex-wrap gap-1 items-center cursor-text"
      @click="isOpen = true"
    >
      <div v-for="item in selectedItems" :key="item.value" class="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
        <span class="truncate max-w-[120px]">{{ item.label }}</span>
        <button type="button" @click.stop="toggleItem(item)" class="hover:text-red-500 text-gray-500">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <input 
        type="text" 
        v-model="searchQuery" 
        :placeholder="selectedItems.length ? '' : placeholder" 
        class="flex-1 min-w-[100px] outline-none bg-transparent text-sm py-1"
        @focus="isOpen = true"
      />
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
      <div v-if="filteredOptions.length === 0" class="p-3 text-sm text-gray-500 text-center">
        No results found.
      </div>
      <div 
        v-for="option in filteredOptions" 
        :key="option.value"
        @click="toggleItem(option)"
        class="flex items-center gap-2 p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
      >
        <input 
          type="checkbox" 
          :checked="isSelected(option)" 
          class="w-4 h-4 text-parentPrimary rounded border-gray-300 pointer-events-none"
        >
        <div class="flex flex-col">
          <span class="text-sm text-gray-800 font-medium">{{ option.label }}</span>
          <span v-if="option.sublabel" class="text-xs text-gray-500">{{ option.sublabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

interface Option {
  label: string
  value: string
  sublabel?: string
}

const props = defineProps<{
  modelValue: string[]
  options: Option[]
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)

const selectedItems = computed(() => {
  return props.options.filter(opt => props.modelValue.includes(opt.value))
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query) || 
    (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
  )
})

const isSelected = (option: Option) => {
  return props.modelValue.includes(option.value)
}

const toggleItem = (option: Option) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(option.value)
  if (index === -1) {
    newValue.push(option.value)
  } else {
    newValue.splice(index, 1)
  }
  emit('update:modelValue', newValue)
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
