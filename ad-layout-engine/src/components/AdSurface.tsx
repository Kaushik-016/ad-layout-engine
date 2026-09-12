import type { Ad, AdElement } from '../types/ad'
import { RealArtwork } from './RealArtwork'

interface AdSurfaceProps {
  ad: Ad
  surfaceWidth: number
  surfaceHeight: number
}

const BASE_WIDTH = 400
const BASE_HEIGHT = 400

function AdSurface({
  ad,
  surfaceWidth,
  surfaceHeight,
}: AdSurfaceProps) {
  const scale = Math.min(
    surfaceWidth / BASE_WIDTH,
    surfaceHeight / BASE_HEIGHT,
  )

  return (
    <div
      style={{
        width: surfaceWidth,
        height: surfaceHeight,
        border: '2px solid #333',
        overflow: 'hidden',
        position: 'relative',
        background: '#fafafa',
      }}
    >
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
          background: '#ddd',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <RealArtwork adId={ad.id} />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.56))',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 28,
            right: 28,
            bottom: 28,
            zIndex: 2,
            color: '#fff',
          }}
        >
          {ad.elements.map((el) => (
            <ElementBlock
              key={el.id}
              element={el}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ElementBlock({
  element,
}: {
  element: AdElement
}) {
  switch (element.type) {
    case 'headline':
      return (
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: 24,
            color: '#fff',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}
        >
          {element.content}
        </h2>
      )

    case 'subtext':
      return (
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 14,
            color: '#fff',
          }}
        >
          {element.content}
        </p>
      )

    case 'cta':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            background: '#fff',
            color: '#171717',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {element.content}
        </span>
      )

    default:
      return null
  }
}

export default AdSurface