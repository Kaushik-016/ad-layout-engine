import { useState } from 'react'
import SmartAdSurface from './components/SmartAdSurface'
import { RealArtwork } from './components/RealArtwork'
import type { Ad } from './types/ad'
import './App.css'

type View = 'ads' | 'create' | 'workspace'

type SurfacePreset = {
  id: string
  label: string
  width: number
  height: number
}

const surfacePresets: SurfacePreset[] = [
  { id: 'square', label: 'Square Post', width: 300, height: 300 },
  { id: 'story', label: 'Instagram Story', width: 200, height: 400 },
  { id: 'leaderboard', label: 'Leaderboard Banner', width: 468, height: 60 },
  { id: 'skyscraper', label: 'Skyscraper', width: 120, height: 400 },
  { id: 'landscape', label: 'Landscape Card', width: 400, height: 220 },
  { id: 'mobile-banner', label: 'Mobile Banner', width: 320, height: 50 },
]

const sampleAds: Ad[] = [
  {
    id: 'summer-sale',
    name: 'Summer Sale',
    elements: [
      {
        id: 'headline',
        type: 'headline',
        content: 'Summer Sale — 50% Off',
        priority: 1,
        constraints: {
          minWidth: 100,
          minHeight: 30,
          lockAspectRatio: false,
          canHide: false,
        },
      },
      {
        id: 'image',
        type: 'image',
        content: '',
        priority: 1,
        constraints: {
          minWidth: 80,
          minHeight: 80,
          lockAspectRatio: true,
          canHide: false,
        },
      },
      {
        id: 'subtext',
        type: 'subtext',
        content: 'Limited time summer offer.',
        priority: 2,
        constraints: {
          minWidth: 80,
          minHeight: 20,
          lockAspectRatio: false,
          canHide: true,
        },
      },
      {
        id: 'cta',
        type: 'cta',
        content: 'Shop Now',
        priority: 1,
        constraints: {
          minWidth: 60,
          minHeight: 25,
          lockAspectRatio: false,
          canHide: false,
        },
      },
    ],
  },
  {
    id: 'discover',
    name: 'Discover Something Amazing',
    elements: [
      {
        id: 'headline',
        type: 'headline',
        content: 'Discover Something Amazing',
        priority: 1,
        constraints: {
          minWidth: 100,
          minHeight: 30,
          lockAspectRatio: false,
          canHide: false,
        },
      },
      {
        id: 'image',
        type: 'image',
        content: '',
        priority: 1,
        constraints: {
          minWidth: 80,
          minHeight: 80,
          lockAspectRatio: true,
          canHide: false,
        },
      },
      {
        id: 'subtext',
        type: 'subtext',
        content: 'Everything you need, all in one place.',
        priority: 2,
        constraints: {
          minWidth: 80,
          minHeight: 20,
          lockAspectRatio: false,
          canHide: true,
        },
      },
      {
        id: 'cta',
        type: 'cta',
        content: 'Explore Now',
        priority: 1,
        constraints: {
          minWidth: 60,
          minHeight: 25,
          lockAspectRatio: false,
          canHide: false,
        },
      },
    ],
  },
  {
    id: 'move-you',
    name: 'Sound Should Move You',
    elements: [
      {
        id: 'headline',
        type: 'headline',
        content: 'Sound should move you.',
        priority: 1,
        constraints: {
          minWidth: 100,
          minHeight: 30,
          lockAspectRatio: false,
          canHide: false,
        },
      },
      {
        id: 'image',
        type: 'image',
        content: '',
        priority: 1,
        constraints: {
          minWidth: 80,
          minHeight: 80,
          lockAspectRatio: true,
          canHide: false,
        },
      },
      {
        id: 'subtext',
        type: 'subtext',
        content: 'Immersive sound. Designed for every journey.',
        priority: 2,
        constraints: {
          minWidth: 80,
          minHeight: 20,
          lockAspectRatio: false,
          canHide: true,
        },
      },
      {
        id: 'cta',
        type: 'cta',
        content: 'Discover',
        priority: 1,
        constraints: {
          minWidth: 60,
          minHeight: 25,
          lockAspectRatio: false,
          canHide: false,
        },
      },
    ],
  },
]

