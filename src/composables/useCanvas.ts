import type { Position } from '@vueuse/core'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import type { CanvasState, Grid, Shapes } from '~/types'
import { crateDrawGrid } from '~/utils/grid'
import { Backpack, Square } from '~/utils/shapes'

export interface CanvasOptions {
  width: number
  height: number
}

function initCanvas(canvas: HTMLCanvasElement, options: CanvasOptions) {
  // 设置画布大小
  canvas.width = options.width
  canvas.height = options.height
  canvas.style.height = `${options.height * devicePixelRatio}px`
  canvas.style.width = `${options.width * devicePixelRatio}px`

  // 设置画布缩放
  canvas.style.transform = `scale(${devicePixelRatio})`
  canvas.style.transformOrigin = '0 0'
}

const canvasState = ref<CanvasState>('move')
const selectedShape = ref<Shapes[]>([])
const startPoint = ref<Position>({ x: 0, y: 0 })
const movingPoint = ref<Position>({ x: 0, y: 0 })
// const endPoint = ref<Position>({ x: 0, y: 0 })

export function useCanvas(el: Ref<HTMLCanvasElement | null>, options: CanvasOptions) {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  // options
  const grid: Grid = [9, 7]
  const gridGap = 5
  // 网格的宽高
  const gridSize = {
    width: options.width / grid[0],
    height: options.height / grid[1],
  }
  // 方块的宽高
  const squareSize = {
    width: gridSize.width - 2 * gridGap,
    height: gridSize.height - 2 * gridGap,
  }

  const square = new Square({
    grid,
    gridGap,
    squareSize,
  })

  const drawGrid = crateDrawGrid({
    grid,
    gridSize,
  })

  const backpack = new Backpack('square', 'row', {
    gridSize,
  }, [3, 2])

  function drawGridAndSquares() {
    drawGrid(ctx.value!)
    square.draw(ctx.value!)
  }

  function clearCtx() {
    ctx.value!.clearRect(0, 0, options.width, options.height)
  }

  function handleMouseDown(e: MouseEvent) {
    const { offsetX, offsetY } = e
    startPoint.value = { x: offsetX, y: offsetY }

    switch (e.button) {
      case 0: {
        // 进入选择模式
        if (backpack.isIn({ x: offsetX, y: offsetY })) {
          canvasState.value = 'select'
          selectedShape.value.push(backpack)
        }
        break
      }
      case 2: {
        // 旋转
        break
      }
      default: {
        break
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const { offsetX, offsetY } = e
    movingPoint.value = { x: offsetX, y: offsetY }

    switch (canvasState.value) {
      case 'move': {
        const targets = backpack.isIn({ x: offsetX, y: offsetY })
        if (targets) {
          canvas.value!.style.cursor = 'pointer'
        }
        else {
          canvas.value!.style.cursor = 'default'
        }

        break
      }
      case 'select': {
        const distance = {
          x: movingPoint.value.x - startPoint.value.x,
          y: movingPoint.value.y - startPoint.value.y,
        }

        clearCtx()
        drawGridAndSquares()

        // 这里的points是死的
        square.hover(ctx.value!, backpack.points)

        backpack.move(distance)
        backpack.draw(ctx.value!)

        // TODO: square hover

        break
      }
      default: {
        break
      }
    }
  }

  function handleMouseUp() {
    if (canvasState.value === 'select') {
      backpack.setLastPositions()
      selectedShape.value = []

      ctx.value?.clearRect(0, 0, options.width, options.height)
      backpack.adsorb()
      backpack.draw(ctx.value!)
    }

    canvasState.value = 'move'
    canvas.value!.style.cursor = 'default'
  }

  onMounted(() => {
    canvas.value = el.value
    ctx.value = canvas.value!.getContext('2d')!

    initCanvas(canvas.value!, options)
    // 先画上
    backpack.draw(ctx.value!)

    canvas.value!.addEventListener('mousedown', handleMouseDown)
    canvas.value!.addEventListener('mousemove', handleMouseMove)
    canvas.value!.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    canvas.value!.removeEventListener('mousedown', handleMouseDown)
    canvas.value!.removeEventListener('mousemove', handleMouseMove)
    canvas.value!.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    canvasState,
    selectedShape,
    startPoint,
    movingPoint,
  }
}
