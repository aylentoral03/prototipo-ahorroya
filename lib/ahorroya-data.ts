import type { BudgetCategory, Currency, Debt, Goal, Movement } from './finance-types'

export type { BudgetCategory, Currency, Debt, Goal, Movement } from './finance-types'

export const monthlyIncome = 1_250_000
export const initialSpendable = 684_500

export const initialGoals: Goal[] = [
  {
    id: 'casa', name: 'Mi casa', emoji: '🏡', currency: 'USD', saved: 4_850, target: 120_000,
    deadline: 'Oct 2029', color: '#14634f', createdAt: '12 feb 2025',
    contributions: [
      { date: 'Hoy', amount: 150, label: 'Ahorro automático' },
      { date: 'Hace 2 semanas', amount: 95, label: 'Ahorro automático' },
      { date: '28 abr', amount: 120, label: 'Ahorro automático' },
    ],
  },
  {
    id: 'auto', name: 'Mi auto', emoji: '🚙', currency: 'ARS', saved: 1_720_000, target: 8_500_000,
    deadline: 'Jun 2028', color: '#d99b45', createdAt: '04 may 2025',
    contributions: [{ date: 'Hace 2 semanas', amount: 65_000, label: 'Ahorro automático' }, { date: '28 abr', amount: 82_000, label: 'Ahorro automático' }],
  },
  {
    id: 'terreno', name: 'Terreno', emoji: '🌿', currency: 'USD', saved: 920, target: 60_000,
    deadline: 'Mar 2029', color: '#8aa89a', createdAt: '18 jun 2025',
    contributions: [{ date: 'Hace 3 semanas', amount: 42, label: 'Ahorro automático' }, { date: '28 abr', amount: 57, label: 'Ahorro automático' }],
  },
]

const rawMovements = [
  ['Mañana', 'Supermercado Día', 'Supermercado', 28450, '🛒', '#dff1e8'],
  ['Ayer', 'Café Martínez', 'Salidas', 7800, '☕', '#f7ead7'],
  ['Ayer', 'Uber', 'Transporte', 9200, '🚕', '#e5e9f4'],
  ['Lun, 19 may', 'La Mezzetta', 'Delivery', 18700, '🍕', '#fae5df'],
  ['Lun, 19 may', 'Spotify Premium', 'Suscripciones', 3299, '♫', '#ece6f6'],
  ['Dom, 18 may', 'YPF', 'Transporte', 38500, '⛽', '#e5e9f4'],
  ['Dom, 18 may', 'Carrefour', 'Supermercado', 56200, '🛒', '#dff1e8'],
  ['Sáb, 17 may', 'PedidosYa', 'Delivery', 22400, '🍔', '#fae5df'],
  ['Sáb, 17 may', 'Cine Hoyts', 'Salidas', 14600, '🎟', '#f7ead7'],
  ['Vie, 16 may', 'Sube', 'Transporte', 6500, '🚌', '#e5e9f4'],
  ['Vie, 16 may', 'Luz Edenor', 'Servicios', 31450, '💡', '#e8efe9'],
  ['Jue, 15 may', 'Coto', 'Supermercado', 42600, '🛒', '#dff1e8'],
  ['Mié, 14 may', 'Rappi', 'Delivery', 19900, '🥡', '#fae5df'],
  ['Mié, 14 may', 'Netflix', 'Suscripciones', 8999, '▶', '#ece6f6'],
  ['Mar, 13 may', 'Cabify', 'Transporte', 11300, '🚕', '#e5e9f4'],
  ['Lun, 12 may', 'Día', 'Supermercado', 19800, '🛒', '#dff1e8'],
  ['Dom, 11 may', 'Bar El Federal', 'Salidas', 27300, '🍷', '#f7ead7'],
  ['Sáb, 10 may', 'PedidosYa', 'Delivery', 24100, '🍔', '#fae5df'],
  ['Vie, 9 may', 'Metrogas', 'Servicios', 17300, '🔥', '#e8efe9'],
  ['Jue, 8 may', 'Shell', 'Transporte', 42100, '⛽', '#e5e9f4'],
  ['Mié, 7 may', 'Disco', 'Supermercado', 67200, '🛒', '#dff1e8'],
  ['Mar, 6 may', 'Rappi', 'Delivery', 16800, '🥡', '#fae5df'],
  ['Lun, 5 may', 'YouTube Premium', 'Suscripciones', 2599, '▶', '#ece6f6'],
  ['Dom, 4 may', 'Subte', 'Transporte', 4900, '🚇', '#e5e9f4'],
  ['Sáb, 3 may', 'Teatro Picadero', 'Salidas', 18500, '🎭', '#f7ead7'],
  ['Vie, 2 may', 'PedidosYa', 'Delivery', 21300, '🍕', '#fae5df'],
  ['Jue, 1 may', 'AySA', 'Servicios', 12800, '💧', '#e8efe9'],
  ['Mié, 30 abr', 'Coto', 'Supermercado', 34900, '🛒', '#dff1e8'],
  ['Mar, 29 abr', 'Uber', 'Transporte', 8400, '🚕', '#e5e9f4'],
  ['Lun, 28 abr', 'PedidosYa', 'Delivery', 27800, '🍔', '#fae5df'],
] as const

