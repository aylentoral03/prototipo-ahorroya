'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Home, LockKeyhole, Wallet } from 'lucide-react'
import { formatCurrency, type Currency } from '@/lib/ahorroya-data'
import { CurrencyPicker } from './currency-picker'

export type SetupValues = { goalName: string; goalTarget: number; goalEmoji: string; goalDeadline: string; goalCurrency: Currency; percentage: number; income: number; incomeCurrency: Currency }

const emojiChoices = ['🏡', '🚙', '🌿', '✈️', '🎓']

export function Onboarding({ onComplete }: { onComplete: (values: SetupValues) => void }) {
  const [step, setStep] = useState(0)
  const [provider, setProvider] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [goalName, setGoalName] = useState('Mi casa')
  const [goalTarget, setGoalTarget] = useState('120000')
  const [goalEmoji, setGoalEmoji] = useState('🏡')
  const [goalCurrency, setGoalCurrency] = useState<Currency>('USD')
  const [incomeCurrency, setIncomeCurrency] = useState<Currency>('USD')
  const [income, setIncome] = useState('3500')
  const [goalDeadline, setGoalDeadline] = useState('Oct 2029')
  const [percentage, setPercentage] = useState(15)
  const numericIncome = Number(income) || 0

  const connect = (name: string) => {
    setProvider(name)
    setConnecting(true)
    window.setTimeout(() => { setConnecting(false); setConnected(true) }, 1500)
  }

  const next = () => setStep((current) => Math.min(2, current + 1))
  const back = () => setStep((current) => Math.max(0, current - 1))

  return (
    <main className="onboarding-shell">
      <div className="onboarding-top"><div className="brand-lockup"><span className="brand-mark">a.</span><span>AhorroYa</span></div><span className="onboarding-count">{step + 1} <span>/ 3</span></span></div>
      <div className="onboarding-progress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
      <section className="onboarding-content" key={step}>
        {step === 0 && <div className="welcome-step">
          <div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun">✦</div><div className="art-card"><span>Tu casa</span><strong>US$ 4.850</strong><div className="art-progress"><i /></div><small>6% del camino</small></div><div className="art-leaf leaf-one">✳</div><div className="art-leaf leaf-two">✳</div></div>
          <p className="eyebrow">PASO 1 · TU NUEVO COMIENZO</p>
          <h1>Ahorrá sin pensarlo.<br /><em>Mirá tu meta acercarse.</em></h1>
          <p className="onboarding-copy">AhorroYa separa una parte de tus ingresos antes de que puedas gastarla. Así, tus planes también tienen lugar en tu día a día.</p>
          <button className="button-primary onboarding-cta" onClick={next}>Empezar <ArrowRight size={18} /></button>
          <p className="trust-note"><LockKeyhole size={14} /> Tus datos, siempre bajo tu control</p>
        </div>}

        {step === 1 && <div className="setup-step">
          <div className="step-icon"><Wallet size={22} /></div>
          <p className="eyebrow">PASO 2 · TU PLATA, A LA VISTA</p>
          <h1>Conectá tu banco<br />o billetera</h1>
          <p className="onboarding-copy">Así podemos ayudarte a entender cómo se mueve tu plata. Es una simulación, no se conecta a ningún banco real.</p>
          <div className="provider-list">
            {['Banco Demo', 'Billetera Demo'].map((name, index) => <button className={`provider-option ${connected && provider === name ? 'is-connected' : ''}`} key={name} onClick={() => !connecting && connect(name)} disabled={connecting}>
              <span className={`provider-icon provider-${index}`}><Wallet size={20} /></span><span className="provider-name"><strong>{name}</strong><small>{index === 0 ? 'Tu cuenta sueldo' : 'Tu billetera digital'}</small></span>
              {connecting && provider === name ? <span className="spinner" aria-label="Conectando" /> : connected && provider === name ? <Check className="connected-check" size={21} /> : <ArrowRight size={18} className="provider-arrow" />}
            </button>)}
          </div>
          {connected ? <div className="connection-success"><span className="success-dot" /> Conectado a {provider}</div> : <div className="privacy-note"><LockKeyhole size={17} /><span><strong>Solo lectura</strong><small>Nunca movemos tu plata sin tu permiso.</small></span></div>}
          <div className="onboarding-actions"><button className="button-quiet" onClick={back}><ArrowLeft size={17} /> Atrás</button><button className="button-primary" onClick={next} disabled={!connected}>Seguir <ArrowRight size={17} /></button></div>
          {!connected && <button className="skip-link" onClick={next}>Explorar sin conectar</button>}
        </div>}

        {step === 2 && <div className="setup-step goal-step">
          <div className="step-icon"><Home size={22} /></div>
          <p className="eyebrow">PASO 3 · TU PRIMER PLAN</p>
          <h1>¿Qué querés<br />hacer realidad?</h1>
          <p className="onboarding-copy">Elegí una meta para empezar. Después podés sumar todas las que quieras.</p>
          <div className="goal-emoji-picker" aria-label="Elegí un ícono">{emojiChoices.map((emoji) => <button type="button" key={emoji} onClick={() => setGoalEmoji(emoji)} className={goalEmoji === emoji ? 'selected' : ''} aria-label={`Elegir ${emoji}`}>{emoji}</button>)}</div>
          <label className="field-label">Nombre de tu meta<input value={goalName} onChange={(event) => setGoalName(event.target.value)} placeholder="Ej. Mi casa" /></label>
          <CurrencyPicker currency={goalCurrency} onChange={setGoalCurrency} name="goal-currency" />
          <label className="field-label">¿Cuánto necesitás?<span className="money-input"><span>{goalCurrency === 'USD' ? 'US$' : '$'}</span><input inputMode="numeric" value={Number(goalTarget).toLocaleString('es-AR')} onChange={(event) => setGoalTarget(event.target.value.replace(/\D/g, ''))} /></span></label>
          <label className="field-label">¿Para cuándo te gustaría?<select value={goalDeadline} onChange={(event) => setGoalDeadline(event.target.value)}><option>Oct 2028</option><option>Oct 2029</option><option>Oct 2030</option><option>Dic 2031</option></select></label>
          <div className="onboarding-income"><CurrencyPicker currency={incomeCurrency} onChange={setIncomeCurrency} name="onboarding-income-currency" /><label className="field-label">Tu ingreso mensual aproximado<span className="money-input"><span>{incomeCurrency === 'USD' ? 'US$' : '$'}</span><input inputMode="numeric" value={income ? Number(income).toLocaleString('es-AR') : ''} onChange={(event) => setIncome(event.target.value.replace(/\D/g, ''))} placeholder={incomeCurrency === 'USD' ? '3.500' : '1.250.000'} /></span></label></div>
          <div className="saving-rate-box">
            <div className="rate-heading"><span>De cada ingreso, guardar</span><strong>{percentage}%</strong></div>
            <input aria-label="Porcentaje de ahorro" className="range-input" type="range" min="5" max="40" step="1" value={percentage} style={{ '--range-progress': `${((percentage - 5) / 35) * 100}%` } as React.CSSProperties} onChange={(event) => setPercentage(Number(event.target.value))} />
            <div className="range-labels"><span>5%</span><span>40%</span></div>
            <p>Si cobrás <strong>{formatCurrency(numericIncome, incomeCurrency)}</strong>, apartamos <strong className="green-text">{formatCurrency(numericIncome * percentage / 100, incomeCurrency)}</strong></p>
            <small className="currency-note">Tus metas en dólares reciben ingresos en dólares. No convertimos entre monedas.</small>
          </div>
          <div className="onboarding-actions"><button className="button-quiet" onClick={back}><ArrowLeft size={17} /> Atrás</button><button className="button-primary" onClick={() => onComplete({ goalName: goalName.trim() || 'Mi casa', goalTarget: Number(goalTarget) || (goalCurrency === 'USD' ? 120_000 : 18_000_000), goalEmoji, goalDeadline, goalCurrency, percentage, income: numericIncome || (incomeCurrency === 'USD' ? 3_500 : 1_250_000), incomeCurrency })}>Ver mi plan <ArrowRight size={17} /></button></div>
        </div>}
      </section>
      <footer className="onboarding-footer">Hecho para que tus planes también lleguen a fin de mes.</footer>
    </main>
  )
}
