import type { AdElement } from '../types/ad'

export interface PlacedElement {
  element: AdElement
  x: number
  y: number
  width: number
  height: number
  hidden: boolean
  fontScale: number
}

export interface LayoutCandidate {
  strategyName: string
  placements: PlacedElement[]
  score: number
}