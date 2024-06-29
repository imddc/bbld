import { type Ref, onMounted, ref } from 'vue'

export interface CanvasOptions {
  width: number
  height: number
}

export type Grid = [number, number]

export interface Point {
  x: number
  y: number
}

export interface Square {
  p1: Point
  p2: Point
  p3: Point
  p4: Point
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

function drawGrid(ctx: CanvasRenderingContext2D, grid: Grid) {
  const [col, raw] = grid

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const lineWidth = ctx.canvas.width / col
  const lineHeight = ctx.canvas.height / raw
  // 竖线
  for (let i = 1; i < col; i++) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.moveTo(i * lineWidth, 0)
    ctx.lineTo(i * lineWidth, ctx.canvas.height)
    ctx.stroke()
  }

  // 横线
  for (let i = 1; i < raw; i++) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.moveTo(0, i * lineHeight)
    ctx.lineTo(ctx.canvas.width, i * lineHeight)
    ctx.stroke()
  }
}

function getSquares(ctx: CanvasRenderingContext2D, grid: Grid) {
  const [col, raw] = grid

  const gap = 5
  const squareWidth = ctx.canvas.width / col - 2 * gap
  const squareHeight = ctx.canvas.height / raw - 2 * gap

  const squares = []

  for (let i = 0; i < raw; i++) {
    for (let j = 0; j < col; j++) {
      squares.push({
        p1: { x: (2 * j + 1) * gap + j * squareWidth, y: (2 * i + 1) * gap + i * squareHeight },
        p2: { x: (2 * j + 1) * gap + (j + 1) * squareWidth, y: (2 * i + 1) * gap + i * squareHeight },
        p3: { x: (2 * j + 1) * gap + (j + 1) * squareWidth, y: (2 * i + 1) * gap + (i + 1) * squareHeight },
        p4: { x: (2 * j + 1) * gap + j * squareWidth, y: (2 * i + 1) * gap + (i + 1) * squareHeight },
      })
    }
  }
  return squares
}

function isInSquare(pos: Point, squares: Square[]) {
  const { x, y } = pos
  let target = -1

  for (let i = 0; i < squares.length; i++) {
    const square = squares[i]
    if (
      x >= square.p1.x
      && x <= square.p2.x
      && y >= square.p1.y
      && y <= square.p4.y
    ) {
      target = i
      break
    }
  }

  return target
}

function drawSquare(ctx: CanvasRenderingContext2D, squares: Square[]) {
  squares.forEach((square) => {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.moveTo(square.p1.x, square.p1.y)
    ctx.lineTo(square.p2.x, square.p2.y)
    ctx.lineTo(square.p3.x, square.p3.y)
    ctx.lineTo(square.p4.x, square.p4.y)
    ctx.lineTo(square.p1.x, square.p1.y)
    ctx.stroke()
  })
}

function hoverSquare(ctx: CanvasRenderingContext2D, squares: Square[]) {
  squares.forEach((square) => {
    ctx.beginPath()
    ctx.moveTo(square.p1.x, square.p1.y)
    ctx.lineTo(square.p2.x, square.p2.y)
    ctx.lineTo(square.p3.x, square.p3.y)
    ctx.lineTo(square.p4.x, square.p4.y)
    ctx.lineTo(square.p1.x, square.p1.y)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fill()
  })
}

export function useCanvas(el: Ref<HTMLCanvasElement | null>, options: CanvasOptions) {
  const canvas = el
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  const squares = ref<Square[]>([])
  const grid: Grid = [8, 7]

  onMounted(() => {
    if (!canvas.value) {
      console.error('canvas is null')
      return
    }
    ctx.value = canvas.value.getContext('2d')!

    initCanvas(canvas.value, options)
    drawGrid(ctx.value, grid)

    squares.value = getSquares(ctx.value, grid)
    drawSquare(ctx.value, squares.value)

    canvas.value.addEventListener('mousemove', (e: MouseEvent) => {
      const { offsetX, offsetY } = e
      const target = isInSquare({ x: offsetX, y: offsetY }, squares.value)

      if (target !== -1) {
        ctx.value?.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height)
        drawGrid(ctx.value!, grid)
        drawSquare(ctx.value!, squares.value)
        hoverSquare(ctx.value!, [squares.value[target]])
        canvas.value!.style.cursor = 'pointer'
      }
      else {
        ctx.value?.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height)
        drawGrid(ctx.value!, grid)
        drawSquare(ctx.value!, squares.value)
        canvas.value!.style.cursor = 'auto'
      }
    })
  })
}
