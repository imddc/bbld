import type { Point, ShapeSize, SquarePosition } from '~/types'

export interface GridOptions {
  gridSize: ShapeSize
}

export interface ShapeOptions {
  gap: number
  gridSize: ShapeSize
}

// 无空隙转换
export function point2positionGrid(point: Point, options: GridOptions): SquarePosition {
  const [x, y] = point
  const { gridSize } = options

  return {
    p1: { x: x * gridSize.width, y: y * gridSize.height },
    p2: { x: (x + 1) * gridSize.width, y: y * gridSize.height },
    p3: { x: (x + 1) * gridSize.width, y: (y + 1) * gridSize.height },
    p4: { x: (x) * gridSize.width, y: (y + 1) * gridSize.height },
  }
}
export function createPoint2PositionGrid(options: GridOptions) {
  return (point: Point) => point2positionGrid(point, options)
}

// 有空隙转换
export function point2positionShape(point: Point, options: ShapeOptions): SquarePosition {
  const [x, y] = point
  const { gap, gridSize } = options

  return {
    p1: {
      x: x * gridSize.width + (2 * x + 1) * gap,
      y: y * gridSize.height + (2 * y + 1) * gap,
    },
    p2: {
      x: x * gridSize.width + (2 * x + 1) * gap + gridSize.width,
      y: y * gridSize.height + (2 * y + 1) * gap,
    },
    p3: {
      x: x * gridSize.width + (2 * x + 1) * gap + gridSize.width,
      y: y * gridSize.height + (2 * y + 1) * gap + gridSize.height,
    },
    p4: {
      x: x * gridSize.width + (2 * x + 1) * gap,
      y: y * gridSize.height + (2 * y + 1) * gap + gridSize.height,
    },
  }
}
export function createPoint2PositionShape(options: ShapeOptions) {
  return (point: Point) => point2positionShape(point, options)
}

export function position2pointShape(pos: SquarePosition, options: ShapeOptions): Point | undefined {
  const { p1, p2, p3, p4 } = pos
  const { gap, gridSize } = options

  if (
    !(p1.y === p2.y && p2.x === p3.x && p3.y === p4.y && p1.x === p4.x)
  ) {
    console.log('说明不是一个正方形')
    return
  }

  // 说明是一个正方形
  const x = (p1.y - gap) / (gridSize.height + 2 * gap)
  const y = (p1.x - gap) / (gridSize.width + 2 * gap)
  return [x, y]
}
export function createPosition2PointShape(options: ShapeOptions) {
  return (pos: SquarePosition) => position2pointShape(pos, options)
}

export function position2pointGrid(pos: SquarePosition, options: GridOptions): Point {
  const { p1 } = pos
  const { gridSize } = options

  return [Math.floor(p1.x / gridSize.width), Math.floor(p1.y / gridSize.height)]
}
export function createPosition2PointGrid(options: GridOptions) {
  return (pos: SquarePosition) => position2pointGrid(pos, options)
}
