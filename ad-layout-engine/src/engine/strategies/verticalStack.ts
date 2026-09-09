import type { Ad } from '../../types/ad'
import type { PlacedElement } from '../types'
import { stackElements } from '../stackElements'

export function verticalStackStrategy(ad: Ad, surfaceWidth: number, surfaceHeight: number): PlacedElement[] {
  return stackElements(ad.elements, surfaceWidth, surfaceHeight, 'vertical')
}