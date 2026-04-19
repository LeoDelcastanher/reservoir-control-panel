import { useState } from 'react'
import ReservoirGauge from './ReservoirGauge'
import TransferControls from './TransferControls'
import TransferProgress from './TransferProgress'
import StatusBanner from './StatusBanner'
import type { ReservoirId, ReservoirState, TransferState } from '../types'

const MOCK_ALERTS: { type: 'warning' | 'danger' | 'info'; message: string }[] = [
  // { type: 'warning', message: 'Reservoir B near full' },
  // { type: 'danger', message: 'Sensor A offline' },
]

export default function Dashboard() {
  const [reservoirs, setReservoirs] = useState<ReservoirState[]>([
    { id: 'a', name: 'RESERVOIR A', level: 72 },
    { id: 'b', name: 'RESERVOIR B', level: 35 },
  ])

  const [transfer, setTransfer] = useState<TransferState>({
    status: 'idle',
    from: null,
    to: null,
    targetPercent: 0,
    progressPercent: 0,
  })

  function handleTransfer(from: ReservoirId, to: ReservoirId, percent: number) {
    setTransfer({ status: 'in_progress', from, to, targetPercent: percent, progressPercent: 0 })

    // simulate progress (mock — replaced by real API in Phase 4)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTransfer(t => ({ ...t, progressPercent: progress }))

      if (progress >= 100) {
        clearInterval(interval)
        setReservoirs(prev => {
          const src = prev.find(r => r.id === from)!
          const moved = (src.level * percent) / 100
          return prev.map(r => {
            if (r.id === from) return { ...r, level: Math.max(0, Math.round(r.level - moved)) }
            if (r.id === to) return { ...r, level: Math.min(100, Math.round(r.level + moved)) }
            return r
          })
        })
        setTransfer(t => ({ ...t, status: 'complete' }))
        setTimeout(() => setTransfer({ status: 'idle', from: null, to: null, targetPercent: 0, progressPercent: 0 }), 2000)
      }
    }, 200)
  }

  const [resA, resB] = reservoirs
  const activeFrom = transfer.from

  return (
    <div
      className="d-flex flex-column"
      style={{ width: 1024, height: 600, background: '#0f0f1a', overflow: 'hidden', userSelect: 'none' }}
    >
      {/* header */}
      <div
        className="d-flex align-items-center justify-content-between px-4"
        style={{ height: 52, background: '#16213e', borderBottom: '1px solid #0d6efd33' }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-water text-primary" style={{ fontSize: '1.2rem' }} />
          <span className="text-white fw-bold" style={{ fontSize: '1.1rem', letterSpacing: 2 }}>
            RESERVOIR CONTROL
          </span>
        </div>
        <span className="text-white-50" style={{ fontSize: '0.8rem' }}>
          <i className="fas fa-circle text-success me-1" style={{ fontSize: '0.6rem' }} />
          ONLINE
        </span>
      </div>

      {/* alerts */}
      <StatusBanner alerts={MOCK_ALERTS} />

      {/* main layout */}
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        {/* reservoir A */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ flex: 1, padding: '16px 24px' }}
        >
          <ReservoirGauge
            reservoir={resA}
            isSource={activeFrom === 'a'}
            isDestination={activeFrom === 'b'}
          />
        </div>

        {/* divider */}
        <div style={{ width: 1, background: '#0d6efd33', margin: '16px 0' }} />

        {/* transfer controls */}
        <div style={{ width: 280, padding: '12px 8px' }}>
          <TransferControls transfer={transfer} onTransfer={handleTransfer} />
        </div>

        {/* divider */}
        <div style={{ width: 1, background: '#0d6efd33', margin: '16px 0' }} />

        {/* reservoir B */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ flex: 1, padding: '16px 24px' }}
        >
          <ReservoirGauge
            reservoir={resB}
            isSource={activeFrom === 'b'}
            isDestination={activeFrom === 'a'}
          />
        </div>
      </div>

      {/* transfer progress bar */}
      <TransferProgress transfer={transfer} />
    </div>
  )
}
