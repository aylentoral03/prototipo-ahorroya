'use client'

import { useState, type FormEvent } from 'react'
import { ArrowDownLeft, ArrowRight, Check, CircleAlert, CreditCard, Plus, ShieldCheck, Wallet, X } from 'lucide-react'
import { formatCurrency } from '@/lib/ahorroya-data'
import type { Currency, Debt, NewDebtInput } from '@/lib/finance-types'

const debtKinds: NewDebtInput['kind'][] = ['Tarjeta', 'Préstamo', 'Cuotas']

export function DebtsScreen({ debts, onCreate, onPayment }: { debts: Debt[]; onCreate: (input: NewDebtInput) => void; onPayment: (debtId: string, amount: number) => void }) {
  const [creating, setCreating] = useState(false)
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null)
  const [name, setName] = useState('')
  const [creditor, setCreditor] = useState('')
  const [balance, setBalance] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [kind, setKind] = useState<NewDebtInput['kind']>('Tarjeta')
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [error, setError] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const totalARS = debts.filter((debt) => debt.currency === 'ARS').reduce((sum, debt) => sum + debt.balance, 0)
  const totalUSD = debts.filter((debt) => debt.currency === 'USD').reduce((sum, debt) => sum + debt.balance, 0)
  const monthlyARS = debts.filter((debt) => debt.currency === 'ARS').reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  const submitDebt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      onCreate({ name, creditor, balance: Number(balance), monthlyPayment: Number(monthlyPayment) || 0, dueDate: '10/12/2026', kind, currency })
      setCreating(false)
      setName('')
      setCreditor('')
      setBalance('')
      setMonthlyPayment('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos guardar esta deuda.')
    }
  }

  const submitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!payingDebt) return
    setError('')
    try {
      onPayment(payingDebt.id, Number(paymentAmount))
      setPayingDebt(null)
      setPaymentAmount('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Revisá el importe.')
    }
  }

  return <div className="screen-content debts-screen">
    <header className="page-header"><div><p className="eyebrow">ORDENAR TAMBIÉN ES AVANZAR</p><h1>Tus deudas</h1></div><button className="round-icon-button" aria-label="Agregar deuda de ejemplo" onClick={() => { setError(''); setCreating(true) }}><Plus size={20} /></button></header>
    <div className="demo-inline-note"><ShieldCheck size={15} /><span>Datos de ejemplo. Registrar un pago solo actualiza esta vista; no se realiza ningún movimiento de dinero.</span></div>
    <section className="debt-overview"><div className="debt-overview-copy"><span>SALDO PENDIENTE ILUSTRATIVO</span><strong>{formatCurrency(totalARS, 'ARS')}</strong><small>Las deudas en cada moneda se muestran por separado.</small><div className="debt-currency-row"><span>ARS <b>{formatCurrency(totalARS, 'ARS')}</b></span><span>USD <b>{formatCurrency(totalUSD, 'USD')}</b></span></div></div><span className="debt-overview-icon"><CreditCard size={22} /></span></section>
    <section className="debt-monthly-summary"><span className="debt-monthly-icon"><Wallet size={17} /></span><div><strong>Pagos mensuales estimados</strong><small>Solo para ayudarte a organizarte · sin débitos automáticos</small></div><b>{formatCurrency(monthlyARS, 'ARS')}<small> / mes</small></b></section>
    <div className="section-heading debt-list-heading"><div><p className="eyebrow">PLANIFICÁ A TU RITMO</p><h2>Deudas registradas</h2></div><span className="count-pill">{debts.length} {debts.length === 1 ? 'deuda' : 'deudas'}</span></div>
    {debts.length === 0 ? <div className="debt-empty"><span><CreditCard size={21} /></span><strong>Todavía no cargaste deudas</strong><p>Podés sumar una para tener una vista más completa de tu presupuesto.</p><button className="button-primary" onClick={() => setCreating(true)}>Agregar deuda <Plus size={16} /></button></div> : <div className="debt-list">{debts.map((debt) => {
      const paid = Math.max(0, debt.originalBalance - debt.balance)
      const progress = debt.originalBalance > 0 ? Math.round(paid / debt.originalBalance * 100) : 100
      return <article className="debt-card" key={debt.id}><div className="debt-card-heading"><span className="debt-card-icon"><CreditCard size={18} /></span><div><strong>{debt.name}</strong><small>{debt.creditor} · {debt.kind}</small></div><span className="debt-balance-badge">{debt.balance === 0 ? 'Saldada' : 'Pendiente'}</span></div><div className="debt-balance-line"><span>Saldo actual</span><strong>{formatCurrency(debt.balance, debt.currency)}</strong></div><div className="debt-progress-track" aria-label={`${progress}% del saldo original cubierto`}><i style={{ width: `${progress}%` }} /></div><div className="debt-progress-caption"><span>{progress}% del saldo cubierto</span><span>Vencimiento de ejemplo · {debt.dueDate}</span></div><div className="debt-card-footer"><span>Cuota estimada <strong>{formatCurrency(debt.monthlyPayment, debt.currency)} / mes</strong></span><button type="button" disabled={debt.balance === 0} onClick={() => { setError(''); setPayingDebt(debt); setPaymentAmount(String(Math.min(debt.balance, debt.monthlyPayment || debt.balance))) }}>Registrar pago demo <ArrowRight size={14} /></button></div></article>
    })}</div>}
    <section className="debt-reminder"><span><CircleAlert size={17} /></span><p><strong>Una guía, no asesoramiento financiero.</strong> La demo no calcula intereses, cargos ni vencimientos reales. Verificá las condiciones directamente con cada entidad.</p></section>
    {creating && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreating(false) }}><section className="create-modal debt-modal" role="dialog" aria-modal="true" aria-labelledby="debt-create-title"><button className="modal-close" onClick={() => setCreating(false)} aria-label="Cerrar"><X size={18} /></button><span className="step-icon"><Plus size={20} /></span><p className="eyebrow">SOLO PARA TU ORGANIZACIÓN</p><h2 id="debt-create-title">Sumar una deuda</h2><p className="modal-description">Los datos se guardan únicamente en el estado de esta demo.</p><form onSubmit={submitDebt}><label className="field-label">Nombre<input required maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Tarjeta principal" /></label><label className="field-label">Entidad o comercio<input required maxLength={60} value={creditor} onChange={(event) => setCreditor(event.target.value)} placeholder="Ej. Banco Demo" /></label><label className="field-label">Tipo<select value={kind} onChange={(event) => setKind(event.target.value as NewDebtInput['kind'])}>{debtKinds.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Moneda<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="ARS">Pesos argentinos (ARS)</option><option value="USD">Dólares (USD)</option></select></label><label className="field-label">Saldo pendiente<span className="money-input"><span>{currency === 'USD' ? 'USD' : '$'}</span><input required inputMode="numeric" min="1" value={balance} onChange={(event) => setBalance(event.target.value.replace(/\D/g, ''))} placeholder={currency === 'USD' ? '1.200' : '120.000'} /></span></label><label className="field-label">Pago mensual estimado<span className="money-input"><span>{currency === 'USD' ? 'USD' : '$'}</span><input inputMode="numeric" min="0" value={monthlyPayment} onChange={(event) => setMonthlyPayment(event.target.value.replace(/\D/g, ''))} placeholder="0" /></span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary modal-submit" type="submit">Guardar en la demo <ArrowRight size={16} /></button></form></section></div>}
    {payingDebt && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPayingDebt(null) }}><section className="create-modal debt-modal" role="dialog" aria-modal="true" aria-labelledby="debt-payment-title"><button className="modal-close" onClick={() => setPayingDebt(null)} aria-label="Cerrar"><X size={18} /></button><span className="step-icon"><ArrowDownLeft size={20} /></span><p className="eyebrow">REGISTRO ILUSTRATIVO</p><h2 id="debt-payment-title">Anotar un pago</h2><p className="modal-description">{payingDebt.name} · saldo {formatCurrency(payingDebt.balance, payingDebt.currency)}.</p><form onSubmit={submitPayment}><label className="field-label">Importe del pago<span className="money-input"><span>{payingDebt.currency === 'USD' ? 'USD' : '$'}</span><input required inputMode="numeric" min="1" max={payingDebt.balance} value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value.replace(/\D/g, ''))} /></span></label>{error && <p className="form-error" role="alert">{error}</p>}<p className="debt-modal-note"><Check size={14} /> No se contacta a la entidad ni se hace un débito.</p><button className="button-primary modal-submit" type="submit">Actualizar saldo de demo <ArrowRight size={16} /></button></form></section></div>}
  </div>
}
