import { useState } from 'react'
import { ChevronIcon, CloseIcon, DeleteIcon } from './icons.jsx'
import { CATEGORIES } from './data.js'
import './AddExpense.css'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete']

// Applies one keypad press to the amount typed so far, e.g. "48.6" + "0" -> "48.60".
function pressKey(amount, key) {
  if (key === 'delete') return amount.slice(0, -1)
  if (key === '.') {
    if (amount.includes('.')) return amount
    return amount === '' ? '0.' : amount + '.'
  }
  const [whole, cents] = amount.split('.')
  if (cents !== undefined && cents.length === 2) return amount
  if (cents === undefined && whole.length === 6) return amount
  if (amount === '0') return key
  return amount + key
}

export default function AddExpense({ today, onClose, onSave }) {
  const [amount, setAmount] = useState('')
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  const value = parseFloat(amount) || 0
  const canSave = value > 0 && merchant.trim() !== ''

  return (
    <main className="screen add-expense">
      <header className="hero add-hero">
        <nav className="nav">
          <button className="icon-button" aria-label="Close" onClick={onClose}><CloseIcon /></button>
          <span className="nav-title">New expense</span>
          <span className="icon-button" aria-hidden="true" />
        </nav>

        <div className="amount-entry">
          <span className="amount-label">Amount</span>
          <p className="amount" aria-live="polite">
            <span className="amount-currency">$</span>
            <span className={amount ? 'amount-value' : 'amount-value amount-empty'}>{amount || '0'}</span>
            <span className="cursor" />
          </p>
        </div>
      </header>

      <section className="fields">
        <label className="row field">
          <span className="row-label">Merchant</span>
          <input
            className="merchant-input"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Where did you spend?"
          />
        </label>
        <div className="row field chips" role="radiogroup" aria-label="Category">
          {CATEGORIES.map((name) => (
            <button
              key={name}
              role="radio"
              aria-checked={category === name}
              className={category === name ? 'chip chip--selected' : 'chip'}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="row field">
          <span className="row-label">Date</span>
          <span className="row-value">Today, {today.short}<ChevronIcon /></span>
        </div>
      </section>

      <footer className="add-bottom">
        <div className="keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              className={key === '.' ? 'key key--dot' : 'key'}
              aria-label={key === 'delete' ? 'Delete' : key}
              onClick={() => setAmount((current) => pressKey(current, key))}
            >
              {key === 'delete' ? <DeleteIcon /> : key}
            </button>
          ))}
        </div>
        <button
          className="primary-button save-button"
          disabled={!canSave}
          onClick={() => onSave({ amount: value, merchant: merchant.trim(), category })}
        >
          Save expense
        </button>
      </footer>
    </main>
  )
}
