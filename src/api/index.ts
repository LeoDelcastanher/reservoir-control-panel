import type { ReservoirId } from '../types'

// ─── Paths ────────────────────────────────────────────────────────────────────
const PATHS = {
  reservoirs: '/reservoirs',
  transfer:   '/transfer',
}

// ─── Response types ───────────────────────────────────────────────────────────
export interface ReservoirsResponse {
  resA: number
  resB: number
  pumpA: boolean
  pumpB: boolean
}

// ─── Base client ──────────────────────────────────────────────────────────────
const HOST = import.meta.env.VITE_API_HOST as string
const BASE = `http://${HOST}`

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
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
export function getReservoirs(): Promise<ReservoirsResponse> {
  return request<ReservoirsResponse>(PATHS.reservoirs)
}

export function startTransfer(
  from: ReservoirId,
  to: ReservoirId,
  amount_percent: number,
): Promise<void> {
  return request<void>(PATHS.transfer, {
    method: 'POST',
    body: JSON.stringify({ from, to, amount_percent }),
  })
}
