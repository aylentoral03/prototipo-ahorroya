import type { BudgetCategory, Debt, Movement, NewDebtInput, NewExpenseInput } from './finance-types'

const DEMO_TONE = '#eef3ea'
const DEMO_EXPENSE_ICONS: Record<string, string> = {
  Supermercado: '▦',
  Delivery: '◌',
  Transporte: '↗',
  Salidas: '◉',
  Servicios: '⌂',
  Suscripciones: '▤',
}

export function createDemoExpense(input: NewExpenseInput, budgets: BudgetCategory[]): Movement {
  const merchant = input.merchant.trim().slice(0, 60)
  const amount = Math.round(input.amount)
  const category = budgets.find((item) => item.name === input.category)

  if (!merchant) throw new Error('Escribí un nombre para el gasto.')
  if (!Number.isFinite(amount) || amount < 1) throw new Error('El monto tiene que ser mayor a cero.')
  if (!category) throw new Error('Elegí una categoría válida.')

  return {
    id: `expense-demo-${Date.now()}`,
    merchant,
    category: category.name,
    amount,
    currency: 'ARS',
    icon: DEMO_EXPENSE_ICONS[category.name] ?? '•',
    tone: category.color ? `${category.color}1a` : DEMO_TONE,
    day: 'Hoy',
    date: new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()),
  }
}

export function addDemoExpenseToBudget(budgets: BudgetCategory[], expense: Movement): BudgetCategory[] {
  return budgets.map((budget) => budget.name === expense.category
    ? { ...budget, amount: budget.amount + expense.amount }
    : budget)
}

export function updateDemoBudgetLimit(budgets: BudgetCategory[], categoryName: string, nextLimit: number): BudgetCategory[] {
  if (!Number.isFinite(nextLimit) || nextLimit < 1) throw new Error('El límite mensual tiene que ser mayor a cero.')
  return budgets.map((budget) => budget.name === categoryName
    ? { ...budget, limit: Math.round(nextLimit) }
    : budget)
}

export function createDemoDebt(input: NewDebtInput): Debt {
  const name = input.name.trim().slice(0, 60)
  const creditor = input.creditor.trim().slice(0, 60)
  const balance = Math.round(input.balance)
  const monthlyPayment = Math.round(input.monthlyPayment)

  if (!name || !creditor) throw new Error('Completá el nombre de la deuda y la entidad.')
  if (!Number.isFinite(balance) || balance < 1) throw new Error('El saldo tiene que ser mayor a cero.')
  if (!Number.isFinite(monthlyPayment) || monthlyPayment < 0) throw new Error('Revisá el pago mensual estimado.')

  return {
    id: `debt-demo-${Date.now()}`,
    name,
    creditor,
    currency: input.currency,
    originalBalance: balance,
    balance,
    monthlyPayment,
    dueDate: input.dueDate,
    kind: input.kind,
  }
}

export function applyDemoDebtPayment(debts: Debt[], debtId: string, amount: number): Debt[] {
  const debt = debts.find((item) => item.id === debtId)
  if (!debt || !Number.isFinite(amount) || amount <= 0 || amount > debt.balance) {
    throw new Error('Ingresá un importe válido para esta deuda.')
  }

  return debts.map((item) => item.id === debtId
    ? { ...item, balance: Math.max(0, item.balance - Math.round(amount)) }
    : item)
}
