import type { Grid, Point, Position, ShapeSize, SquarePosition } from '~/types'

interface Options {
  gap: number
  gridSize: ShapeSize
}

/**
{
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
        }
 */

export function point2pos(point: Point, options: Options): SquarePosition {
  const [x, y] = point
  const { gap, gridSize } = options

  return {
    p1: {
      x: y * gridSize.width + (2 * y + 1) * gap,
      y: x * gridSize.width + (2 * x + 1) * gap,
    },
    p2: {
      x: (y + 1) * gridSize.width + (2 * y + 1) * gap,
      y: x * gridSize.width + (2 * x + 1) * gap,
    },
    p3: {
      x: (y + 1) * gridSize.width + (2 * y + 1) * gap,
      y: (x + 1) * gridSize.width + (2 * x + 1) * gap,
    },
    p4: {
      x: y * gridSize.width + (2 * y + 1) * gap,
      y: (x + 1) * gridSize.width + (2 * x + 1) * gap,
    },
  }
}

export function createPoint2Position(options: Options) {
  return (point: Point) => point2pos(point, options)
}

export function pos2point(pos: SquarePosition, options: Options): Point | undefined {
  const { p1, p2, p3, p4 } = pos
  const { gap, gridSize } = options

  if (
    !(p1.y === p2.y
    && p2.x === p3.x
    && p3.y === p4.y
    && p1.x === p4.x)
  ) {
    console.log('说明不是一个正方形')
    return
  }

  // 说明是一个正方形
  const x = (p1.y - gap) / (gridSize.height + 2 * gap)
  const y = (p1.x - gap) / (gridSize.width + 2 * gap)
  return [x, y]
}

export function createPos2Point(options: Options) {
  return (pos: SquarePosition) => pos2point(pos, options)
}
