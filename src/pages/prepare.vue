<script setup lang="ts">
import { ref } from 'vue'
import { useCanvas } from '~/composables/useCanvas'
import ShapesSelect from '~/components/shape-select/index.vue'

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
  <div class="p-8 space-y-5">
    <ShapesSelect />

    <canvas
      ref="canvasRef"
      class="border-black border block"
      @contextmenu="(e) => e.preventDefault()"
    />

    <section class="mt-5 space-y-px">
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
