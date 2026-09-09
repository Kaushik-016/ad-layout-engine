import AdSurface from './components/AdSurface'
import SmartAdSurface from './components/SmartAdSurface'
import { sampleAd } from './data/sampleAd'

const surfaces = [
  { label: 'Square (300×300)', width: 300, height: 300 },
  { label: 'Story (200×400)', width: 200, height: 400 },
  { label: 'Banner (468×60)', width: 468, height: 60 },
]

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Adaptive Layout Engine</h1>

      {surfaces.map((s) => (
        <div key={s.label} style={{ marginBottom: 32 }}>
          <h3>{s.label}</h3>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 12, color: '#888' }}>Naive (scale-to-fit)</p>
              <AdSurface ad={sampleAd} surfaceWidth={s.width} surfaceHeight={s.height} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#888' }}>Smart (constraint-based)</p>
              <SmartAdSurface ad={sampleAd} surfaceWidth={s.width} surfaceHeight={s.height} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App