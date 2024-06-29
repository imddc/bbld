import type { Grid, GridSize } from '~/types'

export interface GridOptions {
  grid: Grid
  gridSize: GridSize
}

export function drawGrid(ctx: CanvasRenderingContext2D, options: GridOptions) {
  const { grid, gridSize } = options
  // 竖线
  for (let i = 1; i < grid[0]; i++) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.moveTo(i * gridSize.width, 0)
    ctx.lineTo(i * gridSize.width, ctx.canvas.height)
    ctx.stroke()
  }

  // 横线
  for (let i = 1; i < grid[1]; i++) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.moveTo(0, i * gridSize.height)
    ctx.lineTo(ctx.canvas.width, i * gridSize.height)
    ctx.stroke()
  }
}

export function crateDrawGrid(options: GridOptions) {
  return (ctx: CanvasRenderingContext2D) => {
    drawGrid(ctx, options)
  }
}
