import type { ReservoirState } from '../types'

interface Props {
  reservoir: ReservoirState
  isSource: boolean
  isDestination: boolean
}

export default function ReservoirGauge({ reservoir, isSource, isDestination }: Props) {
  const { name, level } = reservoir

  const fillColor =
    level > 75 ? '#0d6efd' :
    level > 40 ? '#0dcaf0' :
    level > 15 ? '#ffc107' : '#dc3545'

  let borderClass = 'border-secondary'
  if (isSource) borderClass = 'border-warning'
  if (isDestination) borderClass = 'border-primary'

  return (
    <div className="d-flex flex-column align-items-center h-100 w-100">
      <h4 className="text-white fw-bold mb-2" style={{ fontSize: '1.4rem', letterSpacing: 2 }}>
        {name}
      </h4>

      <div
        className={`border border-3 ${borderClass} rounded position-relative overflow-hidden`}
        style={{ width: 160, flex: 1, maxHeight: 360, background: '#1a1a2e' }}
      >
        {/* water fill */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${level}%`,
            background: fillColor,
            transition: 'height 0.6s ease, background 0.4s ease',
            opacity: 0.85,
          }}
        />

        {/* percentage label */}
        <div
          className="position-absolute w-100 text-center fw-bold"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '2.2rem',
            color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            zIndex: 1,
          }}
        >
          {level}%
        </div>

        {/* tick marks */}
        {[25, 50, 75].map(tick => (
          <div
            key={tick}
            style={{
              position: 'absolute',
              bottom: `${tick}%`,
              left: 0,
              right: 0,
              borderTop: '1px dashed rgba(255,255,255,0.25)',
              zIndex: 2,
            }}
          />
        ))}
      </div>

      {/* role badge */}
      <div className="mt-2" style={{ minHeight: 28 }}>
        {isSource && (
          <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: '0.85rem' }}>
            <i className="fas fa-arrow-up me-1" /> SOURCE
          </span>
        )}
        {isDestination && (
          <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.85rem' }}>
            <i className="fas fa-arrow-down me-1" /> DESTINATION
          </span>
        )}
      </div>
    </div>
  )
}
