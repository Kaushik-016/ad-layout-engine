import { describe, expect, test } from 'vitest'

import { generateLayout } from '../engine/generateLayout'
import { scoreLayout } from '../engine/scoreLayout'
import { computeNaiveLayout } from '../engine/naiveLayout'
import { sampleAd } from '../data/sampleAd'

interface BenchmarkResult {
  surface: string
  adaptiveScore: number
  baselineScore: number
  improvement: number
}

const benchmarkSurface = (
  width: number,
  height: number,
): BenchmarkResult => {
  const adaptive = generateLayout(sampleAd, width, height)

  const baselinePlacements = computeNaiveLayout(
    sampleAd,
    width,
    height,
  )

  const baselineScore = scoreLayout({
    placements: baselinePlacements,
    surfaceWidth: width,
    surfaceHeight: height,
  })

  const improvement = adaptive.score - baselineScore

  return {
    surface: `${width}×${height}`,
    adaptiveScore: Number(adaptive.score.toFixed(2)),
    baselineScore: Number(baselineScore.toFixed(2)),
    improvement: Number(improvement.toFixed(2)),
  }
}

describe('Adaptive vs Baseline Layout Quality', () => {
  test('compares adaptive layouts against the naive baseline', () => {
    const surfaces = [
      [400, 400],
      [390, 844],
      [768, 1024],
      [1080, 1080],
      [1080, 1920],
      [1440, 900],
    ] as const

    const results = surfaces.map(([width, height]) =>
      benchmarkSurface(width, height),
    )

    console.table(results)

    for (const result of results) {
      expect(Number.isFinite(result.adaptiveScore)).toBe(true)
      expect(Number.isFinite(result.baselineScore)).toBe(true)
      expect(Number.isFinite(result.improvement)).toBe(true)
    }
  })
})