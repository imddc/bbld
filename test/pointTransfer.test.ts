import { describe, expect, it } from 'vitest'
import { createPoint2Position, createPos2Point } from '../src/utils/pointTransfer'

const pointTransfer = createPoint2Position({ gap: 5, gridSize: { width: 50, height: 50 } })
const posTransfer = createPos2Point({ gap: 5, gridSize: { width: 50, height: 50 } })

describe('pointToPos', () => {
  it('should be pos', () => {
    expect(pointTransfer([0, 0])).toMatchInlineSnapshot(`
      {
        "p1": {
          "x": 5,
          "y": 5,
        },
        "p2": {
          "x": 55,
          "y": 5,
        },
        "p3": {
          "x": 55,
          "y": 55,
        },
        "p4": {
          "x": 5,
          "y": 55,
        },
      }
    `)

    expect(pointTransfer([1, 1])).toMatchInlineSnapshot(`
      {
        "p1": {
          "x": 65,
          "y": 65,
        },
        "p2": {
          "x": 115,
          "y": 65,
        },
        "p3": {
          "x": 115,
          "y": 115,
        },
        "p4": {
          "x": 65,
          "y": 115,
        },
      }
    `)
  })
})

describe('posToPoint', () => {
  it('should be point', () => {
    expect(posTransfer({
      p1: { x: 5, y: 5 },
      p2: { x: 55, y: 5 },
      p3: { x: 55, y: 55 },
      p4: { x: 5, y: 55 },
    })).toMatchInlineSnapshot(`
      [
        0,
        0,
      ]
    `)

    expect(posTransfer({
      p1: { x: 65, y: 65 },
      p2: { x: 115, y: 65 },
      p3: { x: 115, y: 115 },
      p4: { x: 65, y: 115 },
    })).toMatchInlineSnapshot(`
      [
        1,
        1,
      ]
    `)
  })
})
