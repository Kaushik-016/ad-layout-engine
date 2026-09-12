import type { AdElement } from '../types/ad'
import { measureTextWidth, measureWrappedHeight } from './textMeasure'

// Must match the actual rendered CSS in SmartAdSurface.tsx for each text
// type — this is what guarantees the box the engine reserves and the text
// that's actually drawn always agree.
const HEADLINE_FONT_SIZE = 18
const HEADLINE_FONT_WEIGHT = 800
const HEADLINE_LINE_HEIGHT = 1.05

const SUBTEXT_FONT_SIZE = 12
const SUBTEXT_FONT_WEIGHT = 400
const SUBTEXT_LINE_HEIGHT = 1.2

const CTA_FONT_SIZE = 12
const CTA_FONT_WEIGHT = 750

export function getNaturalSize(
  element: AdElement,
  availableWidth?: number
): { width: number; height: number } {
  const { minWidth, minHeight } = element.constraints

  switch (element.type) {
    case 'headline': {
      if (availableWidth !== undefined) {
        // Vertical stack: headline may wrap within the available width.
        const width = Math.min(
          Math.max(minWidth, 220),
          Math.max(minWidth, availableWidth)
        )

        const estimatedHeight = measureWrappedHeight(
          element.content,
          width,
          HEADLINE_FONT_SIZE,
          HEADLINE_FONT_WEIGHT,
          HEADLINE_LINE_HEIGHT
        )

        return {
          width,
          height: Math.max(minHeight, estimatedHeight),
        }
      }

      // Horizontal row: headline stays single-line.
      const measuredWidth = measureTextWidth(
        element.content,
        HEADLINE_FONT_SIZE,
        HEADLINE_FONT_WEIGHT
      )

      return {
        width: Math.max(minWidth, Math.min(measuredWidth + 8, 220)),
        height: Math.max(
          minHeight,
          HEADLINE_FONT_SIZE * HEADLINE_LINE_HEIGHT + 4
        ),
      }
    }

    case 'subtext': {
      const width = Math.min(
        Math.max(minWidth, 200),
        Math.max(minWidth, availableWidth ?? 200)
      )

      const estimatedHeight = measureWrappedHeight(
        element.content,
        width,
        SUBTEXT_FONT_SIZE,
        SUBTEXT_FONT_WEIGHT,
        SUBTEXT_LINE_HEIGHT
      )

      return {
        width,
        height: Math.max(minHeight, estimatedHeight),
      }
    }

    case 'cta': {
      // Size the pill to the actual button text, measured exactly at the
      // weight/size it's actually rendered at — not an approximation.
      const measuredWidth = measureTextWidth(
        element.content,
        CTA_FONT_SIZE,
        CTA_FONT_WEIGHT
      )

      return {
        width: Math.max(minWidth, Math.min(measuredWidth + 36, 160)),
        height: Math.max(minHeight, 32),
      }
    }

    case 'image':
      return {
        width: Math.max(minWidth, 140),
        height: Math.max(minHeight, 140),
      }

    case 'logo':
      return {
        width: Math.max(minWidth, 40),
        height: Math.max(minHeight, 40),
      }

    default:
      return {
        width: minWidth,
        height: minHeight,
      }
  }
}