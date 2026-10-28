'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Home, LockKeyhole, Wallet } from 'lucide-react'
import { formatCurrency, type Currency } from '@/lib/ahorroya-data'
import { APP_NAME } from '@/lib/ahorria-config'
import { CurrencyPicker } from './currency-picker'
import { GoalIcon, goalIconOptions } from './illustrations'

export type SetupValues = { goalName: string; goalTarget: number; goalEmoji: string; goalDeadline: string; goalCurrency: Currency; percentage: number; income: number; incomeCurrency: Currency }

export function Onboarding({ onComplete }: { onComplete: (values: SetupValues) => void }) {
  const [step, setStep] = useState(0)
  const [goalName, setGoalName] = useState('Mi casa')
  const [goalTarget, setGoalTarget] = useState('120000')
  const [goalEmoji, setGoalEmoji] = useState('🏡')
  const [goalCurrency, setGoalCurrency] = useState<Currency>('USD')
  const [incomeCurrency, setIncomeCurrency] = useState<Currency>('USD')
  const [income, setIncome] = useState('3500')
  const [goalDeadline, setGoalDeadline] = useState('Oct 2029')
  const [percentage, setPercentage] = useState(15)
  const numericIncome = Number(income) || 0

  const next = () => setStep((current) => Math.min(2, current + 1))
  const back = () => setStep((current) => Math.max(0, current - 1))

  return (
    <main className="onboarding-shell">
      <div className="onboarding-top"><div className="brand-lockup"><span className="brand-mark">a.</span><span>{APP_NAME}</span></div><span className="onboarding-count">{step + 1} <span>/ 3</span></span></div>
      <div className="onboarding-progress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
      <section className="onboarding-content" key={step}>
        {step === 0 && <div className="welcome-step">
          <div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun">✦</div><div className="art-card"><span>Tu casa</span><strong>USD 4.850</strong><div className="art-progress"><i /></div><small>6% del camino</small></div><div className="art-leaf leaf-one">✳</div><div className="art-leaf leaf-two">✳</div></div>
          <p className="eyebrow">PASO 1 · TU NUEVO COMIENZO</p>
          <h1>Ahorrá sin pensarlo.<br /><em>Mirá tu meta acercarse.</em></h1>
          <p className="onboarding-copy">Probá cómo una parte de cada ingreso podría acompañar tus metas. Sin promesas: vos elegís cuánto y cuándo.</p>
          <button className="button-primary onboarding-cta" onClick={next}>Empezar <ArrowRight size={18} /></button>
          <p className="trust-note"><LockKeyhole size={14} /> Tus datos, siempre bajo tu control</p>
        </div>}

        {step === 1 && <div className="setup-step">
          <div className="step-icon"><Wallet size={22} /></div>
          <p className="eyebrow">PASO 2 · UN PUNTO DE PARTIDA</p>
          <h1>Empezá con datos<br />de ejemplo</h1>
          <p className="onboarding-copy">Usamos cifras ficticias para que puedas recorrer la aplicación sin conectar una cuenta ni compartir información sensible.</p>
          <div className="onboarding-demo-values"><div><span>Saldo disponible</span><strong>$684.500</strong><small>Pesos argentinos · demo</small></div><div><span>Gastos del mes</span><strong>$857.347</strong><small>Movimientos ilustrativos</small></div></div>
          <div className="privacy-note"><LockKeyhole size={17} /><span><strong>Sin conexiones financieras</strong><small>No se mueve ni se guarda dinero real.</small></span></div>
          <div className="onboarding-actions"><button className="button-quiet" onClick={back}><ArrowLeft size={17} /> Atrás</button><button className="button-primary" onClick={next}>Seguir <ArrowRight size={17} /></button></div>
        </div>}

        {step === 2 && <div className="setup-step goal-step">
          <div className="step-icon"><Home size={22} /></div>
          <p className="eyebrow">PASO 3 · TU PRIMER PLAN</p>
          <h1>¿Qué querés<br />hacer realidad?</h1>
          <p className="onboarding-copy">Elegí una meta para empezar. Después podés sumar todas las que quieras.</p>
          <div className="goal-emoji-picker" role="group" aria-label="Elegí un ícono">{goalIconOptions.map((option) => <button type="button" key={option.value} onClick={() => setGoalEmoji(option.value)} className={goalEmoji === option.value ? 'selected' : ''} aria-label={`Elegir ${option.label}`} aria-pressed={goalEmoji === option.value}><GoalIcon value={option.value} /></button>)}</div>
          <label className="field-label">Nombre de tu meta<input value={goalName} onChange={(event) => setGoalName(event.target.value)} placeholder="Ej. Mi casa" /></label>
          <CurrencyPicker currency={goalCurrency} onChange={setGoalCurrency} name="goal-currency" />
          <label className="field-label">¿Cuánto necesitás?<span className="money-input"><span>{goalCurrency === 'USD' ? 'USD' : '$'}</span><input inputMode="numeric" value={Number(goalTarget).toLocaleString('es-AR')} onChange={(event) => setGoalTarget(event.target.value.replace(/\D/g, ''))} /></span></label>
          <label className="field-label">¿Para cuándo te gustaría?<select value={goalDeadline} onChange={(event) => setGoalDeadline(event.target.value)}><option>Oct 2028</option><option>Oct 2029</option><option>Oct 2030</option><option>Dic 2031</option></select></label>
          <div className="onboarding-income"><CurrencyPicker currency={incomeCurrency} onChange={setIncomeCurrency} name="onboarding-income-currency" /><label className="field-label">Tu ingreso mensual aproximado<span className="money-input"><span>{incomeCurrency === 'USD' ? 'USD' : '$'}</span><input inputMode="numeric" value={income ? Number(income).toLocaleString('es-AR') : ''} onChange={(event) => setIncome(event.target.value.replace(/\D/g, ''))} placeholder={incomeCurrency === 'USD' ? '3.500' : '1.250.000'} /></span></label></div>
          <div className="saving-rate-box">
            <div className="rate-heading"><span>De cada ingreso, guardar</span><strong>{percentage}%</strong></div>
            <input aria-label="Porcentaje de ahorro" className="range-input" type="range" min="5" max="40" step="1" value={percentage} style={{ '--range-progress': `${((percentage - 5) / 35) * 100}%` } as React.CSSProperties} onChange={(event) => setPercentage(Number(event.target.value))} />
            <div className="range-labels"><span>5%</span><span>40%</span></div>
            <p>Si cobrás <strong>{formatCurrency(numericIncome, incomeCurrency)}</strong>, podrías separar <strong className="green-text">{formatCurrency(numericIncome * percentage / 100, incomeCurrency)}</strong></p>
            <small className="currency-note">Tus metas en dólares reciben ingresos en dólares. No convertimos entre monedas.</small>
          </div>
          <div className="onboarding-actions"><button className="button-quiet" onClick={back}><ArrowLeft size={17} /> Atrás</button><button className="button-primary" onClick={() => onComplete({ goalName: goalName.trim() || 'Mi casa', goalTarget: Number(goalTarget) || (goalCurrency === 'USD' ? 120_000 : 18_000_000), goalEmoji, goalDeadline, goalCurrency, percentage, income: numericIncome || (incomeCurrency === 'USD' ? 3_500 : 1_250_000), incomeCurrency })}>Ver mi plan <ArrowRight size={17} /></button></div>
        </div>}
      </section>
      <footer className="onboarding-footer">Hecho para que tus planes también lleguen a fin de mes.</footer>
    </main>
  )
}
