import { describe, expect, test } from 'vitest'

import { generateLayout } from '../engine/generateLayout'
import { scoreLayout } from '../engine/scoreLayout'

import type { Ad } from '../types/ad'

const createTestAd = (): Ad => ({
  id: 'test-ad',
  name: 'Test Advertisement',
  elements: [
    {
      id: 'image',
      type: 'image',
      content: 'test-image',
      priority: 1,
      constraints: {
        minWidth: 80,
        minHeight: 80,
        lockAspectRatio: true,
        canHide: false,
      },
    },
    {
      id: 'headline',
      type: 'headline',
      content: 'Discover Something Amazing',
      priority: 1,
      constraints: {
        minWidth: 100,
        minHeight: 30,
        lockAspectRatio: false,
        canHide: false,
      },
    },
    {
      id: 'subtext',
      type: 'subtext',
      content: 'A short description for the advertisement.',
      priority: 2,
      constraints: {
        minWidth: 80,
        minHeight: 20,
        lockAspectRatio: false,
        canHide: true,
      },
    },
    {
      id: 'cta',
      type: 'cta',
      content: 'Shop Now',
      priority: 1,
      constraints: {
        minWidth: 60,
        minHeight: 25,
        lockAspectRatio: false,
        canHide: false,
      },
    },
  ],
})

describe('Adaptive Layout Engine', () => {
  test('generates a layout for a standard surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    expect(result).toBeDefined()
    expect(result.strategyName).toBeTruthy()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(result.score).toBeTypeOf('number')
  })

  test('keeps visible elements inside the surface bounds', () => {
    const ad = createTestAd()

    const width = 400
    const height = 400

    const result = generateLayout(ad, width, height)

    for (const placement of result.placements) {
      if (placement.hidden) {
        continue
      }

      expect(placement.x).toBeGreaterThanOrEqual(0)
      expect(placement.y).toBeGreaterThanOrEqual(0)
      expect(placement.x + placement.width).toBeLessThanOrEqual(width)
      expect(placement.y + placement.height).toBeLessThanOrEqual(height)
    }
  })

  test('preserves the number of placements', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    expect(result.placements).toHaveLength(ad.elements.length)
  })

  test('returns a valid strategy name', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    expect([
      'vertical-stack',
      'horizontal-row',
    ]).toContain(result.strategyName)
  })

  test('returns a finite layout score', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('returns valid font scales for placements', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    for (const placement of result.placements) {
      expect(Number.isFinite(placement.fontScale)).toBe(true)
      expect(placement.fontScale).toBeGreaterThan(0)
      expect(placement.fontScale).toBeLessThanOrEqual(1)
    }
  })

  test('handles a mobile surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 390, 844)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles a tablet surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 768, 1024)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
  })

  test('handles a wide desktop surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 1440, 900)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles a square surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 1080, 1080)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
  })

  test('handles a very tall story surface', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 1080, 1920)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
  })

  test('handles an extremely small surface without crashing', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 100, 100)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles an extremely wide surface without crashing', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 2000, 200)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles very long headline content', () => {
    const ad = createTestAd()

    ad.elements[1].content =
      'This is an intentionally extremely long headline designed to test how the adaptive layout engine behaves when the headline contains a large amount of content.'

    const result = generateLayout(ad, 320, 568)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles very long CTA content', () => {
    const ad = createTestAd()

    ad.elements[3].content = 'Start Your Journey Today'

    const result = generateLayout(ad, 320, 568)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('handles empty text content without crashing', () => {
    const ad = createTestAd()

    ad.elements[1].content = ''
    ad.elements[2].content = ''
    ad.elements[3].content = ''

    const result = generateLayout(ad, 400, 400)

    expect(result).toBeDefined()
    expect(result.placements).toHaveLength(ad.elements.length)
    expect(Number.isFinite(result.score)).toBe(true)
  })

  test('preserves headline and CTA on a tiny mobile banner', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 320, 50)

    const headline = result.placements.find(
      (placement) => placement.element.id === 'headline',
    )

    const cta = result.placements.find(
      (placement) => placement.element.id === 'cta',
    )

    expect(headline).toBeDefined()
    expect(cta).toBeDefined()

    expect(headline?.hidden).toBe(false)
    expect(cta?.hidden).toBe(false)
  })

  test('allows optional content to disappear before the CTA on a tiny banner', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 320, 50)

    const subtext = result.placements.find(
      (placement) => placement.element.id === 'subtext',
    )

    const cta = result.placements.find(
      (placement) => placement.element.id === 'cta',
    )

    expect(cta).toBeDefined()
    expect(cta?.hidden).toBe(false)

    if (subtext) {
      expect(subtext.hidden).toBe(true)
    }
  })

  test('keeps tiny-banner visible placements inside the surface bounds', () => {
    const ad = createTestAd()

    const width = 320
    const height = 50

    const result = generateLayout(ad, width, height)

    for (const placement of result.placements) {
      if (placement.hidden) {
        continue
      }

      expect(placement.x).toBeGreaterThanOrEqual(0)
      expect(placement.y).toBeGreaterThanOrEqual(0)
      expect(placement.x + placement.width).toBeLessThanOrEqual(width)
      expect(placement.y + placement.height).toBeLessThanOrEqual(height)
    }
  })

  test('can score the generated layout independently', () => {
    const ad = createTestAd()

    const result = generateLayout(ad, 400, 400)

    const score = scoreLayout({
      placements: result.placements,
      surfaceWidth: 400,
      surfaceHeight: 400,
    })

    expect(Number.isFinite(score)).toBe(true)
  })
})