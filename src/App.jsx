import { useCallback, useEffect, useState } from 'react'
import AddExpense from './AddExpense.jsx'
import ExpenseDetail from './ExpenseDetail.jsx'
import Home from './Home.jsx'
import Camera, { CheckPhoto } from './scan/Camera.jsx'
import Reading from './scan/Reading.jsx'
import Review from './scan/Review.jsx'
import { initialExpenses, todayIso } from './data.js'

const STORAGE_KEY = 'expense-app/expenses-v1'
const TOAST_MS = 4000

const now = new Date()
const today = { short: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : initialExpenses
  } catch {
    return initialExpenses
  }
}

// The flow: Home -> Camera -> Check photo -> Reading -> Review (edit sheet) -> Save -> Home.
export default function App() {
  const [screen, setScreen] = useState('home')
  const [expenses, setExpenses] = useState(loadExpenses)
  const [openId, setOpenId] = useState(null)
  const [justSaved, setJustSaved] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      // Storage can be unavailable (private mode); the app still works for this visit.
    }
  }, [expenses])

  useEffect(() => {
    if (!justSaved) return
    const hide = setTimeout(() => setJustSaved(null), TOAST_MS)
    return () => clearTimeout(hide)
  }, [justSaved])

  const goHome = useCallback(() => setScreen('home'), [])
  const toCheck = useCallback(() => setScreen('check'), [])
  const toReview = useCallback(() => setScreen('review'), [])

  function save(fields) {
    const expense = { id: `e${Date.now()}`, ...fields }
    setExpenses((list) => [expense, ...list])
    setJustSaved(expense.id)
    setScreen('home')
  }

  function undoSave() {
    setExpenses((list) => list.filter((e) => e.id !== justSaved))
    setJustSaved(null)
  }

  switch (screen) {
    case 'camera':
      return <Camera onClose={goHome} onCapture={toCheck} />
    case 'check':
      return <CheckPhoto onClose={goHome} onRetake={() => setScreen('camera')} onUse={() => setScreen('reading')} />
    case 'reading':
      return <Reading onClose={goHome} onDone={toReview} onEnterManually={() => setScreen('add')} />
    case 'review':
      return <Review onBack={() => setScreen('camera')} onSave={save} />
    case 'add':
      return (
        <AddExpense
          today={today}
          onClose={goHome}
          onSave={(fields) => save({ ...fields, date: todayIso(), hasReceipt: false })}
        />
      )
    case 'detail': {
      const expense = expenses.find((e) => e.id === openId)
      if (expense) return <ExpenseDetail expense={expense} onBack={goHome} onEdit={goHome} />
      return null
    }
    default:
      return (
        <Home
          expenses={expenses}
          highlightId={justSaved}
          toast={justSaved ? 'Expense saved' : null}
          onUndo={undoSave}
          onOpen={(id) => {
            setOpenId(id)
            setScreen('detail')
          }}
          onScan={() => setScreen('camera')}
          onAddManually={() => setScreen('add')}
        />
      )
  }
}
