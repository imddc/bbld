import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import type { CanvasState, Grid, Position, Shape } from '~/types'
import { crateDrawGrid } from '~/utils/grid'
import { Backpack, Square } from '~/utils/shapes'
import { backpackSelectKey, backpackSelectPubsub } from '~/components/shape-select/data'

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
const startPoint = ref<Position>({ x: 0, y: 0 })
const movingPoint = ref<Position>({ x: 0, y: 0 })
// const endPoint = ref<Position>({ x: 0, y: 0 })
const shapes = ref<Shape[]>([])
const selectedShape = ref<Shape | null>(null)

// 绘制所有的shape
function drawShapes(ctx: CanvasRenderingContext2D) {
  shapes.value.forEach((shape) => {
    shape.draw(ctx)
  })
}

// 是否在画板中的shape内
function isInShape({ x, y }: Position): Shape | null {
  let res: Shape | null = null
  for (let i = shapes.value.length - 1; i >= 0; i--) {
    if (shapes.value[i].isIn({ x, y })) {
      res = shapes.value[i] as Shape
      break
    }
  }
  return res
}

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

  // 背景方格
  const square = new Square({
    grid,
    gridGap,
    squareSize,
  })
  // 背景栅格
  const drawGrid = crateDrawGrid({
    grid,
    gridSize,
  })
  // 画栅格和方格
  function drawGridAndSquares() {
    drawGrid(ctx.value!)
    square.draw(ctx.value!)
  }

  // 清空画布
  function clearCtx() {
    ctx.value!.clearRect(0, 0, options.width, options.height)
  }

  // 背包
  const backpack = new Backpack('square', 'row', {
    gridSize,
  }, [3, 2])
  shapes.value.push(backpack)

  // 鼠标按下事件
  function handleMouseDown(e: MouseEvent) {
    const { offsetX, offsetY } = e
    startPoint.value = { x: offsetX, y: offsetY }

    switch (e.button) {
      case 0: {
        switch (canvasState.value) {
          case 'move': {
            // 如果当前鼠标在某个图形上，则进入选择模式
            const res = isInShape({ x: offsetX, y: offsetY })
            if (res) {
              selectedShape.value = res
              // 修改状态为 select
              canvasState.value = 'select'
            }
            break
          }
          case 'paintingStart': {
            console.log('painting', offsetX, offsetY)

            break
          }
          default: {
            break
          }
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

  // 鼠标移动事件
  function handleMouseMove(e: MouseEvent) {
    const { offsetX, offsetY } = e
    movingPoint.value = { x: offsetX, y: offsetY }

    switch (canvasState.value) {
      case 'move': {
        // 修改鼠标样式
        canvas.value!.style.cursor = isInShape({ x: offsetX, y: offsetY })
          ? 'pointer'
          : 'default'

        break
      }
      case 'select': {
        const distance = {
          x: movingPoint.value.x - startPoint.value.x,
          y: movingPoint.value.y - startPoint.value.y,
        }

        // 如果没有选中的图形，则什么都不做
        if (!selectedShape.value) {
          return
        }

        clearCtx()
        drawGridAndSquares()

        // 这里的points是死的
        square.hover(ctx.value!, backpack.points)

        selectedShape.value.move(distance)
        selectedShape.value.draw(ctx.value!)

        // TODO: square hover

        break
      }
      case 'paintingStart': {
        console.log('painting on', offsetX, offsetY)
        break
      }
      default: {
        break
      }
    }
  }

  // 鼠标抬起事件
  function handleMouseUp() {
    switch (canvasState.value) {
      case 'select': {
        if (!selectedShape.value) {
          return
        }

        clearCtx()

        selectedShape.value.adsorb()
        selectedShape.value.draw(ctx.value!)
        selectedShape.value = null

        canvasState.value = 'move'
        break
      }
      case 'paintingStart': {
        console.log('paintingStart on')
        break
      }
      default: {
        canvasState.value = 'move'
        // canvas.value!.style.cursor = 'default'
        break
      }
    }
  }

  // 背包选中
  function handleBackpackSelect(shape: Shape) {
    console.log('handleBackpackSelect', shape)
    canvasState.value = 'paintingStart'
  }

  onMounted(() => {
    canvas.value = el.value
    ctx.value = canvas.value!.getContext('2d')!

    initCanvas(canvas.value!, options)
    // 先画上
    drawShapes(ctx.value!)

    canvas.value!.addEventListener('mousedown', handleMouseDown)
    canvas.value!.addEventListener('mousemove', handleMouseMove)
    canvas.value!.addEventListener('mouseup', handleMouseUp)

    backpackSelectPubsub.on(backpackSelectKey, handleBackpackSelect)
  })

  onUnmounted(() => {
    canvas.value!.removeEventListener('mousedown', handleMouseDown)
    canvas.value!.removeEventListener('mousemove', handleMouseMove)
    canvas.value!.removeEventListener('mouseup', handleMouseUp)

    backpackSelectPubsub.off(backpackSelectKey, handleBackpackSelect)
  })

  return {
    canvasState,
    selectedShape,
    startPoint,
    movingPoint,
  }
}
