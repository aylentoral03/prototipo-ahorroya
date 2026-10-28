export type Currency = 'ARS' | 'USD'

export type Goal = {
  id: string
  name: string
  currency: Currency
  emoji: string
  saved: number
  target: number
  deadline: string
  color: string
  createdAt: string
  contributions: { date: string; amount: number; label: string }[]
}

export type Movement = {
  id: string
  merchant: string
  category: string
  amount: number
  currency: Currency
  icon: string
  tone: string
  day: string
  date: string
}

export type BudgetCategory = {
  name: string
  amount: number
  limit: number
  change: number
  icon: string
  color: string
}

export type Debt = {
  id: string
  name: string
  creditor: string
  currency: Currency
  originalBalance: number
  balance: number
  monthlyPayment: number
  dueDate: string
  kind: 'Tarjeta' | 'Préstamo' | 'Cuotas'
}

export type NewExpenseInput = {
  merchant: string
  category: string
  amount: number
}

export type NewDebtInput = {
  name: string
  creditor: string
  balance: number
  monthlyPayment: number
  dueDate: string
  kind: Debt['kind']
  currency: Currency
}
