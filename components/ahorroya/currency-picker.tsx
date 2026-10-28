'use client'

import type { Currency } from '@/lib/ahorroya-data'

export function CurrencyPicker({ currency, onChange, name = 'currency' }: { currency: Currency; onChange: (value: Currency) => void; name?: string }) {
  return <fieldset className="currency-fieldset">
    <legend>Moneda</legend>
    <div className="currency-options">
      {(['USD', 'ARS'] as const).map((option) => <label className={`currency-option ${currency === option ? 'selected' : ''}`} key={option}>
        <input type="radio" name={name} value={option} checked={currency === option} onChange={() => onChange(option)} />
        <span className="currency-code">{option === 'USD' ? 'USD' : 'ARS'}</span>
        <span className="currency-option-copy"><strong>{option === 'USD' ? 'Dólares' : 'Pesos'}</strong><small>{option === 'USD' ? 'USD' : 'ARS'}</small></span>
      </label>)}
    </div>
  </fieldset>
}
