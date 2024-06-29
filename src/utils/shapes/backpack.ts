import type { Point } from '~/composables/useCanvas'

type BackpackType = 'bigSquare' | 'square' | 'bigLine' | 'line'

export class Backpack {
  type: BackpackType
  points: Point[]

  constructor(type: BackpackType, startPoint: Point) {
    this.type = type

    this.points = this.generatePoints()
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
