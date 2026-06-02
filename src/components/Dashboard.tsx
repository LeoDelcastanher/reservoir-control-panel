import { useState, useEffect } from 'react'
import ReservoirGauge from './ReservoirGauge'
import TransferControls from './TransferControls'
import TransferProgress from './TransferProgress'
import StatusBanner from './StatusBanner'
import { getReservoirs, startTransfer } from '../api'
import type { ReservoirId, ReservoirState, TransferState } from '../types'

type Alert = { type: 'warning' | 'danger' | 'info'; message: string }

const TRANSFER_RESET: TransferState = { status: 'idle', from: null, to: null, targetPercent: 0 }

export default function Dashboard() {
  const [reservoirs, setReservoirs] = useState<ReservoirState[]>([
    { id: 'a', name: 'RESERVOIR A', level: 0 },
    { id: 'b', name: 'RESERVOIR B', level: 0 },
  ])
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([])

  const [transfer, setTransfer] = useState<TransferState>(TRANSFER_RESET)

  // Poll levels every 2s
  useEffect(() => {
    function poll() {
      getReservoirs()
        .then(data => {
          setReservoirs([
            { id: 'a', name: 'RESERVOIR A', level: data.resA },
            { id: 'b', name: 'RESERVOIR B', level: data.resB },
          ])
          setLoading(false)
        })
        .catch(err => {
          setAlerts([{ type: 'danger', message: err instanceof Error ? err.message : 'Failed to load reservoir data' }])
          setLoading(false)
        })
    }
    poll()
    const id = setInterval(poll, 2000)
    return () => clearInterval(id)
  }, [])

  async function handleTransfer(from: ReservoirId, to: ReservoirId, percent: number) {
    setTransfer({ status: 'in_progress', from, to, targetPercent: percent })

    try {
      await startTransfer(from, to, percent)
    } catch (err) {
      setTransfer(t => ({ ...t, status: 'failed' }))
      setAlerts(prev => [...prev, { type: 'danger', message: err instanceof Error ? err.message : 'Failed to start transfer' }])
      setTimeout(() => setTransfer(TRANSFER_RESET), 2000)
      return
    }

    // Poll until both pumps stop — first confirm pump started to avoid false completion
    let pumpStarted = false
    const interval = setInterval(() => {
      getReservoirs()
        .then(data => {
          const pumping = data.pumpA || data.pumpB
          if (pumping) pumpStarted = true
          if (pumpStarted && !pumping) {
            clearInterval(interval)
            setTransfer(t => ({ ...t, status: 'complete' }))
            setTimeout(() => setTransfer(TRANSFER_RESET), 2000)
          }
        })
        .catch(err => {
          clearInterval(interval)
          setTransfer(t => ({ ...t, status: 'failed' }))
          setAlerts(prev => [...prev, { type: 'danger', message: err instanceof Error ? err.message : 'Transfer status check failed' }])
          setTimeout(() => setTransfer(TRANSFER_RESET), 2000)
        })
    }, 500)
  }

  const [testState, setTestState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [testResult, setTestResult] = useState<string>('')

  async function handleApiTest() {
    setTestState('loading')
    setTestResult('')
    try {
      const data = await getReservoirs()
      setTestResult(JSON.stringify(data))
      setTestState('ok')
    } catch (err) {
      setTestResult(err instanceof Error ? err.message : String(err))
      setTestState('error')
    }
    setTimeout(() => { setTestState('idle'); setTestResult('') }, 5000)
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
        <div className="d-flex align-items-center gap-2">
          {testResult && (
            <span
              className={`text-${testState === 'ok' ? 'success' : 'danger'}`}
              style={{ fontSize: '0.75rem', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              title={testResult}
            >
              {testResult}
            </span>
          )}
          <button
            className={`btn btn-sm ${testState === 'ok' ? 'btn-success' : testState === 'error' ? 'btn-danger' : 'btn-outline-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '2px 10px' }}
            disabled={testState === 'loading'}
            onClick={handleApiTest}
          >
            {testState === 'loading'
              ? <><i className="fas fa-spinner fa-spin me-1" />Testing…</>
              : testState === 'ok'
              ? <><i className="fas fa-circle-check me-1" />OK</>
              : testState === 'error'
              ? <><i className="fas fa-circle-xmark me-1" />Failed</>
              : 'Test API'}
          </button>
          <span className="text-white-50" style={{ fontSize: '0.8rem' }}>
            <i className="fas fa-circle text-success me-1" style={{ fontSize: '0.6rem' }} />
            ONLINE
          </span>
        </div>
      </div>

      {/* alerts */}
      <StatusBanner alerts={alerts} />

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
          <TransferControls transfer={transfer} onTransfer={handleTransfer} disabled={loading} />
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
