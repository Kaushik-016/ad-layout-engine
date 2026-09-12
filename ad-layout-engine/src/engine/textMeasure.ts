/*
 * Exact text measurement, shared by the engine (naturalSize.ts, which
 * decides how much box-space to reserve) and the renderer (SmartAdSurface's
 * fitFontSize, which decides what font size to actually draw at).
 *
 * Previously these were two independent approximations (`fontSize * 0.58`
 * per character), tuned by feel. They could — and did — disagree, because
 * an approximation has no way to know that bold (font-weight: 800) text is
 * measurably wider per character than the ratio assumed. That mismatch is
 * exactly what caused the headline to wrap to more lines than its box was
 * sized for, and get clipped.
 *
 * Using the browser's real `canvas.measureText` for BOTH sides removes the
 * possibility of disagreement entirely — there's only one source of truth
 * for "how wide is this text," not two guesses that can drift apart.
 */

let sharedCanvas: HTMLCanvasElement | null = null

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  if (!sharedCanvas) sharedCanvas = document.createElement('canvas')
  return sharedCanvas.getContext('2d')
}

const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'

export function measureTextWidth(
  text: string,
  fontSizePx: number,
  fontWeight: number
): number {
  const ctx = getMeasureContext()

  if (!ctx) {
    // Non-browser fallback (SSR/tests): a deliberately generous estimate
    // so we never UNDER-measure and clip — over-reserving space is safe,
    // under-reserving is the bug we're fixing.
    return text.length * fontSizePx * 0.62
  }

  ctx.font = `${fontWeight} ${fontSizePx}px ${FONT_FAMILY}`

  return ctx.measureText(text).width
}

/**
 * Greedily wraps `text` into lines that each fit within `maxWidth`, using
 * real measured widths — the same word-by-word logic a browser uses,
 * instead of dividing total length by an assumed "chars per line."
 */
export function wrapTextToLines(
  text: string,
  maxWidth: number,
  fontSizePx: number,
  fontWeight: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word
    const fits = measureTextWidth(attempt, fontSizePx, fontWeight) <= maxWidth

    if (fits || !current) {
      current = attempt
    } else {
      lines.push(current)
      current = word
    }
  }

  if (current) lines.push(current)

  return lines.length > 0 ? lines : ['']
}

export function measureWrappedHeight(
  text: string,
  maxWidth: number,
  fontSizePx: number,
  fontWeight: number,
  lineHeightRatio: number
): number {
  const lineCount = wrapTextToLines(text, maxWidth, fontSizePx, fontWeight).length
  return lineCount * fontSizePx * lineHeightRatio
}