function App() {
  const [view, setView] = useState<View>('ads')
  const [selectedAd, setSelectedAd] = useState<Ad>(sampleAds[0])
  const [activeCreative, setActiveCreative] = useState(0)

  const [selectedSurface, setSelectedSurface] =
    useState(surfacePresets[0])

  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')

  const [headline, setHeadline] = useState('')
  const [subtext, setSubtext] = useState('')
  const [cta, setCta] = useState('')

  const width =
    customWidth !== '' ? Number(customWidth) : selectedSurface.width

  const height =
    customHeight !== '' ? Number(customHeight) : selectedSurface.height

  const openAd = (ad: Ad) => {
    setSelectedAd(ad)
    setSelectedSurface(surfacePresets[0])
    setCustomWidth('')
    setCustomHeight('')
    setView('workspace')
  }

  const selectCreative = (index: number) => {
    setActiveCreative(index)
  }

  const previousCreative = () => {
    setActiveCreative((current) =>
      current === 0 ? sampleAds.length - 1 : current - 1
    )
  }

  const nextCreative = () => {
    setActiveCreative((current) =>
      current === sampleAds.length - 1 ? 0 : current + 1
    )
  }

  const selectSurface = (surface: SurfacePreset) => {
    setSelectedSurface(surface)
    setCustomWidth('')
    setCustomHeight('')
  }

  const updateElement = (type: string, content: string) => {
    setSelectedAd((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.type === type ? { ...element, content } : element
      ),
    }))
  }

  const getContent = (type: string) =>
    selectedAd.elements.find((element) => element.type === type)?.content ?? ''

  const createAd = () => {
    if (!headline.trim()) return

    const newAd: Ad = {
      id: `custom-${Date.now()}`,
      name: headline.trim(),
      elements: [
        {
          id: 'headline',
          type: 'headline',
          content: headline.trim(),
          priority: 1,
          constraints: {
            minWidth: 100,
            minHeight: 30,
            lockAspectRatio: false,
            canHide: false,
          },
        },
        {
          id: 'image',
          type: 'image',
          content: '',
          priority: 1,
          constraints: {
            minWidth: 80,
            minHeight: 80,
            lockAspectRatio: true,
            canHide: false,
          },
        },
        {
          id: 'subtext',
          type: 'subtext',
          content: subtext.trim(),
          priority: 2,
          constraints: {
            minWidth: 80,
            minHeight: 20,
            lockAspectRatio: false,
            canHide: true,
          },
        },
        {
          id: 'cta',
          type: 'cta',
          content: cta.trim() || 'Learn More',
          priority: 1,
          constraints: {
            minWidth: 60,
            minHeight: 25,
            lockAspectRatio: false,
            canHide: false,
          },
        },
      ],
    }

    setSelectedAd(newAd)
    setSelectedSurface(surfacePresets[0])
    setCustomWidth('')
    setCustomHeight('')
    setView('workspace')
  }

  const NavBar = () => (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          className="brand"
          onClick={() => setView('ads')}
          aria-label="Go to Ads"
        >
          <span className="brand-mark">A</span>
          <span className="brand-copy">
            <strong>Adaptive</strong>
            <span>Creative engine</span>
          </span>
        </button>

        <nav className="nav-links" aria-label="Primary navigation">
          <button
            className={view === 'ads' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('ads')}
          >
            Ads
          </button>

          <button
            className={view === 'create' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('create')}
          >
            Create
          </button>
        </nav>

        <div className="nav-status">
          <span className="status-dot" />
          Engine ready
        </div>
      </div>
    </header>
  )

  const AdsPage = () => {
    const ad = sampleAds[activeCreative]
    const headlineContent =
      ad.elements.find((element) => element.type === 'headline')?.content ?? ''
    const subtextContent =
      ad.elements.find((element) => element.type === 'subtext')?.content ?? ''
    const ctaContent =
      ad.elements.find((element) => element.type === 'cta')?.content ?? ''

    return (
      <main className="ads-page">
        <section className="creative-intro">
          <div>
            <div className="eyebrow">YOUR CREATIVES</div>
            <h1>Build once. Adapt everywhere.</h1>
            <p>
              Explore existing creatives or create your own ad. The engine
              automatically adapts each creative to different advertising
              surfaces.
            </p>
          </div>

          <button
            className="primary-button intro-create-button"
            onClick={() => setView('create')}
          >
            Create an ad
            <span>→</span>
          </button>
        </section>

        <section className="creative-showcase">
          <div className="showcase-heading">
            <div>
              <span className="eyebrow">YOUR CREATIVES</span>
              <h2>Recent ads</h2>
            </div>

            <div className="creative-count">
              <span>{String(activeCreative + 1).padStart(2, '0')}</span>
              <i>/</i>
              <span>{String(sampleAds.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className={`featured-creative creative-${activeCreative}`}>
            <button
              className="creative-nav creative-nav-left"
              onClick={previousCreative}
              aria-label="Previous creative"
            >
              <span>←</span>
            </button>

            <button
              className="featured-ad"
              onClick={() => openAd(ad)}
              aria-label={`Open ${ad.name}`}
            >
              <div className="featured-ad-art">
                <RealArtwork adId={ad.id} />
                <div className="featured-ad-scrim" />
              </div>

              <div className="featured-ad-copy">
                <span className="creative-tag">
                  ADAPTIVE CREATIVE · {surfacePresets.length} SURFACES
                </span>
                <h3>{headlineContent}</h3>
                <p>{subtextContent}</p>
              </div>

              <span className="featured-cta">
                {ctaContent}
                <b>↗</b>
              </span>
            </button>

            <button
              className="creative-nav creative-nav-right"
              onClick={nextCreative}
              aria-label="Next creative"
            >
              <span>→</span>
            </button>
          </div>

          <div className="creative-selector" aria-label="Creative selector">
            {sampleAds.map((item, index) => (
              <button
                key={item.id}
                className={
                  activeCreative === index
                    ? 'selector-dot selected'
                    : 'selector-dot'
                }
                onClick={() => selectCreative(index)}
                aria-label={`Show creative ${index + 1}`}
              >
                <span>0{index + 1}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="engine-note">
          <div className="engine-note-mark">✦</div>
          <div>
            <span className="eyebrow">ADAPTIVE CREATIVE ENGINE</span>
            <h2>The same creative, intelligently rebuilt for every surface.</h2>
            <p>
              The engine evaluates multiple layout strategies and selects the
              highest-scoring arrangement for each advertising dimension.
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={() => openAd(ad)}
          >
            Open selected ad
            <span>→</span>
          </button>
        </section>
      </main>
    )
  }

  const CreatePage = () => (
    <main className="page-shell">
      <button className="back-button" onClick={() => setView('ads')}>
        ← Back to ads
      </button>

      <section className="create-intro">
        <div className="eyebrow">NEW CREATIVE</div>
        <h1>Create your ad</h1>
        <p>
          Enter the core content. The adaptive engine will take care of the
          rest.
        </p>
      </section>

      <section className="create-layout">
        <div className="form-card">
          <div className="form-header">
            <span>01</span>
            <div>
              <h2>Ad content</h2>
              <p>What should your audience see?</p>
            </div>
          </div>

          <label className="field">
            <span>Headline</span>
            <input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Summer Sale — 50% Off"
            />
          </label>

          <label className="field">
            <span>Supporting text</span>
            <textarea
              value={subtext}
              onChange={(event) => setSubtext(event.target.value)}
              placeholder="A short description for your audience..."
              rows={4}
            />
          </label>

          <label className="field">
            <span>Call to action</span>
            <input
              value={cta}
              onChange={(event) => setCta(event.target.value)}
              placeholder="Shop Now"
            />
          </label>

          <div className="form-header surface-header">
            <span>02</span>
            <div>
              <h2>Preview surface</h2>
              <p>Choose where to preview your creative.</p>
            </div>
          </div>

          <div className="surface-grid">
            {surfacePresets.map((surface) => (
              <button
                key={surface.id}
                className={
                  selectedSurface.id === surface.id && customWidth === ''
                    ? 'surface-button selected'
                    : 'surface-button'
                }
                onClick={() => selectSurface(surface)}
              >
                <strong>{surface.label}</strong>
                <small>
                  {surface.width} × {surface.height}
                </small>
              </button>
            ))}
          </div>

          <div className="custom-dimensions">
            <span>Custom dimensions</span>
            <div>
              <input
                type="number"
                placeholder="Width"
                value={customWidth}
                onChange={(event) => setCustomWidth(event.target.value)}
              />
              <span>×</span>
              <input
                type="number"
                placeholder="Height"
                value={customHeight}
                onChange={(event) => setCustomHeight(event.target.value)}
              />
            </div>
          </div>

          <button
            className="generate-button"
            disabled={!headline.trim()}
            onClick={createAd}
          >
            Generate adaptive layout
            <span>→</span>
          </button>
        </div>

        <div className="create-side-panel">
          <div className="side-label">HOW IT WORKS</div>

          <div className="workflow-step">
            <span>01</span>
            <div>
              <strong>Enter content</strong>
              <p>Provide the headline, supporting copy and CTA.</p>
            </div>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>02</span>
            <div>
              <strong>Choose a surface</strong>
              <p>
                Select a standard advertising dimension or use a custom size.
              </p>
            </div>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <span>03</span>
            <div>
              <strong>Adaptive layout</strong>
              <p>
                The engine evaluates multiple strategies and selects the
                highest-scoring layout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )

  const WorkspacePage = () => (
    <main className="page-shell workspace-page">
      <button className="back-button" onClick={() => setView('ads')}>
        ← Back to ads
      </button>

      <section className="workspace-header">
        <div>
          <div className="eyebrow">ADAPTIVE WORKSPACE</div>
          <h1>{selectedAd.name}</h1>
          <p>
            Generate layouts and see how the same creative adapts to different
            surfaces.
          </p>
        </div>

        <div className="workspace-dimensions">
          <span>ACTIVE SURFACE</span>
          <strong>
            {width} × {height}
          </strong>
        </div>
      </section>

      <section className="workspace">
        <div className="preview-panel">
          <div className="preview-header">
            <div>
              <span>LIVE PREVIEW</span>
              <h2>Adaptive engine</h2>
            </div>

            <div className="engine-indicator">
              <span />
              Generating layout
            </div>
          </div>

          <div className="preview-canvas">
            <SmartAdSurface
              ad={selectedAd}
              surfaceWidth={width}
              surfaceHeight={height}
            />
          </div>
        </div>

        <aside className="workspace-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">
              <h2>Surface</h2>
              <p>Select a target advertising format.</p>
            </div>

            <div className="surface-list">
              {surfacePresets.map((surface) => (
                <button
                  key={surface.id}
                  className={
                    selectedSurface.id === surface.id && customWidth === ''
                      ? 'surface-list-button selected'
                      : 'surface-list-button'
                  }
                  onClick={() => selectSurface(surface)}
                >
                  <span>{surface.label}</span>
                  <small>
                    {surface.width} × {surface.height}
                  </small>
                </button>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="custom-label">
              <span>Custom size</span>
              <small>PX</small>
            </div>

            <div className="workspace-custom">
              <input
                type="number"
                value={customWidth}
                placeholder={String(selectedSurface.width)}
                onChange={(event) => setCustomWidth(event.target.value)}
              />
              <span>×</span>
              <input
                type="number"
                value={customHeight}
                placeholder={String(selectedSurface.height)}
                onChange={(event) => setCustomHeight(event.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">
              <h2>Content</h2>
              <p>Edit your creative in real time.</p>
            </div>

            <label className="field">
              <span>Headline</span>
              <input
                value={getContent('headline')}
                onChange={(event) =>
                  updateElement('headline', event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>Supporting text</span>
              <input
                value={getContent('subtext')}
                onChange={(event) =>
                  updateElement('subtext', event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>CTA</span>
              <input
                value={getContent('cta')}
                onChange={(event) =>
                  updateElement('cta', event.target.value)
                }
              />
            </label>
          </div>
        </aside>
      </section>
    </main>
  )

  return (
    <div className="app">
      <NavBar />
      {view === 'ads' && <AdsPage />}
      {view === 'create' && <CreatePage />}
      {view === 'workspace' && <WorkspacePage />}
    </div>
  )
}

export default App