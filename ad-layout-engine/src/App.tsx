import { useState } from 'react'
import AdSurface from './components/AdSurface'
import SmartAdSurface from './components/SmartAdSurface'
import { sampleAd } from './data/sampleAd'
import { surfacePresets } from './data/surfacePresets'

function App() {
  const [selectedId, setSelectedId] = useState(surfacePresets[0].id)
  const [customWidth, setCustomWidth] = useState<number | null>(null)
  const [customHeight, setCustomHeight] = useState<number | null>(null)

  const preset = surfacePresets.find((p) => p.id === selectedId)!
  const width = customWidth ?? preset.width
  const height = customHeight ?? preset.height

  const handlePresetClick = (id: string) => {
    setSelectedId(id)
    setCustomWidth(null)
    setCustomHeight(null)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Adaptive Layout Engine</h1>
      <p style={{ color: '#666' }}>
        Pick a surface, or type a custom size, and watch the layout re-flow in real time.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {surfacePresets.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePresetClick(p.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: selectedId === p.id && !customWidth ? '2px solid #1a73e8' : '1px solid #ccc',
              background: selectedId === p.id && !customWidth ? '#eaf1fd' : 'white',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {p.label}
            <span style={{ color: '#999', marginLeft: 6 }}>
              {p.width}×{p.height}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
        <label style={{ fontSize: 13, color: '#555' }}>
          Custom width:{' '}
          <input
            type="number"
            placeholder={String(preset.width)}
            value={customWidth ?? ''}
            onChange={(e) => setCustomWidth(e.target.value ? Number(e.target.value) : null)}
            style={{ width: 70, padding: 4 }}
          />
        </label>
        <label style={{ fontSize: 13, color: '#555' }}>
          Custom height:{' '}
          <input
            type="number"
            placeholder={String(preset.height)}
            value={customHeight ?? ''}
            onChange={(e) => setCustomHeight(e.target.value ? Number(e.target.value) : null)}
            style={{ width: 70, padding: 4 }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Naive (scale-to-fit)</p>
          <AdSurface ad={sampleAd} surfaceWidth={width} surfaceHeight={height} />
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Smart (constraint-based)</p>
          <SmartAdSurface ad={sampleAd} surfaceWidth={width} surfaceHeight={height} />
        </div>
      </div>
    </div>
  )
}

export default App