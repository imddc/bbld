import { type Ref, onMounted, ref } from 'vue'
import { drawGrid } from '~/utils/grid'
import { Square } from '~/utils/shapes'

export interface CanvasOptions {
  width: number
  height: number
}

export type Grid = [number, number]

export interface Point {
  x: number
  y: number
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

export function useCanvas(el: Ref<HTMLCanvasElement | null>, options: CanvasOptions) {
  const canvas = el
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
  const gridRect = {
    width: gridSize.width - 2 * gridGap,
    height: gridSize.height - 2 * gridGap,
  }

  const square = new Square({
    grid,
    gridGap,
    gridRect,
  })

  onMounted(() => {
    if (!canvas.value) {
      console.error('canvas is null')
      return
    }
    ctx.value = canvas.value.getContext('2d')!

    initCanvas(canvas.value, options)
    // 绘制网格
    drawGrid(ctx.value, {
      grid,
      gridSize,
    })
    // 绘制方块
    square.draw(ctx.value)

    canvas.value.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()
    })

    canvas.value.addEventListener('mousedown', (e: MouseEvent) => {
      switch (e.button) {
        case 0: {
          console.log('left')
          break
        }
        case 1: {
          break
        }
        case 2: {
          console.log('right')
          break
        }
        default: {
          break
        }
      }
    })

    canvas.value.addEventListener('mousemove', (e: MouseEvent) => {
      const { offsetX, offsetY } = e
      const target = square.isIn({ x: offsetX, y: offsetY })

      if (target !== -1) {
        ctx.value?.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height)
        drawGrid(ctx.value!)
        square.draw(ctx.value!)
        square.hover(ctx.value!, [target])
        canvas.value!.style.cursor = 'pointer'
      }
      else {
        ctx.value?.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height)
        drawGrid(ctx.value!)
        square.draw(ctx.value!)
        canvas.value!.style.cursor = 'auto'
      }
    })
  })
}
