import { useEffect, useState } from 'react'
import { PhotoCrop, RECEIPT_BOX } from '../ReceiptPhoto.jsx'
import { formatDate, sampleReceipt } from '../data.js'
import { CheckIcon, CloseIcon } from '../icons.jsx'
import './scan.css'

const STEPS = [
  'Photo uploaded',
  `Found ${sampleReceipt.merchant}, ${formatDate(sampleReceipt.date).replace(/^\w+, /, '')}`,
  'Reading total and tip',
  'Suggesting a category',
]
const STEP_MS = 900

// Pretend receipt reader: ticks through the steps, then hands off to Review.
export default function Reading({ onClose, onDone, onEnterManually }) {
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (step > STEPS.length) {
      const done = setTimeout(onDone, 300)
      return () => clearTimeout(done)
    }
    const next = setTimeout(() => setStep(step + 1), STEP_MS)
    return () => clearTimeout(next)
  }, [step, onDone])

  return (
    <main className="screen">
      <nav className="nav reading-nav">
        <button className="icon-button" aria-label="Cancel" onClick={onClose}><CloseIcon /></button>
        <span className="nav-title">Reading receipt</span>
        <span className="icon-button" aria-hidden="true" />
      </nav>

      <div className="reading-preview">
        <div className="reading-panel">
          <PhotoCrop box={RECEIPT_BOX} width={250} className="receipt-shot" label="Receipt photo being read" />
          <div className="scan-line" aria-hidden="true" />
        </div>
      </div>

      <section className="reading-steps">
        <h1 className="reading-title">Filling in the details…</h1>
        <ol className="steps" aria-live="polite">
          {STEPS.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'next'
            return (
              <li key={label} className={`step step--${state}`}>
                <span className="step-icon">{state === 'done' && <CheckIcon size={14} width={3.2} />}</span>
                {label}
              </li>
            )
          })}
        </ol>
      </section>

      <footer className="reading-bottom">
        <p className="reading-note">Usually takes about 5 seconds</p>
        <button className="link-button" onClick={onEnterManually}>Enter it myself instead</button>
      </footer>
    </main>
  )
}
