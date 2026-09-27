import { DEFAULT_CARD, formatDate, money } from './data.js'
import { BackIcon, ChevronIcon, MoreIcon } from './icons.jsx'
import './ExpenseDetail.css'

function DetailRow({ label, children }) {
  return (
    <div className="row detail-row">
      <span className="row-label">{label}</span>
      <div className="row-value">{children}</div>
    </div>
  )
}

export default function ExpenseDetail({ expense, onBack, onEdit }) {
  const { amount, merchant, note, date, category, paidWith = DEFAULT_CARD, splitWith = [], hasReceipt } = expense

  return (
    <main className="screen">
      <header className="hero">
        <nav className="nav">
          <button className="icon-button" aria-label="Back" onClick={onBack}><BackIcon /></button>
          <span className="nav-title">Expense</span>
          <button className="icon-button" aria-label="More options"><MoreIcon /></button>
        </nav>

        <div className="amount-block">
          <p className="amount">
            <span className="amount-currency">$</span>
            <span className="amount-value">{money(amount)}</span>
          </p>
          <div>
            <h1 className="merchant">{merchant}</h1>
            <p className="meta">{note ? `${note} · ${formatDate(date)}` : formatDate(date)}</p>
          </div>
        </div>
      </header>

      <section className="details">
        <DetailRow label="Category">
          <span className="category-dot" />
          {category}
        </DetailRow>
        <DetailRow label="Paid with">{paidWith}</DetailRow>
        <DetailRow label="Split">
          {splitWith.length > 1 ? (
            <>
              <span className="avatars">
                {splitWith.map((person) => (
                  <span key={person.initials} className={`avatar avatar--${person.tone}`}>{person.initials}</span>
                ))}
              </span>
              ${money(amount / splitWith.length)} each
            </>
          ) : (
            'Just you'
          )}
        </DetailRow>
        <DetailRow label="Receipt">
          {hasReceipt ? 'Attached' : 'Add receipt'}
          <ChevronIcon />
        </DetailRow>
      </section>

      <footer className="footer">
        <button className="primary-button" onClick={onEdit}>Edit expense</button>
        <p className="footnote">Logged by you · synced to Q3 Travel &amp; Meals</p>
      </footer>
    </main>
  )
}
