<template>
  <div class="space-y-4 animate-pulse">
    <div class="bg-gray-100 rounded-2xl border border-gray-50 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-50">
            <th v-for="i in cols" :key="i" class="p-5">
              <div class="h-3 w-20 bg-gray-200 rounded-full" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="i in rows" :key="i">
            <td v-for="j in cols" :key="j" class="p-5">
              <div class="h-3 w-full bg-gray-100 rounded-full" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  cols?: number
}>(), {
  rows: 5,
  cols: 4
})
</script>
