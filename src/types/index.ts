export type ReservoirId = 'a' | 'b'

export interface ReservoirState {
  id: ReservoirId
  name: string
  level: number // 0–100
}

export type TransferStatus = 'idle' | 'in_progress' | 'complete' | 'failed'

export interface TransferState {
  status: TransferStatus
  from: ReservoirId | null
  to: ReservoirId | null
  targetPercent: number
}
