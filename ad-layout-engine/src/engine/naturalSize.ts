import type { AdElement } from '../types/ad'

function estimateTextHeight(text: string, width: number, fontSize: number, lineHeight = 1.35): number {
  const avgCharWidth = fontSize * 0.58
  const charsPerLine = Math.max(1, Math.floor(width / avgCharWidth))
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine))
  return lines * fontSize * lineHeight + 4
}

function estimateSingleLineSize(text: string, fontSize: number, lineHeight = 1.35) {
  const avgCharWidth = fontSize * 0.58
  return {
    width: Math.ceil(text.length * avgCharWidth) + 8,
    height: fontSize * lineHeight + 4,
  }
}

export function getNaturalSize(element: AdElement, availableWidth?: number): { width: number; height: number } {
  switch (element.type) {
    case 'headline': {
      if (availableWidth !== undefined) {
        // vertical stack: text is allowed to wrap within the given width
        const width = Math.min(220, availableWidth)
        const height = estimateTextHeight(element.content, width, 18)
        return { width, height }
      }
      // horizontal row: headline must stay single-line; tier-3 shrinking handles fitting
      const single = estimateSingleLineSize(element.content, 18)
      return { width: Math.min(single.width, 220), height: single.height }
    }
    case 'subtext': {
      const width = Math.min(200, availableWidth ?? 200)
      const height = estimateTextHeight(element.content, width, 12)
      return { width, height }
    }
    case 'cta':
      return { width: 100, height: 32 }
    case 'image':
      return { width: 140, height: 140 }
    case 'logo':
      return { width: 40, height: 40 }
    default:
      return { width: element.constraints.minWidth, height: element.constraints.minHeight }
  }
}