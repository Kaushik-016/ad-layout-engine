import { useState } from 'react'
import SmartAdSurface from './components/SmartAdSurface'
import { sampleAd } from './data/sampleAd'
import { surfacePresets } from './data/surfacePresets'
import type { Ad } from './types/ad'

function App() {
  const [selectedId, setSelectedId] = useState(surfacePresets[0].id)
  const [customWidth, setCustomWidth] = useState<number | null>(null)
  const [customHeight, setCustomHeight] = useState<number | null>(null)
  const [ad, setAd] = useState<Ad>(sampleAd)

  const preset = surfacePresets.find((p) => p.id === selectedId)!
  const width = customWidth ?? preset.width
  const height = customHeight ?? preset.height

  const handlePresetClick = (id: string) => {
    setSelectedId(id)
    setCustomWidth(null)
    setCustomHeight(null)
  }

  const updateElementContent = (elementId: string, newContent: string) => {
    setAd((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === elementId ? { ...el, content: newContent } : el)),
    }))
  }

  const getContent = (elementId: string) => ad.elements.find((el) => el.id === elementId)?.content ?? ''

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Adaptive Layout Engine</h1>
      <p style={{ color: '#666' }}>
        Enter your own ad content, pick a surface (or a custom size), and watch it adapt in real time.
      </p>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          background: '#fafafa',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: 14, color: '#333' }}>Your ad content</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ad.elements
            .filter((el) => el.type === 'headline' || el.type === 'subtext' || el.type === 'cta')
            .map((el) => (
              <label key={el.id} style={{ fontSize: 13, color: '#555' }}>
                {el.type === 'headline' && 'Headline'}
                {el.type === 'subtext' && 'Subtext'}
                {el.type === 'cta' && 'CTA button text'}
                <input
                  type="text"
                  value={getContent(el.id)}
                  onChange={(e) => updateElementContent(el.id, e.target.value)}
                  style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, boxSizing: 'border-box' }}
                />
              </label>
            ))}
        </div>
      </div>

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

      <SmartAdSurface ad={ad} surfaceWidth={width} surfaceHeight={height} />
    </div>
  )
}

export default App