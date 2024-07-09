import type { Backpack } from '~/utils/shapes'

export interface Position {
  x: number
  y: number
}

export type Point = [number, number]
export interface SquarePosition {
  p1: Position
  p2: Position
  p3: Position
  p4: Position
}

export interface CanvasOptions {
  width: number
  height: number
}

export type Grid = [number, number]
export interface ShapeSize {
  width: number
  height: number
}

export type CanvasState = 'move' | 'select' | 'paintingStart' | 'paintingEnd'
export type Shape = Backpack
