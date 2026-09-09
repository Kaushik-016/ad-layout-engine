import type { AdElement } from '../types/ad'

function estimateTextHeight(text: string, width: number, fontSize: number, lineHeight = 1.35): number {
  const avgCharWidth = fontSize * 0.58
  const charsPerLine = Math.max(1, Math.floor(width / avgCharWidth))
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine))
  return lines * fontSize * lineHeight + 4 // small safety buffer
}

export function getNaturalSize(element: AdElement, availableWidth?: number): { width: number; height: number } {
  switch (element.type) {
    case 'headline': {
      const width = Math.min(220, availableWidth ?? 220)
      const height = estimateTextHeight(element.content, width, 20)
      return { width, height }
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