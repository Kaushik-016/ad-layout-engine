import { describe, expect, test } from 'vitest'

import { generateLayout } from '../engine/generateLayout'
import { sampleAd } from '../data/sampleAd'

interface BenchmarkResult {
  surface: string
  runs: number
  averageMs: number
  minMs: number
  maxMs: number
}

const benchmarkSurface = (
  width: number,
  height: number,
  runs: number,
): BenchmarkResult => {
  const timings: number[] = []

  // Warm-up runs so the first execution does not distort the result.
  for (let i = 0; i < 50; i++) {
    generateLayout(sampleAd, width, height)
  }

  for (let i = 0; i < runs; i++) {
    const start = performance.now()

    generateLayout(sampleAd, width, height)

    const end = performance.now()

    timings.push(end - start)
  }

  const total = timings.reduce((sum, time) => sum + time, 0)

  return {
    surface: `${width}×${height}`,
    runs,
    averageMs: Number((total / runs).toFixed(4)),
    minMs: Number(Math.min(...timings).toFixed(4)),
    maxMs: Number(Math.max(...timings).toFixed(4)),
  }
}

describe('Layout Engine Performance', () => {
  test('benchmarks layout generation across major ad surfaces', () => {
    const runs = 1000

    const surfaces = [
      [400, 400],
      [390, 844],
      [768, 1024],
      [1080, 1080],
      [1080, 1920],
      [1440, 900],
    ] as const

    const results = surfaces.map(([width, height]) =>
      benchmarkSurface(width, height, runs),
    )

    console.table(results)

    for (const result of results) {
      expect(result.averageMs).toBeGreaterThanOrEqual(0)
      expect(result.minMs).toBeGreaterThanOrEqual(0)
      expect(result.maxMs).toBeGreaterThanOrEqual(result.minMs)
    }
  })
})