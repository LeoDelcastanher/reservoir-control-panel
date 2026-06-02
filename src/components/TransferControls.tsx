import { useState } from 'react'
import type { ReservoirId, TransferState } from '../types'

interface Props {
  transfer: TransferState
  onTransfer: (from: ReservoirId, to: ReservoirId, percent: number) => void
  disabled?: boolean
}

export default function TransferControls({ transfer, onTransfer, disabled = false }: Props) {
  const [direction, setDirection] = useState<'a-to-b' | 'b-to-a'>('a-to-b')
  const [percent, setPercent] = useState(50)
  const [confirmAll, setConfirmAll] = useState(false)

  const isLocked = disabled || transfer.status === 'in_progress'
  const from: ReservoirId = direction === 'a-to-b' ? 'a' : 'b'
  const to: ReservoirId = direction === 'a-to-b' ? 'b' : 'a'

  function handleTransfer() {
    onTransfer(from, to, percent)
  }

  function handleTransferAll() {
    if (!confirmAll) { setConfirmAll(true); return }
    onTransfer(from, to, 100)
    setConfirmAll(false)
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3 px-2">

      {/* direction toggle */}
      <div className="d-flex align-items-center gap-2">
        <span className="text-white fw-bold" style={{ fontSize: '1.1rem', minWidth: 28 }}>A</span>
        <div className="btn-group" role="group">
          <button
            className={`btn btn-lg ${direction === 'a-to-b' ? 'btn-warning' : 'btn-outline-secondary'}`}
            style={{ minWidth: 56, fontSize: '1.3rem' }}
            disabled={isLocked}
            onClick={() => { setDirection('a-to-b'); setConfirmAll(false) }}
          >
            <i className="fas fa-arrow-right" />
          </button>
          <button
            className={`btn btn-lg ${direction === 'b-to-a' ? 'btn-warning' : 'btn-outline-secondary'}`}
            style={{ minWidth: 56, fontSize: '1.3rem' }}
            disabled={isLocked}
            onClick={() => { setDirection('b-to-a'); setConfirmAll(false) }}
          >
            <i className="fas fa-arrow-left" />
          </button>
        </div>
        <span className="text-white fw-bold" style={{ fontSize: '1.1rem', minWidth: 28, textAlign: 'right' }}>B</span>
      </div>

      {/* percent stepper */}
      <div className="d-flex flex-column align-items-center gap-1 w-100">
        <span className="text-white-50" style={{ fontSize: '0.8rem', letterSpacing: 1 }}>TRANSFER AMOUNT</span>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-light btn-lg"
            style={{ width: 56, height: 56, fontSize: '1.4rem' }}
            disabled={isLocked || percent <= 5}
            onClick={() => setPercent(p => Math.max(5, p - 5))}
          >
            <i className="fas fa-minus" />
          </button>
          <div
            className="text-white fw-bold text-center"
            style={{ fontSize: '2.4rem', minWidth: 90, lineHeight: 1 }}
          >
            {percent}%
          </div>
          <button
            className="btn btn-outline-light btn-lg"
            style={{ width: 56, height: 56, fontSize: '1.4rem' }}
            disabled={isLocked || percent >= 95}
            onClick={() => setPercent(p => Math.min(95, p + 5))}
          >
            <i className="fas fa-plus" />
          </button>
        </div>
        <input
          type="range"
          className="form-range w-100"
          min={5} max={95} step={5}
          value={percent}
          disabled={isLocked}
          onChange={e => setPercent(Number(e.target.value))}
          style={{ accentColor: '#ffc107' }}
        />
      </div>

      {/* transfer button */}
      <button
        className="btn btn-primary btn-lg w-100 py-3"
        style={{ fontSize: '1.1rem', letterSpacing: 1 }}
        disabled={isLocked}
        onClick={handleTransfer}
      >
        <i className="fas fa-water me-2" />
        TRANSFER {percent}%
      </button>

      {/* transfer all */}
      <button
        className={`btn btn-lg w-100 py-2 ${confirmAll ? 'btn-danger' : 'btn-outline-danger'}`}
        style={{ fontSize: '1rem', letterSpacing: 1 }}
        disabled={isLocked}
        onClick={handleTransferAll}
      >
        <i className={`fas ${confirmAll ? 'fa-exclamation-triangle' : 'fa-fill-drip'} me-2`} />
        {confirmAll ? 'TAP AGAIN TO CONFIRM' : 'TRANSFER ALL'}
      </button>
    </div>
  )
}
