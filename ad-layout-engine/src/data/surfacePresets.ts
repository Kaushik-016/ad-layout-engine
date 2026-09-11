export interface SurfacePreset {
  id: string
  label: string
  width: number
  height: number
}

export const surfacePresets: SurfacePreset[] = [
  { id: 'square-post', label: 'Square Post', width: 300, height: 300 },
  { id: 'story', label: 'Instagram Story', width: 200, height: 400 },
  { id: 'leaderboard', label: 'Leaderboard Banner', width: 468, height: 60 },
  { id: 'skyscraper', label: 'Skyscraper', width: 120, height: 400 },
  { id: 'landscape', label: 'Landscape Card', width: 400, height: 220 },
  { id: 'mobile-banner', label: 'Mobile Banner', width: 320, height: 50 },
]