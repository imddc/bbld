export interface Point {
  x: number
  y: number
}

export interface SquareType {
  p1: Point
  p2: Point
  p3: Point
  p4: Point
}

export class Square {
  public grid: [number, number]
  public gridGap: number
  public gridRect: { width: number, height: number }
  public target: number
  public squares: SquareType[]

  constructor(options: {
    grid: [number, number]
    gridGap: number
    gridRect: { width: number, height: number }
  }) {
    this.grid = options.grid
    this.gridGap = options.gridGap
    this.gridRect = options.gridRect

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

  draw(ctx: CanvasRenderingContext2D) {
    this.squares.forEach((square) => {
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

  isIn(pos: Point) {
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

    return target
  }

  hover(ctx: CanvasRenderingContext2D, targets: number[]) {
    const targetSquares = this.squares.filter((square, index) => targets.includes(index))

    targetSquares.forEach((square) => {
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
}
