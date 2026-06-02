import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

const DESIGN_W = 1024
const DESIGN_H = 600

export default function App() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <Dashboard />
      </div>
    </div>
  )
}
