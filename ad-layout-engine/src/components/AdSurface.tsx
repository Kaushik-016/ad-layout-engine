import type { Ad, AdElement } from '../types/ad'

interface AdSurfaceProps {
  ad: Ad
  surfaceWidth: number
  surfaceHeight: number
}

const BASE_WIDTH = 400
const BASE_HEIGHT = 400

function AdSurface({ ad, surfaceWidth, surfaceHeight }: AdSurfaceProps) {
  // uniform scale factor so nothing gets distorted, just shrunk/enlarged
  const scale = Math.min(surfaceWidth / BASE_WIDTH, surfaceHeight / BASE_HEIGHT)

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        {ad.elements.map((el) => (
          <ElementBlock key={el.id} element={el} />
        ))}
      </div>
    </div>
  )
}

function ElementBlock({ element }: { element: AdElement }) {
  switch (element.type) {
    case 'headline':
      return <h2 style={{ margin: 0, fontSize: 24, color: '#1a1a1a', lineHeight: 1.35 }}>{element.content}</h2>
    case 'subtext':
      return <p style={{ margin: 0, fontSize: 14, color: '#555' }}>{element.content}</p>
    case 'cta':
      return (
        <button
          style={{
            padding: '8px 16px',
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {element.content}
        </button>
      )
    case 'image':
      return (
        <div
          style={{
            width: 120,
            height: 120,
            background: '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#888',
          }}
        >
          image
        </div>
      )
    case 'logo':
      return (
        <div
          style={{
            width: 40,
            height: 40,
            background: '#ccc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: '#888',
          }}
        >
          logo
        </div>
      )
    default:
      return null
  }
}

export default AdSurface