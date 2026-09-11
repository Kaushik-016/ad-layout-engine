import type { Ad } from '../types/ad'
import type { PlacedElement } from './types'
import { getNaturalSize } from './naturalSize'

const BASE_WIDTH = 400
const BASE_HEIGHT = 400
const PADDING = 16
const GAP = 12

// mirrors the naive scale-to-fit renderer's logic, but produces PlacedElement[] so we can score it
export function computeNaiveLayout(ad: Ad, surfaceWidth: number, surfaceHeight: number): PlacedElement[] {
  const scale = Math.min(surfaceWidth / BASE_WIDTH, surfaceHeight / BASE_HEIGHT)

  let cursorY = PADDING
  const placements: PlacedElement[] = []

  for (const el of ad.elements) {
    const natural = getNaturalSize(el)
    const width = natural.width * scale
    const height = natural.height * scale
    const x = (surfaceWidth - width) / 2
    const y = cursorY * scale

    placements.push({ element: el, x, y, width, height, hidden: false, fontScale: scale })
    cursorY += natural.height + GAP
  }

  return placements
}