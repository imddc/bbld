import type { Point } from '~/composables/useCanvas'

type BackpackType = 'bigSquare' | 'square' | 'bigLine' | 'line'

export class Backpack {
  public type: BackpackType
  public points: Point[]
  public grid: [number, number]
  public gridGap: number
  public gridRect: { width: number, height: number }

  constructor(options: {
    grid: [number, number]
    gridGap: number
    gridRect: { width: number, height: number }
  }) {
    this.grid = options.grid
    this.gridGap = options.gridGap
    this.gridRect = options.gridRect
  }

  private generatePoints() {
    switch (this.type) {
      case 'line':

        return []
      default:
        return []
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {

  }

  public isIn() {

  }
}