function recentDayLabel(index: number) {
  if (index === 0) return 'Hoy'
  if (index <= 2) return 'Ayer'
  const date = new Date()
  date.setDate(date.getDate() - Math.min(index - 1, 28))
  return new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).format(date).replaceAll('.', '').replace(/^./, (letter) => letter.toUpperCase())
}

export const initialMovements: Movement[] = rawMovements.map((row, index) => ({
  id: `movement-${index + 1}`,
  day: recentDayLabel(index), merchant: row[1], category: row[2], amount: row[3], currency: 'ARS', icon: row[4], tone: row[5],
  date: recentDayLabel(index),
}))

export const categoryBudgets: BudgetCategory[] = [
  { name: 'Supermercado', amount: 288_450, limit: 360_000, change: 8, icon: '▦', color: '#14634f' },
  { name: 'Delivery', amount: 196_500, limit: 180_000, change: 42, icon: '◌', color: '#e9876d' },
  { name: 'Transporte', amount: 142_900, limit: 190_000, change: -6, icon: '↗', color: '#6685aa' },
  { name: 'Salidas', amount: 118_200, limit: 150_000, change: 12, icon: '◉', color: '#d99b45' },
  { name: 'Servicios', amount: 96_400, limit: 130_000, change: 3, icon: '⌂', color: '#7d9e7d' },
  { name: 'Suscripciones', amount: 14_897, limit: 25_000, change: 0, icon: '▤', color: '#9d86be' },
]

export const initialDebts: Debt[] = [
  { id: 'debt-card', name: 'Tarjeta de crédito', creditor: 'Banco Demo', currency: 'ARS', originalBalance: 362_000, balance: 246_500, monthlyPayment: 62_000, dueDate: '10/11/2026', kind: 'Tarjeta' },
  { id: 'debt-loan', name: 'Préstamo personal', creditor: 'Financiera Demo', currency: 'ARS', originalBalance: 480_000, balance: 213_000, monthlyPayment: 48_000, dueDate: '18/11/2026', kind: 'Préstamo' },
  { id: 'debt-installments', name: 'Compra en cuotas', creditor: 'Comercio Demo', currency: 'ARS', originalBalance: 195_000, balance: 97_500, monthlyPayment: 32_500, dueDate: '25/11/2026', kind: 'Cuotas' },
]

export const tips = [
  { title: 'Pagate primero', copy: 'Separá una parte de cada ingreso apenas llega. Lo que no ves, no lo gastás.', tag: 'El hábito que cambia todo', color: 'mint', icon: '🌱' },
  { title: 'El delivery también suma', copy: 'Un pedido menos por semana puede convertirse en un aporte real a tu meta.', tag: 'Un paso chiquito', color: 'peach', icon: '🥡' },
  { title: 'Poné nombre a tu ahorro', copy: 'Ahorrar para algo que imaginás se siente mucho más cerca que ahorrar “por las dudas”.', tag: 'Hacelo personal', color: 'lavender', icon: '🏡' },
  { title: 'Automatizá lo posible', copy: 'Si el ahorro depende de acordarte, compite con todo. Una regla te libera la cabeza.', tag: 'Menos esfuerzo', color: 'sand', icon: '✨' },
  { title: 'El progreso no es lineal', copy: 'Hay meses mejores que otros. La constancia vale más que un monto perfecto.', tag: 'Sin culpa', color: 'blue', icon: '🌤️' },
]

export const formatMoney = (amount: number) => `$${Math.round(amount).toLocaleString('es-AR')}`

export function formatCurrency(amount: number, currency: Currency) {
  const rounded = Math.round(amount).toLocaleString('es-AR')
  return currency === 'USD' ? `USD ${rounded}` : `$${rounded}`
}

const goalWeights: Record<string, number> = { casa: 0.55, auto: 0.27, terreno: 0.18 }

export function goalShare(goal: Goal, goals: Goal[]) {
  const eligibleGoals = goals.filter((item) => item.currency === goal.currency)
  const weight = goalWeights[goal.id] ?? 0.2
  const totalWeight = eligibleGoals.reduce((sum, item) => sum + (goalWeights[item.id] ?? 0.2), 0)
  return totalWeight > 0 ? weight / totalWeight : 1
}

export function estimateGoalMonths(goal: Goal, goals: Goal[], income: number, savingRate: number) {
  const remaining = Math.max(0, goal.target - goal.saved)
  const monthlyContribution = Math.max(1, income * savingRate / 100 * goalShare(goal, goals))
  return Math.ceil(remaining / monthlyContribution)
}

export function estimatedDateLabel(months: number) {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric' }).format(date).replace('.', '').replace(/^./, (letter) => letter.toUpperCase())
}
