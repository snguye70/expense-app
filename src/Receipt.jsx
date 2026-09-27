import { money, sampleReceipt as r } from './data.js'
import './Receipt.css'

function Line({ label, value, bold }) {
  return (
    <div className={bold ? 'receipt-line receipt-line--bold' : 'receipt-line'}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

// The sample receipt, drawn the same way as in the Paper file.
export default function Receipt({ tilted = false }) {
  const [year, month, day] = r.date.split('-')

  return (
    <div className={tilted ? 'receipt receipt--tilted' : 'receipt'} role="img" aria-label={`Receipt from ${r.merchant}`}>
      <div className="receipt-store">
        <strong>{r.merchant.toUpperCase()}</strong>
        <span>{r.address}</span>
        <span>{`${month}/${day}/${year}   ${r.time}   ${r.table}`}</span>
      </div>
      <div className="receipt-section">
        {r.items.map((item) => (
          <Line key={item.name} label={item.name} value={money(item.price)} />
        ))}
      </div>
      <div className="receipt-section">
        <Line label="SUBTOTAL" value={money(r.subtotal)} />
        <Line label="TAX 8.625%" value={money(r.tax)} />
        <Line label="AMOUNT" value={money(r.bill)} bold />
      </div>
      <div className="receipt-handwritten">
        <div className="receipt-written-line">
          <span>TIP</span>
          <span className="handwriting">{money(r.tip)}</span>
        </div>
        <div className="receipt-written-line receipt-written-line--total">
          <span>TOTAL</span>
          <span className="handwriting">{money(r.total)}</span>
        </div>
      </div>
      <div className="receipt-footer">
        <span>{`${r.card}   ${r.auth}`}</span>
        <span className="receipt-thanks">THANK YOU</span>
      </div>
    </div>
  )
}
