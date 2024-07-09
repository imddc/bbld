<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { backpackSelectKey, backpackSelectPubsub, backpackUnSelectKey } from './data'
import type { BackpackType } from '~/utils/shapes/backpack'

const shapes: BackpackType[] = [
  'bigSquare',
  'square',
  'bigLine',
  'line',
  'smallLine',
  'single',
]
const activeSelect = ref<BackpackType | null>(null)

function handleSelect(shape: BackpackType) {
  if (activeSelect.value === shape) {
    activeSelect.value = null
    backpackSelectPubsub.emit(backpackUnSelectKey, activeSelect.value)
  }
  else {
    activeSelect.value = shape
    backpackSelectPubsub.emit(backpackSelectKey, activeSelect.value)
  }
}

function handleUnSelect() {
  activeSelect.value = null
}

onMounted(() => {
  backpackSelectPubsub.on(backpackUnSelectKey, handleUnSelect)
})
onUnmounted(() => {
  backpackSelectPubsub.off(backpackUnSelectKey, handleUnSelect)
})
</script>

<template>
  <div class="space-x-2 flex items-center">
    <button
      v-for="shape in shapes"
      :key="shape"
      :class="activeSelect === shape ? 'bg-red-100 dark:bg-orange-50' : ''"
      class="p-1 border-orange-50 border rounded bg-red-50 flex-center space-x-1 hover:bg-red-100 dark:hover:bg-orange-50"
      type="button"
      @click="() => handleSelect(shape)"
    >
      <span>
        {{ shape }}
      </span>
      <span class="icon-[lucide--backpack] " />
    </button>
  </div>
</template>

<style scoped></style>
