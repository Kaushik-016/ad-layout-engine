import type React from 'react'
import discoverBuildings from '../assets/discover-buildings.png'
import soundHeadphones from '../assets/sound-headphones.png'

const ARTWORK_BY_AD: Record<
  string,
  string
> = {
  /*
   * Bright summer/beach photography chosen for the first creative.
   * It gives the headline enough clean visual space while still feeling
   * like a real commercial summer campaign.
   */
  'summer-sale':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',

  /*
   * These two are the exact images supplied for creatives 02 and 03.
   */
  discover: discoverBuildings,

  'move-you': soundHeadphones,
}

const FALLBACK_ARTWORK =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85'

export function RealArtwork({
  adId,
}: {
  adId: string
}) {
  const src =
    ARTWORK_BY_AD[adId] ??
    FALLBACK_ARTWORK

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition:
      adId === 'discover'
        ? 'center 58%'
        : 'center',
    display: 'block',
  }

  return (
    <img
      src={src}
      alt=""
      style={style}
    />
  )
}

export default RealArtwork