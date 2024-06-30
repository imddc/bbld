import type { Grid, Point, Position, ShapeSize, SquarePosition } from '~/types'
import { createPoint2PositionShape } from '~/utils/pointTransfer'

export class Square {
  public grid: [number, number]
  public gridGap: number
  public gridRect: { width: number, height: number }
  // hover target
  public target: Point[] | undefined
  public squares: SquarePosition[]

  constructor(options: {
    grid: Grid
    gridGap: number
    squareSize: ShapeSize
  }) {
    this.grid = options.grid
    this.gridGap = options.gridGap
    this.gridRect = options.squareSize

    this.squares = this.getSquares()
    this.target = this.isIn({ x: 0, y: 0 })
  }

  private getSquares() {
    const squares = []
    for (let i = 0; i < this.grid[1]; i++) {
      for (let j = 0; j < this.grid[0]; j++) {
        squares.push({
          p1: {
            x: (2 * j + 1) * this.gridGap + j * this.gridRect.width,
            y: (2 * i + 1) * this.gridGap + i * this.gridRect.height,
          },
          p2: {
            x: (2 * j + 1) * this.gridGap + (j + 1) * this.gridRect.width,
            y: (2 * i + 1) * this.gridGap + i * this.gridRect.height,
          },
          p3: {
            x: (2 * j + 1) * this.gridGap + (j + 1) * this.gridRect.width,
            y: (2 * i + 1) * this.gridGap + (i + 1) * this.gridRect.height,
          },
          p4: {
            x: (2 * j + 1) * this.gridGap + j * this.gridRect.width,
            y: (2 * i + 1) * this.gridGap + (i + 1) * this.gridRect.height,
          },
        })
      }
    }
    return squares
  }

  draw(ctx: CanvasRenderingContext2D, color: string = 'rgba(0, 0, 0, 0.1)') {
    this.squares.forEach((square) => {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.moveTo(square.p1.x, square.p1.y)
      ctx.lineTo(square.p2.x, square.p2.y)
      ctx.lineTo(square.p3.x, square.p3.y)
      ctx.lineTo(square.p4.x, square.p4.y)
      ctx.lineTo(square.p1.x, square.p1.y)
      ctx.fill()
    })
  }

  isIn(pos: Position): Point[] | undefined {
    const { x, y } = pos
    let target = -1

    for (let i = 0; i < this.squares.length; i++) {
      const square = this.squares[i]

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

    if (target !== -1) {
      return [
        [Math.floor(target / this.grid[0]), target % this.grid[0]],
      ]
    }
  }

  hover(ctx: CanvasRenderingContext2D, points: Point[]) {
    const point2pos = createPoint2PositionShape({ gap: this.gridGap, gridSize: this.gridRect })
    const positions = points.map(point2pos)

    positions.forEach((square) => {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.moveTo(square.p1.x, square.p1.y)
      ctx.lineTo(square.p2.x, square.p2.y)
      ctx.lineTo(square.p3.x, square.p3.y)
      ctx.lineTo(square.p4.x, square.p4.y)
      ctx.lineTo(square.p1.x, square.p1.y)
      ctx.fill()
    })
  }
}
