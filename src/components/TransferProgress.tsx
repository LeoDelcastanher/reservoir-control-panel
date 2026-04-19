import type { TransferState } from '../types'

interface Props {
  transfer: TransferState
}

export default function TransferProgress({ transfer }: Props) {
  if (transfer.status === 'idle') return null

  const isRunning = transfer.status === 'in_progress'
  const isFailed = transfer.status === 'failed'
  const isComplete = transfer.status === 'complete'

  const barClass = isFailed ? 'bg-danger' : isComplete ? 'bg-success' : 'bg-primary progress-bar-striped progress-bar-animated'
  const label = isFailed ? 'Transfer failed' : isComplete ? 'Transfer complete' : `Transferring… ${transfer.progressPercent}%`
  const icon = isFailed ? 'fa-circle-exclamation' : isComplete ? 'fa-circle-check' : 'fa-spinner fa-spin'

  return (
    <div className="px-3 py-2" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="d-flex align-items-center gap-2 mb-1">
        <i className={`fas ${icon} text-white`} />
        <span className="text-white" style={{ fontSize: '0.9rem' }}>{label}</span>
      </div>
      <div className="progress" style={{ height: 10 }}>
        <div
          className={`progress-bar ${barClass}`}
          style={{ width: isRunning ? `${transfer.progressPercent}%` : '100%', transition: 'width 0.4s ease' }}
        />
      </div>
    </div>
  )
}
