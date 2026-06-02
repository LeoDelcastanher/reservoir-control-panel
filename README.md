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

### `GET /reservoirs`

Returns current volume and pump state for both reservoirs. Polled every 2s for live level updates. Also polled every 500ms during a transfer to detect pump completion.

**Response**
```json
{
  "resA": 72,
  "resB": 35,
  "pumpA": false,
  "pumpB": false
}
```

| Field   | Type    | Description                              |
|---------|---------|------------------------------------------|
| `resA`  | Int     | Reservoir A fill level, percentage 0–100 |
| `resB`  | Int     | Reservoir B fill level, percentage 0–100 |
| `pumpA` | Boolean | Whether pump A is currently running      |
| `pumpB` | Boolean | Whether pump B is currently running      |

---

### `POST /transfer`

Initiates a water transfer between reservoirs.

**Request body**
```json
{
  "from": "a",
  "to": "b",
  "amount_percent": 30
}
```
