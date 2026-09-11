import type { Ad } from '../types/ad'
import { generateLayout } from '../engine/generateLayout'
import { computeNaiveLayout } from '../engine/naiveLayout'
import { scoreLayout } from '../engine/scoreLayout'

interface SmartAdSurfaceProps {
  ad: Ad
  surfaceWidth: number
  surfaceHeight: number
}

function SmartAdSurface({ ad, surfaceWidth, surfaceHeight }: SmartAdSurfaceProps) {
  const layout = generateLayout(ad, surfaceWidth, surfaceHeight)

  const naivePlacements = computeNaiveLayout(ad, surfaceWidth, surfaceHeight)
  const naiveScore = scoreLayout({ placements: naivePlacements, surfaceWidth, surfaceHeight })
  const improvement = layout.score - naiveScore

  return (
    <div>
      <div
        style={{
          width: surfaceWidth,
          height: surfaceHeight,
          border: '2px solid #333',
          position: 'relative',
          background: '#fafafa',
          overflow: 'hidden',
        }}
      >
        {layout.placements
          .filter((p) => !p.hidden)
          .map((p) => (
            <div
              key={p.element.id}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: p.width,
                height: p.height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <ElementVisual type={p.element.type} content={p.element.content} fontScale={p.fontScale} />
            </div>
          ))}
      </div>

      <div style={{ marginTop: 8, fontSize: 12 }}>
        <div style={{ color: '#888', marginBottom: 4 }}>strategy: {layout.strategyName}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#1a73e8', fontWeight: 600 }}>Smart: {layout.score.toFixed(1)}</span>
          <span style={{ color: '#999' }}>Naive: {naiveScore.toFixed(1)}</span>
          <span style={{ color: improvement >= 0 ? '#188038' : '#c5221f', fontWeight: 600 }}>
            {improvement >= 0 ? '+' : ''}
            {improvement.toFixed(1)} pts
          </span>
        </div>
      </div>
    </div>
  )
}

function ElementVisual({
  type,
  content,
  fontScale = 1,
}: {
  type: string
  content: string
  fontScale?: number
}) {
  switch (type) {
    case 'headline':
      return (
        <h2
          style={{
            margin: 0,
            fontSize: 18 * fontScale,
            textAlign: 'center',
            color: '#1a1a1a',
            lineHeight: 1.35,
            overflowWrap: 'break-word',
            width: '100%',
          }}
        >
          {content}
        </h2>
      )
    case 'subtext':
      return (
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: '#555',
            textAlign: 'center',
            lineHeight: 1.35,
            overflowWrap: 'break-word',
            width: '100%',
          }}
        >
          {content}
        </p>
      )
    case 'cta':
      return (
        <button
          style={{
            width: '100%',
            height: '100%',
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 12 * fontScale,
          }}
        >
          {content}
        </button>
      )
    case 'image':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
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
            width: '100%',
            height: '100%',
            background: '#ccc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
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

export default SmartAdSurface