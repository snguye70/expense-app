import { useState } from 'react'
import { formatDate, monthName, money, moneyWithCommas } from './data.js'
import { CheckIcon, PlusIcon, ScanIcon } from './icons.jsx'
import './Home.css'

const LATEST_COUNT = 5

export default function Home({ expenses, highlightId, toast, onUndo, onOpen, onScan, onAddManually }) {
  const [showAll, setShowAll] = useState(false)

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))
  const month = sorted[0]?.date.slice(0, 7)
  const thisMonth = sorted.filter((e) => e.date.startsWith(month))
  const total = thisMonth.reduce((sum, e) => sum + e.amount, 0)
  const missingReceipts = thisMonth.filter((e) => !e.hasReceipt).length
  const visible = showAll ? sorted : sorted.slice(0, LATEST_COUNT)

  return (
    <main className="screen home">
      <header className="hero home-hero">
        <div className="home-header">
          <h1 className="home-title">Expenses</h1>
          <span className="home-avatar">SN</span>
        </div>
        {month && (
          <div className="home-summary">
            <span className="amount-label">Spent in {monthName(sorted[0].date)}</span>
            <p className="amount home-amount">
              <span className="amount-currency">$</span>
              <span className="amount-value">{moneyWithCommas(total)}</span>
            </p>
            <p className="home-meta">
              {thisMonth.length} expenses
              {missingReceipts > 0 && ` · ${missingReceipts} missing ${missingReceipts === 1 ? 'receipt' : 'receipts'}`}
            </p>
          </div>
        )}
      </header>

      <section className="latest">
        <div className="latest-header">
          <span className="row-label">{showAll ? 'All expenses' : 'Latest'}</span>
          {sorted.length > LATEST_COUNT && (
            <button className="text-button" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>
        <ul className="expense-list">
          {visible.map((e) => (
            <li key={e.id}>
              <button
                className={e.id === highlightId ? 'expense-row expense-row--new' : 'expense-row'}
                onClick={() => onOpen(e.id)}
              >
                <span className="expense-mark">{e.merchant[0]}</span>
                <span className="expense-text">
                  <span className="expense-merchant">{e.merchant}</span>
                  <span className="expense-sub">
                    {e.category} · {formatDate(e.date)}
                  </span>
                </span>
                <span className="expense-amount">${money(e.amount)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <footer className="home-actions">
        <button className="primary-button scan-button" onClick={onScan}>
          <ScanIcon />
          Scan receipt
        </button>
        <button className="round-button" aria-label="Add expense manually" onClick={onAddManually}>
          <PlusIcon />
        </button>
      </footer>

      {toast && (
        <div className="toast" role="status">
          <span className="toast-check"><CheckIcon size={14} /></span>
          <span className="toast-text">{toast}</span>
          <button className="toast-undo" onClick={onUndo}>Undo</button>
        </div>
      )}
    </main>
  )
}
