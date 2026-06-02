# Reservoir Control Panel

Single-page touchscreen UI for monitoring and controlling two water reservoirs. Built with React + Vite, designed for a Raspberry Pi 1024×600 display.

## Setup

```bash
npm install
npm run dev
```

Configure the API host in `.env`:

```
VITE_API_HOST=192.168.68.115:1880
```

---

## API Contract — v1

### `GET /reservoir-volume/:id`

Returns the current state of a single reservoir. `:id` is `a` or `b`.

**Response**
```json
{
  "id": 1,
  "name": "Reservoir A",
  "volume": 72
}
```

| Field    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `id`     | Int    | Unique identifier of the reservoir   |
| `name`   | String | Display name of the reservoir        |
| `volume` | Int    | Current fill level, percentage 0–100 |

---

### `POST /transfer`

Initiates a water transfer between reservoirs.

**Request body**
```json
{
  "from": 1,
  "to": 2,
  "amount_percent": 30
}
```

**Response**
```json
{
  "transfer_id": "abc123",
  "status": "started"
}
```

---

### `GET /transfer/:id/status`

Polls the status of an active transfer.

**Response**
```json
{
  "status": "in_progress",
  "transferred_percent": 45
}
```

| `status` value  | Meaning                        |
|-----------------|--------------------------------|
| `in_progress`   | Pump is running                |
| `complete`      | Transfer finished successfully |
| `failed`        | Pump error or timeout          |

---

### `WS /ws/reservoirs`

WebSocket stream. Emits on every sensor tick while idle.

**Message**
```json
{
  "a": 72,
  "b": 35
}
```
