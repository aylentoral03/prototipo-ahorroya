'use client'

import { useState, type FormEvent } from 'react'
import { ArrowDownLeft, ArrowRight, CalendarDays, Check, CircleHelp, Plus, SlidersHorizontal, TrendingDown, TrendingUp, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency, formatMoney } from '@/lib/ahorroya-data'
import type { BudgetCategory, Movement, NewExpenseInput } from '@/lib/finance-types'
import { MovementIcon } from './illustrations'

export function ExpensesScreen({ movements, budgets, onAddExpense, onUpdateBudget }: { movements: Movement[]; budgets: BudgetCategory[]; onAddExpense: (input: NewExpenseInput) => void; onUpdateBudget: (category: string, limit: number) => void }) {
  const [filter, setFilter] = useState('Todos')
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(budgets[0]?.name ?? '')
  const [budgetDraft, setBudgetDraft] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const categories = ['Todos', ...budgets.map((item) => item.name), ...(movements.some((movement) => movement.category === 'Ingreso') ? ['Ingreso'] : [])]
  const filtered = filter === 'Todos' ? movements : movements.filter((movement) => movement.category === filter)
  const grouped = filtered.reduce<Record<string, Movement[]>>((acc, movement) => { (acc[movement.day] ||= []).push(movement); return acc }, {})
  const total = budgets.reduce((sum, item) => sum + item.amount, 0)
  const budgetLimit = budgets.reduce((sum, item) => sum + item.limit, 0)
  const chartData = budgets.map((item) => ({ ...item, color: item.color }))

  const submitExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      onAddExpense({ merchant, category, amount: Number(amount) })
      setExpenseOpen(false)
      setMerchant('')
      setAmount('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Revisá los datos del gasto.')
    }
  }

  const openBudgetEditor = () => {
    setBudgetDraft(Object.fromEntries(budgets.map((item) => [item.name, String(item.limit)])))
    setError('')
    setBudgetOpen(true)
  }

  const submitBudgets = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const updates = budgets.map((item) => ({ category: item.name, limit: Number(budgetDraft[item.name]) }))
    if (updates.some((item) => !Number.isFinite(item.limit) || item.limit < 1)) {
      setError('Cada límite mensual debe ser mayor a cero.')
      return
    }
    updates.forEach((item) => onUpdateBudget(item.category, item.limit))
    setBudgetOpen(false)
  }

  return <div className="screen-content expenses-screen">
    <header className="page-header"><div><p className="eyebrow">PARA MIRAR SIN CULPA</p><h1>Tu presupuesto</h1></div><button className="round-icon-button" aria-label="Registrar un gasto de ejemplo" onClick={() => { setError(''); setExpenseOpen(true) }}><Plus size={20} /></button></header>
    <div className="demo-inline-note"><CircleHelp size={15} /><span>Datos ficticios · sin conexión bancaria. Registrá gastos de ejemplo y ajustá límites para probar el presupuesto.</span></div>
    <section className="budget-summary"><div className="budget-summary-main"><div><span className="eyebrow">GASTOS REGISTRADOS · DEMO</span><strong>{formatMoney(total)}</strong><small>de {formatMoney(budgetLimit)} en límites mensuales</small></div><div className="budget-summary-ring" style={{ '--budget-progress': `${Math.min(budgetLimit ? total / budgetLimit * 100 : 0, 100) * 3.6}deg` } as React.CSSProperties}><div><strong>{budgetLimit ? Math.round(total / budgetLimit * 100) : 0}%</strong><small>del total</small></div></div></div><div className="budget-summary-footer"><span><i className="budget-dot-spent" /> Gastado este mes</span><span><i className="budget-dot-limit" /> Límite definido</span><span className="budget-comparison"><TrendingDown size={13} /> Comparación ilustrativa</span></div></section>
    <section className="budget-chart-card"><div className="section-heading"><div><p className="eyebrow">SEGUIMIENTO DEL MES</p><h2>Gasto por categoría</h2></div><span className="period-button"><CalendarDays size={13} /> Este mes</span></div><div className="budget-chart-layout"><div className="budget-donut-chart" role="img" aria-label="Distribución ilustrativa de gastos por categoría"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="amount" nameKey="name" innerRadius="66%" outerRadius="90%" paddingAngle={2} stroke="none">{chartData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => [formatCurrency(Number(value), 'ARS'), 'Gastado']} /></PieChart></ResponsiveContainer><div className="budget-donut-center"><strong>{formatMoney(total)}</strong><small>en total</small></div></div><div className="budget-bar-chart" role="img" aria-label="Comparación de gasto y límite mensual por categoría"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 5, right: 4, bottom: 0, left: -15 }}><CartesianGrid stroke="#edf1ec" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#7a887f', fontSize: 9 }} tickLine={false} axisLine={false} interval={0} /><YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} tick={{ fill: '#89958c', fontSize: 8 }} tickLine={false} axisLine={false} width={36} /><Tooltip formatter={(value, name) => [formatCurrency(Number(value), 'ARS'), name === 'Gastado' || name === 'amount' ? 'Gastado' : 'Límite']} /><Bar dataKey="amount" name="Gastado" fill="#315e82" radius={[4, 4, 0, 0]} maxBarSize={20} /><Bar dataKey="limit" name="Límite" fill="#b5c9b7" radius={[4, 4, 0, 0]} maxBarSize={20} /></BarChart></ResponsiveContainer></div></div><div className="budget-chart-legend"><span><i className="budget-dot-spent" /> Gastado</span><span><i className="budget-dot-limit" /> Límite mensual</span></div></section>
    <section className="category-section"><div className="section-heading"><div><p className="eyebrow">EN QUÉ SE VA</p><h2>Límites por categoría</h2></div><button className="budget-edit-button" onClick={openBudgetEditor}><SlidersHorizontal size={14} /> Editar límites</button></div><div className="category-list">{budgets.map((item) => { const percentage = Math.min(item.limit ? item.amount / item.limit * 100 : 0, 100); const over = item.amount > item.limit; return <article className="category-row budget-category-row" key={item.name}><span className="category-emoji" style={{ background: `${item.color}18` }}>{item.icon}</span><div className="category-info"><div><strong>{item.name}</strong><span className={over ? 'category-alert' : 'category-change'}>{over ? 'Superado' : `${Math.round(percentage)}%`}</span></div><div className="category-track budget-progress"><i style={{ width: `${percentage}%`, background: over ? '#c87558' : item.color }} /></div><small className="budget-limit-label">Límite {formatCurrency(item.limit, 'ARS')}</small></div><b>{formatCurrency(item.amount, 'ARS')}</b></article> })}</div><p className="category-footnote">Los límites son orientativos y los podés cambiar cuando quieras.</p></section>
    <section className="movements-section"><div className="section-heading"><div><p className="eyebrow">MOVIMIENTOS</p><h2>Actividad de ejemplo</h2></div><span className="count-pill">{filtered.length} movimientos</span></div><div className="filter-chips" aria-label="Filtrar movimientos">{categories.map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="movement-groups">{Object.entries(grouped).map(([day, items]) => <div className="movement-group" key={day}><h3>{day}</h3>{items.map((movement) => <div className="movement-row" key={movement.id}><span className="movement-icon" style={{ background: movement.tone }}><MovementIcon category={movement.category} /></span><span className="movement-main"><strong>{movement.merchant}</strong><small>{movement.category} · {movement.date}</small></span><b className={movement.category === 'Ingreso' ? 'income-amount' : ''}>{movement.category === 'Ingreso' ? `+${formatCurrency(Math.abs(movement.amount), movement.currency)}` : formatCurrency(movement.amount, movement.currency)}</b></div>)}</div>)}</div>{filtered.length === 0 && <p className="empty-note">No encontramos movimientos para esta categoría.</p>}</section>
    {expenseOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExpenseOpen(false) }}><section className="create-modal budget-modal" role="dialog" aria-modal="true" aria-labelledby="expense-create-title"><button className="modal-close" onClick={() => setExpenseOpen(false)} aria-label="Cerrar"><X size={18} /></button><span className="step-icon"><Plus size={20} /></span><p className="eyebrow">MOVIMIENTO ILUSTRATIVO</p><h2 id="expense-create-title">Registrar un gasto</h2><p className="modal-description">Solo modifica los datos de ejemplo de esta pantalla.</p><form onSubmit={submitExpense}><label className="field-label">Comercio o concepto<input required maxLength={60} value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="Ej. Almacén de barrio" /></label><label className="field-label">Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}>{budgets.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label className="field-label">Importe<span className="money-input"><span>$</span><input required inputMode="numeric" min="1" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} placeholder="12.500" /></span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary modal-submit" type="submit">Guardar gasto demo <ArrowRight size={16} /></button></form></section></div>}
    {budgetOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBudgetOpen(false) }}><section className="create-modal budget-modal" role="dialog" aria-modal="true" aria-labelledby="budget-edit-title"><button className="modal-close" onClick={() => setBudgetOpen(false)} aria-label="Cerrar"><X size={18} /></button><span className="step-icon"><SlidersHorizontal size={19} /></span><p className="eyebrow">TU PRESUPUESTO, A TU MEDIDA</p><h2 id="budget-edit-title">Editar límites</h2><p className="modal-description">Definí cuánto te gustaría destinar a cada categoría este mes.</p><form onSubmit={submitBudgets}><div className="budget-edit-list">{budgets.map((item) => <label className="field-label" key={item.name}>{item.name}<span className="money-input"><span>$</span><input required inputMode="numeric" min="1" value={budgetDraft[item.name] ?? ''} onChange={(event) => setBudgetDraft((current) => ({ ...current, [item.name]: event.target.value.replace(/\D/g, '') }))} /></span></label>)}</div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary modal-submit" type="submit"><Check size={16} /> Guardar límites</button></form></section></div>}
  </div>
}
