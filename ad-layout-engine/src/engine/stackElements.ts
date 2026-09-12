import type { AdElement } from '../types/ad'
import type { PlacedElement } from './types'
import { getNaturalSize } from './naturalSize'

const MIN_TEXT_SCALE = 0.62

type Direction = 'vertical' | 'horizontal'

const isText = (el: AdElement) =>
  el.type === 'headline' || el.type === 'subtext' || el.type === 'cta'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hiddenPlacement(element: AdElement): PlacedElement {
  return {
    element,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    hidden: true,
    fontScale: 1,
  }
}

function backgroundPlacement(
  element: AdElement,
  surfaceWidth: number,
  surfaceHeight: number,
): PlacedElement {
  return {
    element,
    x: 0,
    y: 0,
    width: surfaceWidth,
    height: surfaceHeight,
    hidden: false,
    fontScale: 1,
  }
}

function layoutVertical(
  elements: AdElement[],
  surfaceWidth: number,
  surfaceHeight: number,
): PlacedElement[] {
  const padding = clamp(Math.round(surfaceWidth * 0.08), 14, 28)
  const contentWidth = Math.max(1, surfaceWidth - padding * 2)

  const headline = elements.find((el) => el.type === 'headline')
  const subtext = elements.find((el) => el.type === 'subtext')
  const cta = elements.find((el) => el.type === 'cta')

  const tinySurface = surfaceHeight < 150

  const visible = [headline, subtext, cta].filter(
    (el): el is AdElement =>
      el !== undefined && !(tinySurface && el.type === 'subtext'),
  )

  const sizes = new Map<string, { width: number; height: number }>()

  for (const element of visible) {
    const natural = getNaturalSize(element, contentWidth)

    if (element.type === 'headline') {
      const width = Math.min(
        contentWidth,
        Math.max(150, Math.round(contentWidth * 0.96)),
      )

      sizes.set(element.id, {
        width,
        height: Math.max(34, natural.height),
      })
    } else if (element.type === 'subtext') {
      sizes.set(element.id, {
        width: Math.min(
          contentWidth,
          Math.max(140, Math.round(contentWidth * 0.9)),
        ),
        height: Math.max(24, natural.height),
      })
    } else {
      sizes.set(element.id, {
        width: clamp(
          Math.max(96, natural.width),
          96,
          Math.min(180, contentWidth),
        ),
        height: 34,
      })
    }
  }

  let gap = clamp(Math.round(surfaceHeight * 0.025), 7, 14)

  const availableHeight = Math.max(
    1,
    surfaceHeight - padding * 2,
  )

  const totalHeight = () =>
    visible.reduce(
      (sum, element) =>
        sum + (sizes.get(element.id)?.height ?? 0),
      0,
    ) +
    gap * Math.max(0, visible.length - 1)

  while (totalHeight() > availableHeight && gap > 4) {
    gap -= 1
  }

  while (totalHeight() > availableHeight) {
    const shrinkable = visible.filter((element) => {
      if (element.type === 'subtext') {
        return sizes.get(element.id)!.height > 20
      }

      if (element.type === 'headline') {
        return sizes.get(element.id)!.height > 30
      }

      return false
    })

    if (shrinkable.length === 0) {
      break
    }

    const excess = totalHeight() - availableHeight
    const perElement = excess / shrinkable.length

    for (const element of shrinkable) {
      const current = sizes.get(element.id)!

      const floor =
        element.type === 'headline'
          ? 30
          : 20

      sizes.set(element.id, {
        ...current,
        height: Math.max(
          floor,
          current.height - perElement,
        ),
      })
    }
  }

  const groupHeight = Math.min(
    totalHeight(),
    availableHeight,
  )

  const isTall =
    surfaceHeight / Math.max(surfaceWidth, 1) >= 1.65

  const startY = isTall
    ? clamp(
        surfaceHeight * 0.48,
        padding,
        surfaceHeight - groupHeight - padding,
      )
    : clamp(
        surfaceHeight - groupHeight - padding,
        padding,
        surfaceHeight - groupHeight - padding,
      )

  const placements: PlacedElement[] = []

  let cursor = startY

  for (const element of visible) {
    const size = sizes.get(element.id)!

    const width = Math.min(
      size.width,
      contentWidth,
    )

    const x = padding

    const natural = getNaturalSize(
      element,
      contentWidth,
    )

    placements.push({
      element,
      x,
      y: cursor,
      width,
      height: size.height,
      hidden: false,
      fontScale:
        element.type === 'headline'
          ? clamp(
              size.height /
                Math.max(natural.height, 1),
              MIN_TEXT_SCALE,
              1,
            )
          : 1,
    })

    cursor += size.height + gap
  }

  return placements
}

