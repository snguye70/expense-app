import ExpenseDetail from './ExpenseDetail.jsx'

const sampleExpense = {
  amount: 48.6,
  merchant: 'Blue Bottle Coffee',
  note: 'Team breakfast',
  date: 'Thu, Sep 24',
  category: 'Food & drink',
  paidWith: 'Visa ···· 4021',
  splitWith: [
    { initials: 'SN', tone: 'ink' },
    { initials: 'MK', tone: 'accent' },
    { initials: 'JL', tone: 'rule' },
  ],
  hasReceipt: true,
  loggedBy: 'you',
  report: 'Q3 Travel & Meals',
}

export default function App() {
  return <ExpenseDetail expense={sampleExpense} />
}
