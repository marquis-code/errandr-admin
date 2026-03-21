<template>
  <Teleport to="body">
    <Transition name="drawer-backdrop">
      <div v-if="isOpen" class="fixed inset-0 z-[100] bg-gray-900/20 backdrop-blur-sm" @click="close"></div>
    </Transition>
    
    <Transition name="drawer-slide">
      <div 
        v-if="isOpen" 
        class="fixed right-0 top-0 bottom-0 z-[101] w-full md:w-[460px] bg-white shadow-2xl overflow-y-auto flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-end p-6 pb-2">
          <button @click="close" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex-1 px-6 pb-8">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { onUnmounted, watch } from 'vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

// Lock body scroll
watch(() => props.isOpen, (val) => {
  if (val) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
