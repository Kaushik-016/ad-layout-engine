import type { AdElement } from '../types/ad'
import type { PlacedElement } from './types'
import { getNaturalSize } from './naturalSize'

const PADDING = 12
const GAP = 8
const MIN_TEXT_SCALE = 0.65

type Direction = 'vertical' | 'horizontal'

const isFlexible = (el: AdElement) => el.type === 'image' || el.type === 'logo'
const isTextFlexible = (el: AdElement) => el.type === 'headline' || el.type === 'cta'

export function stackElements(
  elements: AdElement[],
  surfaceWidth: number,
  surfaceHeight: number,
  direction: Direction
): PlacedElement[] {
  let working = [...elements]

  const mainAxisLimit = direction === 'vertical' ? surfaceHeight : surfaceWidth
  const crossAxisLimit = direction === 'vertical' ? surfaceWidth : surfaceHeight
  const availableCrossWidth = direction === 'vertical' ? crossAxisLimit - PADDING * 2 : undefined

  const sizes = new Map(
    working.map((el) => {
      const n = getNaturalSize(el, availableCrossWidth)
      return [el.id, { width: n.width, height: n.height }]
    })
  )
  const naturalWidths = new Map(working.map((el) => [el.id, sizes.get(el.id)!.width]))
  const scales = new Map(working.map((el) => [el.id, 1]))

  const mainSize = (el: AdElement) => {
    const s = sizes.get(el.id)!
    return direction === 'vertical' ? s.height : s.width
  }

  const totalMain = () =>
    working.reduce((sum, el) => sum + mainSize(el), 0) + GAP * Math.max(0, working.length - 1) + PADDING * 2

  const hidden: AdElement[] = []

  while (totalMain() > mainAxisLimit) {
    // tier 1: shrink flexible visuals (image/logo) down to their minimum
    const shrinkable = working.filter((el) => {
      if (!isFlexible(el)) return false
      const minMain = direction === 'vertical' ? el.constraints.minHeight : el.constraints.minWidth
      return mainSize(el) > minMain
    })

    if (shrinkable.length > 0) {
      const excess = totalMain() - mainAxisLimit
      const shrinkPerElement = excess / shrinkable.length
      for (const el of shrinkable) {
        const s = sizes.get(el.id)!
        const minMain = direction === 'vertical' ? el.constraints.minHeight : el.constraints.minWidth
        if (direction === 'vertical') {
          const newHeight = Math.max(minMain, s.height - shrinkPerElement)
          const ratio = newHeight / s.height
          sizes.set(el.id, { width: el.constraints.lockAspectRatio ? s.width * ratio : s.width, height: newHeight })
        } else {
          const newWidth = Math.max(minMain, s.width - shrinkPerElement)
          const ratio = newWidth / s.width
          sizes.set(el.id, { width: newWidth, height: el.constraints.lockAspectRatio ? s.height * ratio : s.height })
        }
      }
      continue
    }

    // tier 2: drop the lowest-priority hideable element
    const droppable = working.filter((el) => el.constraints.canHide).sort((a, b) => b.priority - a.priority)
    if (droppable.length > 0) {
      const toDrop = droppable[0]
      working = working.filter((el) => el.id !== toDrop.id)
      hidden.push(toDrop)
      continue
    }

    // tier 3: last resort — compress headline/cta text down to a legible floor
    const textShrinkable = working.filter((el) => {
      if (!isTextFlexible(el)) return false
      const natural = naturalWidths.get(el.id)!
      return sizes.get(el.id)!.width > natural * MIN_TEXT_SCALE
    })

    if (textShrinkable.length > 0) {
      const excess = totalMain() - mainAxisLimit
      const shrinkPerElement = excess / textShrinkable.length
      for (const el of textShrinkable) {
        const s = sizes.get(el.id)!
        const natural = naturalWidths.get(el.id)!
        const floor = natural * MIN_TEXT_SCALE
        const newWidth = Math.max(floor, s.width - shrinkPerElement)
        sizes.set(el.id, { width: newWidth, height: s.height })
        scales.set(el.id, newWidth / natural)
      }
      continue
    }

    // truly nothing left to do — accept overflow, scoring will penalize it
    break
  }

  const placements: PlacedElement[] = []
  let cursor = PADDING

  for (const el of working) {
    const s = sizes.get(el.id)!
    let width = s.width
    let height = s.height

    if (direction === 'vertical') {
      width = Math.min(width, crossAxisLimit - PADDING * 2)
    } else {
      height = Math.min(height, crossAxisLimit - PADDING * 2)
    }

    const x = direction === 'vertical' ? (surfaceWidth - width) / 2 : cursor
    const y = direction === 'vertical' ? cursor : (surfaceHeight - height) / 2

    placements.push({ element: el, x, y, width, height, hidden: false, fontScale: scales.get(el.id) ?? 1 })
    cursor += (direction === 'vertical' ? height : width) + GAP
  }

  for (const el of hidden) {
    placements.push({ element: el, x: 0, y: 0, width: 0, height: 0, hidden: true, fontScale: 1 })
  }

  return placements
}