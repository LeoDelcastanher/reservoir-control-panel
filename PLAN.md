# Reservoir Control Panel — Implementation Plan

## Project Overview

A single-page web application for real-time monitoring and control of two water reservoirs. The frontend communicates via REST API (and WebSocket for live updates) with a backend that interfaces directly with pumps and sensors.

---

## Core Features

- Real-time display of water level for each reservoir
- Transfer water from Reservoir A → B or B → A
- Transfer by percentage (e.g., move 30% of source to destination)
- Full transfer (empty source into destination)
- Visual feedback during pump operation (in-progress state)
- Error/alert display (pump failure, sensor offline, overflow risk)

---

## Tech Stack Decisions (to confirm)

| Layer | Recommendation | Alternatives |
|---|---|---|
| Frontend framework | React + Vite | Vue, Svelte |
| Styling | Bootstrap + FontAwesome | CSS Modules |
| Real-time updates | WebSocket | SSE, polling |
| State management | Zustand | Redux, Context API |
| HTTP client | Axios | Fetch API |
| Backend (assumed) | Your existing API | — |

---

## Implementation Steps

### Phase 1 — Project Setup
- [ ] Initialize React + Vite project
- [ ] Install and configure Bootstrap + FontAwesome
- [ ] Set up environment variables (`VITE_API_BASE_URL`, `VITE_WS_URL`)
- [ ] Set up folder structure (`/components`, `/hooks`, `/api`, `/types`)
- [ ] Configure ESLint + Prettier

### Phase 2 — API Layer
- [ ] Define TypeScript types for API responses (reservoir state, transfer status)
- [ ] Create API client module (base URL, auth headers, error handling)
- [ ] Implement endpoints:
  - `GET /reservoirs` — fetch current levels for both reservoirs
  - `POST /transfer` — initiate a transfer (`{ from, to, amount_percent }`)
  - `GET /transfer/status` — poll or subscribe to active transfer state
- [ ] Set up WebSocket connection for live sensor data

### Phase 3 — UI Components
- [ ] `ReservoirGauge` — animated visual fill indicator with percentage label
- [ ] `TransferControls` — source/destination selector, percentage slider, full-transfer button
- [ ] `TransferProgress` — live progress bar shown during pump operation
- [ ] `StatusBanner` — alerts for errors, warnings (overflow risk, sensor offline)
- [ ] `Dashboard` — top-level layout combining all components

### Phase 4 — Real-Time Logic
- [ ] WebSocket hook (`useReservoirLevels`) — subscribes and updates state on each message
- [ ] Optimistic UI updates during transfer initiation
- [ ] Disable controls while a transfer is in progress
- [ ] Auto-reconnect logic for dropped WebSocket connections

### Phase 5 — Edge Cases & Validation
- [ ] Prevent transfer if source level is 0%
- [ ] Prevent transfer if destination is at 100% (overflow guard)
- [ ] Handle pump timeout / backend error response gracefully
- [ ] Confirm dialog for full-transfer action

### Phase 6 — Polish & Deployment
- [ ] Responsive layout (usable on tablet for on-site control)
- [ ] Loading skeletons for initial data fetch
- [ ] Dark/light mode (optional)
- [ ] Build and deploy (static host or Docker container)
- [ ] Environment-specific config for dev vs. production API URLs

---

## API Contract (Draft)

```
GET  /reservoirs
     → { a: { level_percent: number }, b: { level_percent: number } }

POST /transfer
     body: { from: "a"|"b", to: "a"|"b", amount_percent: number }
     → { transfer_id: string, status: "started" }

GET  /transfer/:id/status
     → { status: "in_progress"|"complete"|"failed", transferred_percent: number }

WS   /ws/reservoirs
     → streams { a: number, b: number } on sensor tick
```

---

## Open Questions (decide before coding)

1. Does the backend already exist, or do we build that too?
2. What authentication is needed (none, API key, user login)?
3. What polling/WebSocket frequency does the sensor support?
4. Should the UI prevent conflicting concurrent transfers at the API level, UI level, or both?
5. Is there a mobile/tablet form factor requirement?