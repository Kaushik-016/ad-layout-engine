import type { AdElement } from '../types/ad'

function estimateTextHeight(
  text: string,
  width: number,
  fontSize: number,
  lineHeight = 1.35
): number {
  const avgCharWidth = fontSize * 0.58
  const charsPerLine = Math.max(1, Math.floor(width / avgCharWidth))
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine))

  return lines * fontSize * lineHeight + 4
}

function estimateSingleLineSize(
  text: string,
  fontSize: number,
  lineHeight = 1.35
) {
  const avgCharWidth = fontSize * 0.58

  return {
    width: Math.ceil(text.length * avgCharWidth) + 8,
    height: fontSize * lineHeight + 4,
  }
}

export function getNaturalSize(
  element: AdElement,
  availableWidth?: number
): { width: number; height: number } {
  const { minWidth, minHeight } = element.constraints

  switch (element.type) {
    case 'headline': {
      if (availableWidth !== undefined) {
        // Keep the headline within the available cross-axis width,
        // while respecting its minimum width whenever possible.
        const width = Math.min(
          Math.max(minWidth, 220),
          Math.max(minWidth, availableWidth)
        )

        const estimatedHeight = estimateTextHeight(
          element.content,
          width,
          18
        )

        return {
          width,
          height: Math.max(minHeight, estimatedHeight),
        }
      }

      // Horizontal row: headline remains single-line.
      const single = estimateSingleLineSize(element.content, 18)

      return {
        width: Math.max(
          minWidth,
          Math.min(single.width, 220)
        ),
        height: Math.max(minHeight, single.height),
      }
    }

    case 'subtext': {
      const width = Math.min(
        Math.max(minWidth, 200),
        Math.max(minWidth, availableWidth ?? 200)
      )

      const estimatedHeight = estimateTextHeight(
        element.content,
        width,
        12
      )

      return {
        width,
        height: Math.max(minHeight, estimatedHeight),
      }
    }

    case 'cta':
      return {
        width: Math.max(minWidth, 100),
        height: Math.max(minHeight, 32),
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