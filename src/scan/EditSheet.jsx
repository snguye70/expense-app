import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, money } from '../data.js'
import { CheckIcon } from '../icons.jsx'
import './scan.css'

const TIP_PERCENTS = [18, 20, 22]
const toCents = (n) => Math.round(n * 100) / 100
// "an 18%" but "a 20%": numbers that are read aloud starting with a vowel sound.
const withArticle = (n) => `${/^(8|11|18)/.test(String(n)) ? 'an' : 'a'} ${n}`

// Bottom sheet for changing one detail on the Review screen.
export default function EditSheet({ field, value, tipBase, readValue, onCancel, onDone }) {
  const isMoney = field.kind === 'money' || field.kind === 'tip'
  const [text, setText] = useState(isMoney ? money(value) : value)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const parsed = isMoney ? parseFloat(text.replace(/[^0-9.]/g, '')) : text
  const valid = isMoney ? Number.isFinite(parsed) && parsed >= 0 : String(parsed).trim() !== ''
  const unchanged = isMoney ? valid && toCents(parsed) === toCents(value) : parsed === value
  const title = field.kind === 'tip' ? 'Check the tip' : field.label

  function submit(e) {
    e?.preventDefault()
    if (!valid) return
    onDone(isMoney ? toCents(parsed) : typeof parsed === 'string' ? parsed.trim() : parsed)
  }

  return (
    <div className="sheet-layer">
      <button className="scrim" aria-label="Close" onClick={onCancel} />
      <form className="sheet" role="dialog" aria-modal="true" aria-label={title} onSubmit={submit}>
        <span className="sheet-handle" />
        <div className="sheet-header">
          <h2 className="sheet-title">{title}</h2>
          <button type="button" className="sheet-cancel" onClick={onCancel}>Cancel</button>
        </div>

        {field.kind === 'tip' && (
          <div className="source-crop">
            <span className="source-crop-label">On your receipt</span>
            <span className="source-crop-paper">
              <span className="source-crop-tip">TIP</span>
              <span className="handwriting source-crop-value">{money(readValue)}</span>
            </span>
          </div>
        )}

        {isMoney && (
          <label className="money-input">
            <span className="money-currency">$</span>
            <input
              ref={inputRef}
              inputMode="decimal"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label={field.label}
            />
          </label>
        )}

        {field.kind === 'tip' && (
          <div className="tip-presets" role="group" aria-label="Tip presets">
            {TIP_PERCENTS.map((pct) => {
              const amount = toCents((tipBase * pct) / 100)
              const selected = valid && toCents(parsed) === amount
              return (
                <button
                  type="button"
                  key={pct}
                  className={selected ? 'tip-preset tip-preset--selected' : 'tip-preset'}
                  aria-pressed={selected}
                  onClick={() => setText(money(amount))}
                >
                  <span className="tip-preset-pct">{pct}%</span>
                  <span className="tip-preset-amount">${money(amount)}</span>
                </button>
              )
            })}
          </div>
        )}

        {field.kind === 'tip' && valid && TIP_PERCENTS.some((p) => toCents((tipBase * p) / 100) === toCents(parsed)) && (
          <p className="sheet-note">
            <CheckIcon size={14} />
            Matches {withArticle(TIP_PERCENTS.find((p) => toCents((tipBase * p) / 100) === toCents(parsed)))}% tip on ${money(tipBase)}
          </p>
        )}

        {field.kind === 'text' && (
          <input ref={inputRef} className="text-input" value={text} onChange={(e) => setText(e.target.value)} aria-label={field.label} />
        )}

        {field.kind === 'date' && (
          <input ref={inputRef} className="text-input" type="date" value={text} onChange={(e) => setText(e.target.value)} aria-label={field.label} />
        )}

        {field.kind === 'category' && (
          <div className="sheet-chips" role="radiogroup" aria-label="Category">
            {CATEGORIES.map((name) => (
              <button
                type="button"
                key={name}
                role="radio"
                aria-checked={text === name}
                className={text === name ? 'chip chip--selected' : 'chip'}
                onClick={() => setText(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <button type="submit" className="primary-button" disabled={!valid}>
          {field.kind === 'tip' && unchanged ? 'Looks right' : unchanged ? 'Done' : 'Update'}
        </button>
      </form>
    </div>
  )
}
