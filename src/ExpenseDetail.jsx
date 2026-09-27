import './ExpenseDetail.css'

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DetailRow({ label, children }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <div className="detail-value">{children}</div>
    </div>
  )
}

const money = (n) => n.toFixed(2)

export default function ExpenseDetail({ expense }) {
  const { amount, merchant, note, date, category, paidWith, splitWith, hasReceipt, loggedBy, report } = expense
  const share = amount / splitWith.length

  return (
    <main className="expense">
      <header className="hero">
        <nav className="nav">
          <button className="icon-button" aria-label="Back"><BackIcon /></button>
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
            <p className="meta">{note} · {date}</p>
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
          <span className="avatars">
            {splitWith.map((person) => (
              <span key={person.initials} className={`avatar avatar--${person.tone}`}>{person.initials}</span>
            ))}
          </span>
          ${money(share)} each
        </DetailRow>
        <DetailRow label="Receipt">
          {hasReceipt ? 'Attached' : 'None'}
          <ChevronIcon />
        </DetailRow>
      </section>

      <footer className="footer">
        <button className="primary-button">Edit expense</button>
        <p className="footnote">Logged by {loggedBy} · synced to {report}</p>
      </footer>
    </main>
  )
}
