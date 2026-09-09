import type { PlacedElement } from './types'

interface ScoreParams {
  placements: PlacedElement[]
  surfaceWidth: number
  surfaceHeight: number
}

export function scoreLayout({ placements, surfaceWidth, surfaceHeight }: ScoreParams): number {
  let score = 100

  const surfaceArea = surfaceWidth * surfaceHeight
  let usedArea = 0

  for (const p of placements) {
    if (p.hidden) {
      // penalty for hiding, worse if it was high priority
      score -= (6 - Math.min(p.element.priority, 5)) * 8
      continue
    }

    // overflow penalty: element smaller than its minimum constraints
    const { minWidth, minHeight } = p.element.constraints
    if (p.width < minWidth || p.height < minHeight) {
      score -= 25
    }

    // out of bounds penalty
    if (p.x < 0 || p.y < 0 || p.x + p.width > surfaceWidth || p.y + p.height > surfaceHeight) {
      score -= 30
    }

    usedArea += p.width * p.height

    // priority satisfaction: high-priority elements should be reasonably sized
    if (p.element.priority === 1) {
      const sizeRatio = (p.width * p.height) / (p.element.constraints.minWidth * p.element.constraints.minHeight)
      if (sizeRatio < 1.2) score -= 10 // barely above minimum, penalize a bit
    }
  }

  // coverage score: reward using space, but not overflowing (already penalized above)
  const coverageRatio = Math.min(usedArea / surfaceArea, 1)
  score += coverageRatio * 20

  return score
}