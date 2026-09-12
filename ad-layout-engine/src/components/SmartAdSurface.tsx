import { useState } from 'react'
import type React from 'react'
import type { Ad } from '../types/ad'
import type { PlacedElement } from '../engine/types'
import { generateLayout } from '../engine/generateLayout'
import { computeNaiveLayout } from '../engine/naiveLayout'
import { scoreLayout } from '../engine/scoreLayout'
import AdSurface from './AdSurface'
import { RealArtwork } from './RealArtwork'

interface SmartAdSurfaceProps {
  ad: Ad
  surfaceWidth: number
  surfaceHeight: number
}

function SmartAdSurface({
  ad,
  surfaceWidth,
  surfaceHeight,
}: SmartAdSurfaceProps) {
  const [showComparison, setShowComparison] =
    useState(false)

  const layout = generateLayout(
    ad,
    surfaceWidth,
    surfaceHeight,
  )

  const naivePlacements = computeNaiveLayout(
    ad,
    surfaceWidth,
    surfaceHeight,
  )

  const naiveScore = scoreLayout({
    placements: naivePlacements,
    surfaceWidth,
    surfaceHeight,
  })

  const improvement =
    layout.score - naiveScore

  return (
    <div>
      <p
        style={{
          fontSize: 11,
          color: '#888',
          margin: '0 0 6px',
          letterSpacing: '.01em',
        }}
      >
        Adaptive engine · {layout.strategyName}
      </p>

      <CreativeCanvas
        ad={ad}
        width={surfaceWidth}
        height={surfaceHeight}
        placements={layout.placements}
        strategyName={layout.strategyName}
      />

      <button
        onClick={() =>
          setShowComparison((value) => !value)
        }
        style={{
          marginTop: 8,
          fontSize: 12,
          color: '#1a73e8',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {showComparison
          ? 'Hide comparison ▴'
          : 'Compare with standard scaling ▾'}
      </button>

      {showComparison && (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 24,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: '#888',
                margin: '0 0 4px',
              }}
            >
              Standard scaling
            </p>

            <AdSurface
              ad={ad}
              surfaceWidth={surfaceWidth}
              surfaceHeight={surfaceHeight}
            />
          </div>

          <div
            style={{
              fontSize: 12,
              paddingTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                color: '#888',
                marginBottom: 4,
              }}
            >
              strategy: {layout.strategyName}
            </div>

            <span
              style={{
                color: '#1a73e8',
                fontWeight: 600,
              }}
            >
              Adaptive engine:{' '}
              {layout.score.toFixed(1)}
            </span>

            <span
              style={{
                color: '#999',
              }}
            >
              Standard scaling:{' '}
              {naiveScore.toFixed(1)}
            </span>

            <span
              style={{
                color:
                  improvement >= 0
                    ? '#188038'
                    : '#c5221f',
                fontWeight: 600,
              }}
            >
              {improvement >= 0 ? '+' : ''}
              {improvement.toFixed(1)} pts
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

interface CreativeCanvasProps {
  ad: Ad
  width: number
  height: number
  placements: PlacedElement[]
  strategyName: string
}

function CreativeCanvas({
  ad,
  width,
  height,
  placements,
  strategyName,
}: CreativeCanvasProps) {
  const textColor = '#ffffff'

  const isTiny = height <= 70

  const isWide =
    width / Math.max(height, 1) >= 1.5

  const isTall =
    height / Math.max(width, 1) >= 1.55

  /*
   * This is deliberately an overlay rather than a card/panel.
   *
   * The artwork remains the actual creative and the gradient only improves
   * readability where the adaptive copy happens to land.
   */
  const overlay = isTiny
    ? 'linear-gradient(90deg, rgba(0,0,0,.56) 0%, rgba(0,0,0,.20) 58%, rgba(0,0,0,.05) 100%)'
    : isTall
      ? 'linear-gradient(180deg, rgba(0,0,0,.06) 15%, rgba(0,0,0,.10) 42%, rgba(0,0,0,.70) 100%)'
      : isWide
        ? 'linear-gradient(90deg, rgba(0,0,0,.68) 0%, rgba(0,0,0,.34) 48%, rgba(0,0,0,.05) 100%)'
        : 'linear-gradient(180deg, rgba(0,0,0,.02) 10%, rgba(0,0,0,.16) 46%, rgba(0,0,0,.70) 100%)'

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #222',
        borderRadius:
          width > 180 && height > 100
            ? 16
            : 3,
        boxSizing: 'border-box',
        background: '#222',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <RealArtwork adId={ad.id} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {placements
        .filter(
          (placement) =>
            !placement.hidden &&
            placement.element.type !== 'image',
        )
        .map((placement) => (
          <PlacedVisual
            key={placement.element.id}
            placement={placement}
            color={textColor}
            surfaceWidth={width}
            surfaceHeight={height}
            strategyName={strategyName}
          />
        ))}
    </div>
  )
}

function fitFontSize(
  text: string,
  boxWidth: number,
  boxHeight: number,
  options: {
    maxFont: number
    minFont: number
    lineHeight: number
    allowWrap: boolean
  },
): number {
  const CHAR_WIDTH_RATIO = 0.58

  for (
    let fontSize = options.maxFont;
    fontSize >= options.minFont;
    fontSize -= 1
  ) {
    const avgCharWidth =
      fontSize * CHAR_WIDTH_RATIO

    const charsPerLine =
      options.allowWrap
        ? Math.max(
            1,
            Math.floor(
              boxWidth / avgCharWidth,
            ),
          )
        : text.length || 1

    const lines = options.allowWrap
      ? Math.max(
          1,
          Math.ceil(
            text.length / charsPerLine,
          ),
        )
      : 1

    const requiredHeight =
      lines *
      fontSize *
      options.lineHeight

    const requiredWidth =
      options.allowWrap
        ? Math.min(
            text.length,
            charsPerLine,
          ) * avgCharWidth
        : text.length * avgCharWidth

    if (
      requiredHeight <= boxHeight &&
      (options.allowWrap ||
        requiredWidth <= boxWidth)
    ) {
      return fontSize
    }
  }

  return options.minFont
}

function PlacedVisual({
  placement,
  color,
  surfaceWidth,
  surfaceHeight,
  strategyName,
}: {
  placement: PlacedElement
  color: string
  surfaceWidth: number
  surfaceHeight: number
  strategyName: string
}) {
  const {
    element,
    x,
    y,
    width,
    height,
    fontScale,
  } = placement

  const safeWidth = Math.max(1, width)
  const safeHeight = Math.max(1, height)

  const tiny = surfaceHeight <= 70

  const wide =
    surfaceWidth /
      Math.max(surfaceHeight, 1) >=
    1.5

  const allowWrap =
    !tiny &&
    strategyName === 'vertical-stack'

  const fontSize =
    element.type === 'headline'
      ? fitFontSize(
          element.content,
          safeWidth,
          safeHeight,
          {
            maxFont: tiny
              ? 17
              : wide
                ? 28
                : 34,
            minFont: tiny ? 8 : 11,
            lineHeight: 1.05,
            allowWrap,
          },
        ) *
        Math.max(fontScale, 0.62)
      : element.type === 'subtext'
        ? fitFontSize(
            element.content,
            safeWidth,
            safeHeight,
            {
              maxFont: 14,
              minFont: 9,
              lineHeight: 1.2,
              allowWrap: true,
            },
          )
        : Math.max(
            8,
            Math.min(
              17,
              safeHeight * 0.52,
            ),
          )

  const common: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: safeWidth,
    height: safeHeight,
    zIndex: 5,
    boxSizing: 'border-box',
    overflow: 'hidden',
  }

  if (element.type === 'headline') {
    return (
      <div
        style={{
          ...common,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <h2
          style={{
            margin: 0,
            width: '100%',
            color,
            fontSize,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.045em',
            textAlign: 'left',
            whiteSpace: allowWrap
              ? 'normal'
              : 'nowrap',
            overflow: 'hidden',
            textOverflow: allowWrap
              ? 'clip'
              : 'ellipsis',
            overflowWrap: allowWrap
              ? 'break-word'
              : 'normal',
            textShadow:
              '0 2px 12px rgba(0,0,0,.42)',
          }}
        >
          {element.content}
        </h2>
      </div>
    )
  }

  if (element.type === 'subtext') {
    return (
      <div
        style={{
          ...common,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <p
          style={{
            margin: 0,
            width: '100%',
            color,
            fontSize,
            lineHeight: 1.2,
            textAlign: 'left',
            overflowWrap: 'break-word',
            textShadow:
              '0 1px 8px rgba(0,0,0,.40)',
          }}
        >
          {element.content}
        </p>
      </div>
    )
  }

  if (element.type === 'cta') {
    return (
      <div
        style={{
          ...common,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: tiny ? 24 : 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: tiny
              ? '0 8px'
              : '0 14px',
            boxSizing: 'border-box',
            borderRadius: 999,
            background: '#ffffff',
            color: '#171717',
            border:
              '1px solid rgba(255,255,255,.9)',
            boxShadow:
              '0 6px 18px rgba(0,0,0,.20)',
            fontSize,
            fontWeight: 750,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {element.content}
        </div>
      </div>
    )
  }

  return null
}

export default SmartAdSurface