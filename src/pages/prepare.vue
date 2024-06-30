<script setup lang="ts">
import { ref } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
// TODO: 1. new grid 8 * 7

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { canvasState, movingPoint, startPoint, selectedShape } = useCanvas(canvasRef, {
  height: 600,
  width: 800,
})

// TODO: 2. store

// TODO: 3. drag
</script>

<template>
  <div>
    <div class="flex px-8 ">
      <canvas ref="canvasRef" class="border-black border" @contextmenu="(e) => e.preventDefault()" />

      <div class="ml-auto grid grid-cols-3 gap-2 p-8 content-start">
        <div v-for="i in 15" :key="i" class="flex-center bg-gray-300 rounded-md aspect-square p-4">
          {{ i }}
        </div>
      </div>
    </div>

    <section class="mt-5 p-8 space-y-px">
      <div>mode: {{ canvasState }}</div>

      <div>
        dis
        <span v-if="canvasState === 'select'">
          {{ movingPoint.x - startPoint.x }} {{ movingPoint.y - startPoint.y }}
        </span>
      </div>

      <div>
        active Shape
        <div>
          {{ selectedShape }}
        </div>
      </div>
    </section>
  </div>
</template>
