interface Alert {
  type: 'warning' | 'danger' | 'info'
  message: string
}

interface Props {
  alerts: Alert[]
}

export default function StatusBanner({ alerts }: Props) {
  if (alerts.length === 0) return null

  const iconMap = { warning: 'fa-triangle-exclamation', danger: 'fa-circle-xmark', info: 'fa-circle-info' }

  return (
    <div className="d-flex gap-2 px-3 py-1 flex-wrap" style={{ background: 'rgba(0,0,0,0.3)' }}>
      {alerts.map((alert, i) => (
        <span key={i} className={`badge bg-${alert.type} d-flex align-items-center gap-1 px-3 py-2`} style={{ fontSize: '0.85rem' }}>
          <i className={`fas ${iconMap[alert.type]}`} />
          {alert.message}
        </span>
      ))}
    </div>
  )
}
