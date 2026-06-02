import type { ReservoirId, TransferStatus } from '../types'

// ─── Paths ────────────────────────────────────────────────────────────────────
const PATHS = {
  reservoir:      (id: ReservoirId) => `/reservoir-volume/${id}`,
  transfer:       '/transfer',
  transferStatus: (id: string) => `/transfer/${id}/status`,
  wsReservoirs:   '/ws/reservoirs',
}

// ─── Response types ───────────────────────────────────────────────────────────
export interface ReservoirResponse {
  level_percent: number
}

export interface StartTransferResponse {
  transfer_id: string
  status: 'started'
}

export interface TransferStatusResponse {
  status: TransferStatus
  transferred_percent: number
}

export interface ReservoirStreamMessage {
  a: number
  b: number
}

// ─── Base client ──────────────────────────────────────────────────────────────
const HOST = import.meta.env.VITE_API_HOST as string
const BASE = `http://${HOST}`
const WS_BASE = `ws://${HOST}`

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new ApiError(res.status, `${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── REST endpoints ───────────────────────────────────────────────────────────
export function getReservoir(id: ReservoirId): Promise<ReservoirResponse> {
  return request<ReservoirResponse>(PATHS.reservoir(id))
}

export function getReservoirs(): Promise<[ReservoirResponse, ReservoirResponse]> {
  return Promise.all([getReservoir('a'), getReservoir('b')])
}

export function startTransfer(
  from: ReservoirId,
  to: ReservoirId,
  amount_percent: number,
): Promise<StartTransferResponse> {
  return request<StartTransferResponse>(PATHS.transfer, {
    method: 'POST',
    body: JSON.stringify({ from, to, amount_percent }),
  })
}

export function getTransferStatus(id: string): Promise<TransferStatusResponse> {
  return request<TransferStatusResponse>(PATHS.transferStatus(id))
}

// ─── WebSocket ────────────────────────────────────────────────────────────────
export function createReservoirSocket(
  onMessage: (data: ReservoirStreamMessage) => void,
  onError?: (e: Event) => void,
): WebSocket {
  const ws = new WebSocket(`${WS_BASE}${PATHS.wsReservoirs}`)
  ws.onmessage = (e: MessageEvent) => {
    try {
      onMessage(JSON.parse(e.data as string) as ReservoirStreamMessage)
    } catch {
      // malformed frame — ignore
    }
  }
  if (onError) ws.onerror = onError
  return ws
}
