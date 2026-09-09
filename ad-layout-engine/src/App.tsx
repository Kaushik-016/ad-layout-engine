import AdSurface from './components/AdSurface'
import { sampleAd } from './data/sampleAd'

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Adaptive Layout Engine</h1>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <p>Square (300×300)</p>
          <AdSurface ad={sampleAd} surfaceWidth={300} surfaceHeight={300} />
        </div>
        <div>
          <p>Story (200×400)</p>
          <AdSurface ad={sampleAd} surfaceWidth={200} surfaceHeight={400} />
        </div>
        <div>
          <p>Banner (468×60)</p>
          <AdSurface ad={sampleAd} surfaceWidth={468} surfaceHeight={60} />
        </div>
      </div>
    </div>
  )
}

export default App