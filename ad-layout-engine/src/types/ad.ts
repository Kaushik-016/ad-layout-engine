export type ElementType = 'image' | 'headline' | 'subtext' | 'cta' | 'logo'

export interface ElementConstraints {
  minWidth: number
  minHeight: number
  lockAspectRatio: boolean
  canHide: boolean // can this element be dropped entirely if space is too tight?
}

export interface AdElement {
  id: string
  type: ElementType
  content: string // text content, or an image URL for 'image'/'logo' types
  priority: number // 1 = highest priority, higher numbers = lower priority
  constraints: ElementConstraints
}

export interface Ad {
  id: string
  name: string
  elements: AdElement[]
}