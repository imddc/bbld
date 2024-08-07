import type { Point, Position, ShapeSize, SquarePosition } from '~/types'
import { type GridOptions, createPoint2PositionGrid, createPosition2PointGrid } from '~/utils/pointTransfer'

export type BackpackType =
  | 'bigSquare' // 六个格子 3 * 2
  | 'square' // 四个格子 2 * 2
  | 'bigLine' // 四个格子 1 * 4
  | 'line' // 三个格子 1 * 3
  | 'smallLine' // 两个格子 1 * 2
  | 'single' // 一个格子 1 * 1

type Mode = 'col' | 'row'

// 根据背包类型获取对应的格子
export function getBackpackPoints(type: BackpackType): Point[] {
  switch (type) {
    case 'bigSquare': {
      return [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]
    }
    case 'square': {
      return [[0, 0], [1, 0], [0, 1], [1, 1]]
    }
    case 'bigLine': {
      return [[0, 0], [1, 0], [2, 0], [3, 0]]
    }
    case 'line': {
      return [[0, 0], [1, 0], [2, 0]]
    }
    case 'smallLine': {
      return [[0, 0], [1, 0]]
    }
    case 'single': {
      return [[0, 0]]
    }
    default: {
      return []
    }
  }
}

export function generateBackpackPointsWithStartPoint(type: BackpackType, startPoint: Point): Point[] {
  return getBackpackPoints(type).map((point) => {
    return startPoint.map((num, i) => num + point[i])
  }) as Point[]
}

export class Backpack {
  public type: BackpackType
  public mode: Mode
  public startPoint: Point
  public points: Point[]
  public positions: SquarePosition[]
  public lastPositions: SquarePosition[] = []
  public size: ShapeSize
  public edgePositions: SquarePosition

  constructor(type: BackpackType, mode: Mode, options: GridOptions, startPoint: Point = [0, 0]) {
    this.type = type
    this.mode = mode
    this.size = options.gridSize
    this.startPoint = startPoint

    this.points = generateBackpackPointsWithStartPoint(type, startPoint)
    this.positions = this.generatePoss()
    this.setLastPositions()
    this.edgePositions = this.getEdgePositions()
  }

  public rotate() {
    // 顺时针旋转90度
    // Step 1: Rotate each point 90 degrees clockwise
    const rotatedPoints = this.points.map(([x, y]) => [y, -x] as Point)

    // Step 2: Translate y-coordinates to ensure all coordinates are non-negative
    const minY = Math.min(...rotatedPoints.map(([_, y]) => y))
    const translatedPoints = rotatedPoints.map(([x, y]) => [x, y - minY] as Point)

    return translatedPoints
  }

  private generatePoss(): SquarePosition[] {
    const point2pos = createPoint2PositionGrid({ gridSize: this.size })
    return this.points.map(point => point2pos(point))
  }

  private getEdgePositions(): SquarePosition {
    // 用于方便获取点的工具函数
    const getPos = (fn: (pos: SquarePosition) => number) => this.positions.map(fn)
    // 获取边缘四个点
    const pos = {
      p1: { x: Math.min(...getPos(pos => pos.p1.x)), y: Math.min(...getPos(pos => pos.p1.y)) },
      p2: { x: Math.max(...getPos(pos => pos.p2.x)), y: Math.min(...getPos(pos => pos.p2.y)) },
      p3: { x: Math.max(...getPos(pos => pos.p3.x)), y: Math.max(...getPos(pos => pos.p3.y)) },
      p4: { x: Math.min(...getPos(pos => pos.p4.x)), y: Math.max(...getPos(pos => pos.p4.y)) },
    }
    return pos
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // 本来是直接绘制所edgePositions的图形 这样性能似乎低于绘制边缘 ps:性能瓶颈多数情况不在js
    // 并且背包的所有类型edgePositions是矩形
    ctx.beginPath()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.moveTo(this.edgePositions.p1.x, this.edgePositions.p1.y)
    ctx.lineTo(this.edgePositions.p2.x, this.edgePositions.p2.y)
    ctx.lineTo(this.edgePositions.p3.x, this.edgePositions.p3.y)
    ctx.lineTo(this.edgePositions.p4.x, this.edgePositions.p4.y)
    ctx.lineTo(this.edgePositions.p1.x, this.edgePositions.p1.y)
    ctx.fill()
  }

  public isIn(position: Position) {
    const { x, y } = position
    if (
      x >= this.edgePositions.p1.x
      && x <= this.edgePositions.p2.x
      && y >= this.edgePositions.p1.y
      && y <= this.edgePositions.p4.y) {
      return {
        points: this.points,

      }
    }

    return false
  }

  // 保存上一次的位置
  public setLastPositions() {
    this.lastPositions = JSON.parse(JSON.stringify(this.positions)) as SquarePosition[]
  }

  public move(pos: { x: number, y: number }) {
    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i].p1.x = this.lastPositions[i].p1.x + pos.x
      this.positions[i].p2.x = this.lastPositions[i].p2.x + pos.x
      this.positions[i].p3.x = this.lastPositions[i].p3.x + pos.x
      this.positions[i].p4.x = this.lastPositions[i].p4.x + pos.x

      this.positions[i].p1.y = this.lastPositions[i].p1.y + pos.y
      this.positions[i].p2.y = this.lastPositions[i].p2.y + pos.y
      this.positions[i].p3.y = this.lastPositions[i].p3.y + pos.y
      this.positions[i].p4.y = this.lastPositions[i].p4.y + pos.y
    }

    this.edgePositions = this.getEdgePositions()
  }

  // 吸附
  public adsorb() {
    const position2pointGrid = createPosition2PointGrid({ gridSize: this.size })
    const firstP1 = {
      x: Math.min(...this.positions.map(pos => pos.p1.x)),
      y: Math.min(...this.positions.map(pos => pos.p1.y)),
    }

    // @ts-expect-error ignore
    const res = position2pointGrid({ p1: firstP1 })

    this.startPoint = res! as Point
    this.points = generateBackpackPointsWithStartPoint(this.type, this.startPoint)
    this.positions = this.generatePoss()
    this.edgePositions = this.getEdgePositions()
    this.setLastPositions()
  }
}
