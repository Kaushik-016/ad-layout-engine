import type { Ad } from '../types/ad'
import type { LayoutCandidate } from './types'

import { verticalStackStrategy } from './strategies/verticalStack'
import { horizontalRowStrategy } from './strategies/horizontalRow'
import { scoreLayout } from './scoreLayout'

export function generateLayout(
  ad: Ad,
  surfaceWidth: number,
  surfaceHeight: number
): LayoutCandidate {
  const strategies = [
    {
      name: 'vertical-stack',
      run: () => verticalStackStrategy(ad, surfaceWidth, surfaceHeight),
    },
    {
      name: 'horizontal-row',
      run: () => horizontalRowStrategy(ad, surfaceWidth, surfaceHeight),
    },
  ]

  const candidates: LayoutCandidate[] = strategies.map(({ name, run }) => {
    const placements = run()

    const score = scoreLayout({
      placements,
      surfaceWidth,
      surfaceHeight,
    })

    return {
      strategyName: name,
      placements,
      score,
    }
  })

  const validCandidates = candidates.filter((candidate) => {
    if (!Number.isFinite(candidate.score)) {
      return false
    }

    return candidate.placements.every((placement) => {
      if (placement.hidden) {
        return true
      }

      return (
        Number.isFinite(placement.x) &&
        Number.isFinite(placement.y) &&
        Number.isFinite(placement.width) &&
        Number.isFinite(placement.height) &&
        placement.width >= 0 &&
        placement.height >= 0 &&
        placement.x >= 0 &&
        placement.y >= 0 &&
        placement.x + placement.width <= surfaceWidth &&
        placement.y + placement.height <= surfaceHeight
      )
    })
  })

  if (validCandidates.length === 0) {
    return candidates[0]
  }

  validCandidates.sort((a, b) => b.score - a.score)

  return validCandidates[0]
}