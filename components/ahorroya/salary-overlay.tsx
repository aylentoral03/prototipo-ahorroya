'use client'

import { useEffect } from 'react'
import { ArrowDown, Check, Sparkles, X } from 'lucide-react'
import { formatCurrency, type Currency, type Goal } from '@/lib/ahorroya-data'

type Phase = 'entering' | 'dividing' | 'done'

export function SalaryOverlay({ phase, income, currency, saved, spendable, goals, onClose }: { phase: Phase; income: number; currency: Currency; saved: number; spendable: number; goals: Goal[]; onClose: () => void }) {
  useEffect(() => {
    if (phase !== 'done') return
    const handle = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(handle)
  }, [phase, onClose])

  return <div className="modal-backdrop salary-backdrop" role="dialog" aria-modal="true" aria-labelledby="salary-title">
    <div className={`salary-modal salary-${phase}`}>
      {phase === 'done' && <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>}
      <div className="salary-sparkle sparkle-a">✦</div><div className="salary-sparkle sparkle-b">✧</div>
      <div className="salary-icon"><span>{phase === 'done' ? <Check size={30} /> : <ArrowDown size={30} />}</span></div>
      <p className="eyebrow">{phase === 'done' ? 'ESO ES TODO' : 'SIMULACIÓN DE INGRESO'}</p>
      <h2 id="salary-title">{phase === 'entering' ? '¡Llegó tu sueldo!' : phase === 'dividing' ? 'Tu plata ya tiene plan' : 'Ya ahorraste sin pensarlo'}</h2>
      <p className="salary-description">{phase === 'entering' ? 'Mirá cómo se organiza tu plata automáticamente.' : phase === 'dividing' ? 'Apartamos tu ahorro antes de que puedas gastarlo.' : 'Un paso más cerca de eso que soñás.'}</p>
      <div className={`salary-amount ${phase !== 'entering' ? 'is-visible' : ''}`}><span>Ingresó a tu cuenta</span><strong>{formatCurrency(income, currency)}</strong></div>
      <div className={`salary-split ${phase === 'entering' ? 'split-hidden' : ''}`}>
        <div className="split-row"><span className="split-icon saved"><Sparkles size={17} /></span><span><strong>Para tus metas</strong><small>{goals.filter((goal) => goal.currency === currency).length} metas en {currency === 'USD' ? 'dólares' : 'pesos'}</small></span><b>{formatCurrency(saved, currency)}</b></div>
        <div className="split-bar"><i style={{ width: `${Math.min(100, (saved / income) * 100)}%` }} /></div>
        <div className="split-row"><span className="split-icon available"><Check size={17} /></span><span><strong>Para vos, hoy</strong><small>Disponible para lo que necesites</small></span><b>{formatCurrency(spendable, currency)}</b></div>
      </div>
      <div className="salary-confetti" aria-hidden="true">{['✦', '·', '✧', '·', '✦', '·', '✧', '·'].map((symbol, index) => <span key={index} style={{ '--confetti-index': index } as React.CSSProperties}>{symbol}</span>)}</div>
      {phase === 'done' && <button className="button-primary salary-done-button" onClick={onClose}>Seguir con mi día <Check size={17} /></button>}
      {phase !== 'done' && <div className="salary-loader"><span /><span /><span /></div>}
    </div>
  </div>
}
