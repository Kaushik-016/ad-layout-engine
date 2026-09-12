import type { Ad } from '../types/ad'

type AdCardProps = {
  ad: Ad
  onOpen: () => void
}

function getElement(ad: Ad, type: string) {
  return ad.elements.find((element) => element.type === type)
}

function AdCard({ ad, onOpen }: AdCardProps) {
  const headline = getElement(ad, 'headline')?.content ?? ''
  const subtext = getElement(ad, 'subtext')?.content ?? ''
  const cta = getElement(ad, 'cta')?.content ?? ''

  return (
    <article className="ad-card">
      <button
        className="ad-card-preview"
        onClick={onOpen}
        aria-label={`Open ${ad.name}`}
      >
        <div className="ad-card-glow" />

        <div className="mini-ad">
          <span className="mini-ad-brand">ADAPTIVE</span>

          <strong>{headline}</strong>

          <p>{subtext}</p>

          <span className="mini-ad-cta">{cta}</span>
        </div>
      </button>

      <div className="ad-card-footer">
        <div>
          <h3>{ad.name}</h3>
          <p>Adaptive creative · {ad.elements.length} elements</p>
        </div>

        <button
          className="open-ad-button"
          onClick={onOpen}
        >
          View layouts
          <span>→</span>
        </button>
      </div>
    </article>
  )
}

export default AdCard