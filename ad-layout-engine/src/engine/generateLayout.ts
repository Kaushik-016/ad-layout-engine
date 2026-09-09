import type { Ad } from '../types/ad'
import type { LayoutCandidate } from './types'
import { verticalStackStrategy } from './strategies/verticalStack'
import { horizontalRowStrategy } from './strategies/horizontalRow'
import { scoreLayout } from './scoreLayout'

export function generateLayout(ad: Ad, surfaceWidth: number, surfaceHeight: number): LayoutCandidate {
  const strategies = [
    { name: 'vertical-stack', run: () => verticalStackStrategy(ad, surfaceWidth, surfaceHeight) },
    { name: 'horizontal-row', run: () => horizontalRowStrategy(ad, surfaceWidth, surfaceHeight) },
  ]

  const candidates: LayoutCandidate[] = strategies.map(({ name, run }) => {
    const placements = run()
    const score = scoreLayout({ placements, surfaceWidth, surfaceHeight })
    return { strategyName: name, placements, score }
  })

  candidates.sort((a, b) => b.score - a.score)
  return candidates[0]
}