function layoutHorizontal(
  elements: AdElement[],
  surfaceWidth: number,
  surfaceHeight: number,
): PlacedElement[] {
  const padding = clamp(
    Math.round(surfaceHeight * 0.18),
    6,
    14,
  )

  const gap = clamp(
    Math.round(surfaceWidth * 0.025),
    8,
    14,
  )

  const contentHeight = Math.max(
    1,
    surfaceHeight - padding * 2,
  )

  const headline = elements.find(
    (el) => el.type === 'headline',
  )

  const subtext = elements.find(
    (el) => el.type === 'subtext',
  )

  const cta = elements.find(
    (el) => el.type === 'cta',
  )

  const tinyBanner = surfaceHeight <= 70

  const compactWide =
    surfaceWidth / Math.max(surfaceHeight, 1) >= 4

  const placements: PlacedElement[] = []

  if (headline) {
    const ctaWidth = cta
      ? clamp(
          Math.max(82, getNaturalSize(cta).width),
          82,
          120,
        )
      : 0

    const textWidth = Math.max(
      80,
      surfaceWidth -
        padding * 2 -
        ctaWidth -
        (cta ? gap : 0),
    )

    const naturalHeadline = getNaturalSize(
      headline,
      textWidth,
    )

    const headlineHeight = tinyBanner
      ? Math.max(24, contentHeight)
      : Math.min(
          contentHeight,
          Math.max(30, naturalHeadline.height),
        )

    placements.push({
      element: headline,
      x: padding,
      y: (surfaceHeight - headlineHeight) / 2,
      width: textWidth,
      height: headlineHeight,
      hidden: false,
      fontScale: tinyBanner
        ? clamp(
            textWidth /
              Math.max(naturalHeadline.width, 1),
            MIN_TEXT_SCALE,
            1,
          )
        : clamp(
            headlineHeight /
              Math.max(naturalHeadline.height, 1),
            MIN_TEXT_SCALE,
            1,
          ),
    })

    if (
      subtext &&
      !tinyBanner &&
      !compactWide &&
      surfaceHeight >= 90
    ) {
      const subtextWidth = Math.min(
        textWidth,
        Math.max(100, textWidth * 0.88),
      )

      const naturalSubtext = getNaturalSize(
        subtext,
        subtextWidth,
      )

      const subtextHeight = Math.min(
        contentHeight,
        Math.max(20, naturalSubtext.height),
      )

      const headlinePlacement =
        placements[placements.length - 1]

      placements.push({
        element: subtext,
        x: padding,
        y: Math.min(
          surfaceHeight -
            padding -
            subtextHeight,
          headlinePlacement.y +
            headlinePlacement.height +
            5,
        ),
        width: subtextWidth,
        height: subtextHeight,
        hidden: false,
        fontScale: 1,
      })
    } else if (subtext) {
      placements.push(
        hiddenPlacement(subtext),
      )
    }

    if (cta) {
      const width = ctaWidth

      const height = Math.min(
        34,
        Math.max(26, contentHeight),
      )

      placements.push({
        element: cta,
        x: surfaceWidth - padding - width,
        y: (surfaceHeight - height) / 2,
        width,
        height,
        hidden: false,
        fontScale: 1,
      })
    }
  }

  return placements
}

export function stackElements(
  elements: AdElement[],
  surfaceWidth: number,
  surfaceHeight: number,
  direction: Direction,
): PlacedElement[] {
  /*
   * The image is no longer a normal flow element.
   *
   * It represents the creative artwork/background and therefore gets the
   * entire surface. Headline, subtext and CTA are the actual elements
   * the adaptive engine needs to arrange.
   */
  const content = elements.filter((element) =>
    isText(element),
  )

  const contentPlacements =
    direction === 'vertical'
      ? layoutVertical(
          content,
          surfaceWidth,
          surfaceHeight,
        )
      : layoutHorizontal(
          content,
          surfaceWidth,
          surfaceHeight,
        )

  const byId = new Map(
    contentPlacements.map((placement) => [
      placement.element.id,
      placement,
    ]),
  )

  const result: PlacedElement[] = []

  for (const element of elements) {
    if (element.type === 'image') {
      result.push(
        backgroundPlacement(
          element,
          surfaceWidth,
          surfaceHeight,
        ),
      )

      continue
    }

    result.push(
      byId.get(element.id) ??
        hiddenPlacement(element),
    )
  }

  return result
}