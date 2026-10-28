'use client'

import { useState } from 'react'
import { ArrowDownLeft, ArrowRight, X } from 'lucide-react'
import { formatCurrency } from '@/lib/ahorroya-data'
import { CurrencyPicker } from './currency-picker'
import type { Currency } from '@/lib/finance-types'

export function IncomeEntry({ initialAmount, initialCurrency, savingRate, onClose, onSubmit }: { initialAmount: number; initialCurrency: Currency; savingRate: number; onClose: () => void; onSubmit: (amount: number, currency: Currency) => void }) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency)
  const [amount, setAmount] = useState(String(initialAmount))
  const numericAmount = Number(amount) || 0
  const plannedSaving = Math.round(numericAmount * savingRate / 100)

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="income-title">
    <div className="create-modal income-entry-modal">
      <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
      <span className="step-icon"><ArrowDownLeft size={21} /></span>
      <p className="eyebrow">INGRESO ILUSTRATIVO</p>
      <h2 id="income-title">¿Cuánta plata entró?</h2>
      <p className="modal-description">Anotalo en la demo. No conecta cuentas ni mueve dinero real; pesos y dólares quedan separados.</p>
      <CurrencyPicker currency={currency} onChange={setCurrency} name="income-currency" />
      <label className="field-label">Monto recibido<span className="money-input"><span>{currency === 'USD' ? 'USD' : '$'}</span><input autoFocus inputMode="decimal" value={amount ? Number(amount).toLocaleString('es-AR') : ''} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} placeholder={currency === 'USD' ? '3.500' : '1.250.000'} /></span></label>
      <div className="income-allocation-preview"><span>En la demo, separaríamos</span><strong>{formatCurrency(plannedSaving, currency)}</strong><small>{savingRate}% del ingreso · el resto queda disponible en {currency === 'USD' ? 'dólares' : 'pesos'}</small></div>
      <button className="button-primary modal-submit" disabled={numericAmount <= 0} onClick={() => onSubmit(numericAmount, currency)}>Continuar <ArrowRight size={17} /></button>
    </div>
  </div>
}
