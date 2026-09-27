import { useState } from 'react'
import { DEFAULT_CARD, formatDate, money, sampleReceipt } from '../data.js'
import { BackIcon, ChevronIcon, ScanIcon } from '../icons.jsx'
import EditSheet from './EditSheet.jsx'
import { PhotoCrop, RECEIPT_BOX } from '../ReceiptPhoto.jsx'
import './scan.css'

const FIELDS = {
  merchant: { label: 'Merchant', kind: 'text' },
  date: { label: 'Date', kind: 'date' },
  category: { label: 'Category', kind: 'category' },
  bill: { label: 'Bill + tax', kind: 'money' },
  tip: { label: 'Tip', kind: 'tip' },
  paidWith: { label: 'Paid with', kind: 'text' },
}

function ReviewRow({ label, onClick, children }) {
  return (
    <button className="row review-row" onClick={onClick}>
      <span className="row-label">{label}</span>
      <span className="row-value">{children}</span>
    </button>
  )
}

// Everything is pre-filled from the receipt. Only the handwritten tip is flagged.
export default function Review({ onBack, onSave }) {
  const [draft, setDraft] = useState({
    merchant: sampleReceipt.merchant,
    date: sampleReceipt.date,
    category: sampleReceipt.suggestedCategory,
    bill: sampleReceipt.bill,
    tip: sampleReceipt.tip,
    paidWith: DEFAULT_CARD,
  })
  const [tipChecked, setTipChecked] = useState(false)
  const [categoryConfirmed, setCategoryConfirmed] = useState(false)
  const [editing, setEditing] = useState(null)

  const total = Math.round((draft.bill + draft.tip) * 100) / 100
  const edit = (field) => () => setEditing(field)

  function handleDone(value) {
    setDraft({ ...draft, [editing]: value })
    if (editing === 'tip') setTipChecked(true)
    if (editing === 'category') setCategoryConfirmed(true)
    setEditing(null)
  }

  return (
    <main className="screen">
      <header className="hero review-hero">
        <nav className="nav">
          <button className="icon-button" aria-label="Back" onClick={onBack}><BackIcon /></button>
          <span className="nav-title">Review expense</span>
          <span className="icon-button" aria-hidden="true" />
        </nav>
        <div className="review-amount-block">
          <div className="review-amount-stack">
            <span className="source-badge"><ScanIcon size={14} />Read from receipt</span>
            <p className="amount review-amount">
              <span className="amount-currency">$</span>
              <span className="amount-value">{money(total)}</span>
            </p>
          </div>
          <PhotoCrop box={RECEIPT_BOX} width={60} className="receipt-thumb" label="Receipt photo" />
        </div>
      </header>

      <section className="review-fields">
        <ReviewRow label="Merchant" onClick={edit('merchant')}>{draft.merchant}</ReviewRow>
        <ReviewRow label="Date" onClick={edit('date')}>
          {formatDate(draft.date)}
          {draft.date === sampleReceipt.date && ` · ${sampleReceipt.time}`}
        </ReviewRow>
        <ReviewRow label="Category" onClick={edit('category')}>
          {!categoryConfirmed && <span className="suggested">Suggested</span>}
          <span className="category-dot" />
          {draft.category}
        </ReviewRow>
        <ReviewRow label="Bill + tax" onClick={edit('bill')}>${money(draft.bill)}</ReviewRow>

        {tipChecked ? (
          <ReviewRow label="Tip" onClick={edit('tip')}>${money(draft.tip)}</ReviewRow>
        ) : (
          <button className="flag-row" onClick={edit('tip')}>
            <span className="flag-top">
              <span className="flag-label">
                <span className="row-label flag-label-text">Tip</span>
                <span className="check-tag">Check</span>
              </span>
              <span className="flag-value">${money(draft.tip)}<ChevronIcon /></span>
            </span>
            <span className="flag-reason">Handwritten, so we might have misread it.</span>
          </button>
        )}

        <ReviewRow label="Paid with" onClick={edit('paidWith')}>{draft.paidWith}</ReviewRow>
      </section>

      <footer className="review-footer">
        <p className="review-hint">Tap any detail to change it</p>
        <button
          className="primary-button"
          onClick={() =>
            onSave({
              merchant: draft.merchant,
              amount: total,
              category: draft.category,
              date: draft.date,
              paidWith: draft.paidWith,
              hasReceipt: true,
              note: `$${money(draft.bill)} + $${money(draft.tip)} tip`,
            })
          }
        >
          Save expense
        </button>
      </footer>

      {editing && (
        <EditSheet
          field={FIELDS[editing]}
          value={draft[editing]}
          tipBase={sampleReceipt.subtotal}
          readValue={editing === 'tip' ? sampleReceipt.tip : null}
          onCancel={() => setEditing(null)}
          onDone={handleDone}
        />
      )}
    </main>
  )
}
