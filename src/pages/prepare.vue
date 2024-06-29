<script setup lang="ts">
import { ref } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
// TODO: 1. new grid 8 * 7

const canvasRef = ref<HTMLCanvasElement | null>(null)
useCanvas(canvasRef, {
  height: 600,
  width: 700,
})

// TODO: 2. store
// TODO: 3. drag
</script>

<template>
  <div>
    <div class="flex px-8 ">
      <canvas
        ref="canvasRef"
        class="border-black border"
      />

      <div class="ml-auto grid grid-cols-3 gap-2 p-8 content-start">
        <div
          v-for="i in 15"
          :key="i"
          class="flex-center bg-gray-300 rounded-md aspect-square p-4"
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>
