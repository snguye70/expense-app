import { useEffect, useState } from 'react'
import { CameraView, PhotoCrop, RECEIPT_BOX } from '../ReceiptPhoto.jsx'
import { CheckIcon, CloseIcon, FlashIcon, ImageIcon } from '../icons.jsx'
import './scan.css'

const DETECT_AFTER_MS = 1200
const AUTO_SNAP_AFTER_MS = 2600

// Pretend camera: "finds" the sample receipt, then snaps it automatically.
export default function Camera({ onClose, onCapture }) {
  const [found, setFound] = useState(false)
  const [auto, setAuto] = useState(true)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const detect = setTimeout(() => setFound(true), DETECT_AFTER_MS)
    const snap = auto ? setTimeout(onCapture, AUTO_SNAP_AFTER_MS) : null
    return () => {
      clearTimeout(detect)
      clearTimeout(snap)
    }
  }, [auto, onCapture])

  return (
    <main className="screen screen--dark">
      <nav className="nav dark-nav">
        <button className="icon-button" aria-label="Close" onClick={onClose}><CloseIcon /></button>
        <span className="nav-title">Scan receipt</span>
        <button className="icon-button" aria-label={flash ? 'Flash on' : 'Flash off'} aria-pressed={flash} onClick={() => setFlash(!flash)}>
          <FlashIcon on={flash} />
        </button>
      </nav>

      <div className="viewfinder">
        <CameraView found={found} />
        <div className="viewfinder-hint" role="status">
          {found ? (
            <span className="hint hint--found"><span className="hint-dot" />{auto ? 'Receipt found — hold steady' : 'Receipt found — tap to snap'}</span>
          ) : (
            <span className="hint">Looking for a receipt…</span>
          )}
        </div>
      </div>

      <footer className="camera-controls">
        <p className="camera-tip">Lay it flat in good light. We'll snap it automatically.</p>
        <div className="camera-buttons">
          <button className="camera-side" onClick={onCapture}>
            <span className="camera-side-icon"><ImageIcon /></span>
            Upload
          </button>
          <button className="shutter" aria-label="Take photo" onClick={onCapture}>
            <span className="shutter-inner" />
          </button>
          <button className="camera-side" aria-pressed={auto} onClick={() => setAuto(!auto)}>
            <span className={auto ? 'camera-side-icon camera-side-icon--on' : 'camera-side-icon'}>A</span>
            {auto ? 'Auto on' : 'Auto off'}
          </button>
        </div>
      </footer>
    </main>
  )
}

export function CheckPhoto({ onClose, onRetake, onUse }) {
  return (
    <main className="screen screen--dark">
      <nav className="nav dark-nav">
        <button className="icon-button" aria-label="Close" onClick={onClose}><CloseIcon /></button>
        <span className="nav-title">Check photo</span>
        <span className="icon-button" aria-hidden="true" />
      </nav>

      <div className="viewfinder">
        <PhotoCrop box={RECEIPT_BOX} width={250} className="receipt-shot" label="Cropped receipt photo" />
        <div className="viewfinder-hint">
          <span className="hint hint--ok"><CheckIcon />Sharp · all 4 corners in view</span>
        </div>
      </div>

      <footer className="camera-controls">
        <p className="camera-tip">Make sure the total is easy to read.</p>
        <div className="check-buttons">
          <button className="outline-button" onClick={onRetake}>Retake</button>
          <button className="accent-button" onClick={onUse}>Use photo</button>
        </div>
      </footer>
    </main>
  )
}
