// Sample data. Nothing here comes from a real server or receipt reader yet.

export const CATEGORIES = ['Food & drink', 'Travel', 'Office', 'Other']
export const DEFAULT_CARD = 'Visa ···· 4021'

// What the "receipt reader" pretends to find on the Luna Ramen receipt.
export const sampleReceipt = {
  merchant: 'Luna Ramen',
  address: '412 VALENCIA ST, SAN FRANCISCO',
  date: '2026-09-26',
  time: '7:42 PM',
  table: 'TBL 12',
  items: [
    { name: 'TONKOTSU RAMEN', price: 16.0 },
    { name: 'SPICY MISO RAMEN', price: 17.0 },
    { name: 'GYOZA (6)', price: 7.5 },
  ],
  subtotal: 40.5,
  tax: 3.49,
  bill: 43.99, // subtotal + tax, printed
  tip: 8.1, // handwritten, so the reader is unsure about it
  total: 52.09, // handwritten
  card: 'VISA **** 4021',
  auth: 'AUTH 08812',
  suggestedCategory: 'Food & drink',
}

export const initialExpenses = [
  { id: 'e14', merchant: 'Lyft', amount: 24.5, category: 'Travel', date: '2026-09-27', hasReceipt: true },
  {
    id: 'e13',
    merchant: 'Blue Bottle Coffee',
    amount: 48.6,
    category: 'Food & drink',
    date: '2026-09-24',
    note: 'Team breakfast',
    hasReceipt: true,
    splitWith: [
      { initials: 'SN', tone: 'ink' },
      { initials: 'MK', tone: 'accent' },
      { initials: 'JL', tone: 'rule' },
    ],
  },
  { id: 'e12', merchant: 'Delta Air Lines', amount: 412.8, category: 'Travel', date: '2026-09-21', hasReceipt: true },
  { id: 'e11', merchant: 'Staples', amount: 36.14, category: 'Office', date: '2026-09-18', hasReceipt: false },
  { id: 'e10', merchant: 'WeWork', amount: 95.0, category: 'Office', date: '2026-09-15', hasReceipt: true },
  { id: 'e9', merchant: 'Uber', amount: 31.25, category: 'Travel', date: '2026-09-14', hasReceipt: false },
  { id: 'e8', merchant: 'Sweetgreen', amount: 16.45, category: 'Food & drink', date: '2026-09-12', hasReceipt: true },
  { id: 'e7', merchant: 'Hotel Zeppelin', amount: 289.0, category: 'Travel', date: '2026-09-10', hasReceipt: true },
  { id: 'e6', merchant: 'Amazon', amount: 62.99, category: 'Office', date: '2026-09-09', hasReceipt: true },
  { id: 'e5', merchant: 'Tartine', amount: 22.4, category: 'Food & drink', date: '2026-09-08', hasReceipt: true },
  { id: 'e4', merchant: 'Caltrain', amount: 15.75, category: 'Travel', date: '2026-09-05', hasReceipt: true },
  { id: 'e3', merchant: 'Best Buy', amount: 201.23, category: 'Office', date: '2026-09-04', hasReceipt: true },
  { id: 'e2', merchant: 'Zoom', amount: 15.99, category: 'Office', date: '2026-09-03', hasReceipt: true },
  { id: 'e1', merchant: 'Philz Coffee', amount: 12.5, category: 'Food & drink', date: '2026-09-02', hasReceipt: true },
]

export const money = (n) => n.toFixed(2)
export const moneyWithCommas = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Dates are stored as "YYYY-MM-DD" and read as local dates.
const parseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayIso = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function formatDate(iso) {
  if (iso === todayIso()) return 'Today'
  return parseDate(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export const monthName = (iso) => parseDate(iso).toLocaleDateString('en-US', { month: 'long' })
