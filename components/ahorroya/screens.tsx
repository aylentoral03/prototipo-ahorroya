'use client'

import { useRef, useState } from 'react'
import { ArrowDownLeft, ArrowLeft, ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3, Plus, Sparkles, TrendingDown, TrendingUp, Wallet, X } from 'lucide-react'
import { categoryBudgets, estimateGoalMonths, estimatedDateLabel, formatMoney, goalShare, tips, type Goal, type Movement } from '@/lib/ahorroya-data'

function ProgressBar({ value, color = 'var(--green)' }: { value: number; color?: string }) {
  return <div className="progress-track"><span style={{ width: `${Math.max(0, Math.min(value, 100))}%`, background: color }} /></div>
}

function formatDuration(months: number) {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
  return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
}

export function GoalCard({ goal, goals, income, savingRate, onClick }: { goal: Goal; goals: Goal[]; income: number; savingRate: number; onClick: () => void }) {
  const progress = Math.min((goal.saved / goal.target) * 100, 100)
  return <button className="goal-card" onClick={onClick}>
    <div className="goal-card-top"><span className="goal-emoji">{goal.emoji}</span><span className="goal-card-arrow"><ArrowRight size={16} /></span></div>
    <strong className="goal-name">{goal.name}</strong>
    <span className="goal-saved">{formatMoney(goal.saved)} <small>de {formatMoney(goal.target)}</small></span>
    <ProgressBar value={progress} color={goal.color} />
    <div className="goal-card-bottom"><span>{Math.round(progress)}% alcanzado</span><span><CalendarDays size={12} /> {estimatedDateLabel(estimateGoalMonths(goal, goals, income, savingRate))}</span></div>
  </button>
}

export function HomeScreen({ spendable, goals, income, savingRate, onGoal, onSalary, salaryCount }: { spendable: number; goals: Goal[]; income: number; savingRate: number; onGoal: (id: string) => void; onSalary: () => void; salaryCount: number }) {
  return <div className="screen-content home-screen">
    <header className="page-header"><div><p className="greeting">{new Date().getHours() < 12 ? 'Buen día' : new Date().getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'}, Vale</p><h1>Tu plata, en calma.</h1></div><span className="round-icon-button passive-icon" aria-hidden="true"><Bell size={19} /><i /></span></header>
    <section className="spend-card"><div className="spend-card-top"><span><span className="status-pulse" /> DISPONIBLE PARA VOS</span><CircleHelp size={17} /></div><p>Hoy podés gastar tranquilo</p><h2>{formatMoney(spendable)}</h2><div className="spend-divider" /><div className="spend-explanation"><span className="spend-check"><Check size={14} /></span><span>Ya descontamos lo que decidiste ahorrar. <strong>Lo demás es tuyo.</strong></span></div><div className="spend-decoration" aria-hidden="true"><i /><i /><i /></div></section>
    <section className="section-block goals-preview"><div className="section-heading"><div><p className="eyebrow">TUS PLANES</p><h2>Lo que estás construyendo</h2></div><button className="text-button" onClick={() => onGoal(goals[0]?.id)} aria-label="Ver tus metas">Ver todas <ArrowRight size={15} /></button></div><div className="goal-scroll">{goals.slice(0, 3).map((goal) => <GoalCard key={goal.id} goal={goal} goals={goals} income={income} savingRate={savingRate} onClick={() => onGoal(goal.id)} />)}</div></section>
    <section className="leak-card"><div className="leak-icon"><TrendingUp size={19} /></div><div className="leak-copy"><p>UNA FUGA QUE ENCONTRAMOS</p><strong>El delivery creció un 42%</strong><span>respecto al mes pasado. Un dato para tener en cuenta, sin culpas.</span></div><ArrowRight className="leak-arrow" size={17} /></section>
    <section className="gentle-nudge"><span className="nudge-icon">✳</span><p>Vas bien. <strong>Ahorrar también es darte tranquilidad.</strong></p></section>
    <button className="salary-fab" onClick={onSalary}><span><ArrowDownLeft size={18} /></span>{salaryCount > 0 ? 'Simular otro sueldo' : 'Simular sueldo'}<Plus size={17} className="fab-plus" /></button>
  </div>
}

export function GoalsScreen({ goals, income, savingRate, onGoal, onCreate }: { goals: Goal[]; income: number; savingRate: number; onGoal: (id: string) => void; onCreate: () => void }) {
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0)
  return <div className="screen-content">
    <header className="page-header"><div><p className="eyebrow">PASO A PASO</p><h1>Tus metas</h1></div><button className="round-icon-button" aria-label="Crear nueva meta" onClick={onCreate}><Plus size={20} /></button></header>
    <section className="goals-total-card"><div><span>Entre todas tus metas</span><strong>{formatMoney(totalSaved)}</strong><small>ya tienen un destino</small></div><span className="total-sparkle">✳</span><div className="total-dots"><i /><i /><i /><i /><i /></div></section>
    <div className="section-heading list-heading"><div><p className="eyebrow">EN MARCHA</p><h2>Todo lo que soñás</h2></div><span className="count-pill">{goals.length} metas</span></div>
    <div className="goals-list">{goals.map((goal) => <button className="goal-list-item" key={goal.id} onClick={() => onGoal(goal.id)}><span className="goal-list-emoji">{goal.emoji}</span><span className="goal-list-main"><strong>{goal.name}</strong><small>{formatMoney(goal.saved)} de {formatMoney(goal.target)}</small><ProgressBar value={goal.saved / goal.target * 100} color={goal.color} /></span><span className="goal-list-side"><strong>{Math.round(goal.saved / goal.target * 100)}%</strong><small>{estimatedDateLabel(estimateGoalMonths(goal, goals, income, savingRate))}</small></span><ChevronRight size={17} /></button>)}</div>
    <button className="create-goal-button" onClick={onCreate}><span><Plus size={19} /></span><div><strong>Sumar otra meta</strong><small>Un plan nuevo también merece su lugar</small></div><ArrowRight size={17} /></button>
    <div className="motivation-note"><Sparkles size={17} /><p><strong>Cada aporte cuenta.</strong> No importa el monto, sino el hábito que estás creando.</p></div>
  </div>
}

export function GoalDetailScreen({ goal, goals, income, savingRate, onBack, onWithdraw }: { goal: Goal; goals: Goal[]; income: number; savingRate: number; onBack: () => void; onWithdraw: (id: string, amount: number) => void }) {
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(Math.min(50_000, Math.max(1, goal.saved)))
  const [extraPercent, setExtraPercent] = useState(5)
  const [holding, setHolding] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const monthlyContribution = Math.max(1, income * savingRate / 100 * goalShare(goal, goals))
  const monthsRemaining = Math.max(0, goal.target - goal.saved)
  const currentMonths = Math.max(1, estimateGoalMonths(goal, goals, income, savingRate))
  const fasterMonths = Math.max(1, Math.ceil(monthsRemaining / (monthlyContribution * (1 + extraPercent / 100))))
  const percent = Math.min(100, goal.saved / goal.target * 100)
  const monthsSaved = Math.max(0, currentMonths - fasterMonths)
  const monthsBehind = Math.max(1, Math.ceil(withdrawAmount / monthlyContribution))

  const startHold = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setHolding(true)
    timer.current = window.setTimeout(() => {
      onWithdraw(goal.id, withdrawAmount)
      setHolding(false)
      setWithdrawOpen(false)
    }, 3000)
  }
  const stopHold = () => { if (timer.current) window.clearTimeout(timer.current); setHolding(false) }

  return <div className="screen-content detail-screen">
    <button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Todas tus metas</button>
    <div className="detail-hero"><span className="detail-orbit orbit-left" /><span className="detail-orbit orbit-right" /><span className="detail-big-emoji">{goal.emoji}</span><p className="eyebrow">TU PLAN, A TU RITMO</p><h1>{goal.name}</h1><span className="detail-target">Objetivo · {formatMoney(goal.target)} · Para {goal.deadline}</span></div>
    <section className="detail-progress-card"><div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{Math.round(percent)}<small>%</small></strong><span>del camino</span></div></div><div className="detail-progress-copy"><span>Ya guardaste</span><strong>{formatMoney(goal.saved)}</strong><small>Te faltan {formatMoney(Math.max(0, goal.target - goal.saved))}</small><ProgressBar value={percent} color={goal.color} /></div></section>
    <section className="projection-card"><div className="projection-icon"><CalendarDays size={18} /></div><div><span>Si seguís así, llegás en</span><strong>{formatDuration(currentMonths)}</strong><small>Proyección orientativa · {estimatedDateLabel(currentMonths)}</small></div><span className="projection-confetti">✧</span></section>
    <section className="what-if-card"><div className="what-if-title"><span className="eyebrow">UNA IDEA, SIN COMPROMISO</span><span className="what-if-badge">+{extraPercent}%</span></div><h3>¿Y si aportás un poco más?</h3><p>{monthsSaved > 0 ? <>Podrías llegar <strong>{monthsSaved} {monthsSaved === 1 ? 'mes' : 'meses'} antes.</strong></> : <>Con este aporte, mantenés tu <strong>ritmo habitual.</strong></>} Solo es una proyección, vos elegís.</p><input className="range-input" aria-label="Aumentar aporte para simular" type="range" min="0" max="20" step="5" value={extraPercent} onChange={(event) => setExtraPercent(Number(event.target.value))} style={{ '--range-progress': `${extraPercent * 5}%` } as React.CSSProperties} /><div className="what-if-footer"><span>Tu ritmo actual</span><strong>{formatDuration(fasterMonths)}</strong></div></section>
    <section className="history-section"><div className="section-heading"><div><p className="eyebrow">TU CONSTANCIA</p><h2>Últimos aportes</h2></div><span className="count-pill">{goal.contributions.length} movimientos</span></div><div className="contribution-list">{goal.contributions.slice(0, 5).map((item, index) => <div className="contribution-row" key={`${item.date}-${index}`}><span className="contribution-icon"><ArrowDownLeft size={16} /></span><span><strong>{item.label}</strong><small>{item.date}</small></span><b>+{formatMoney(item.amount)}</b></div>)}</div></section>
    <button className="withdraw-link" onClick={() => setWithdrawOpen(true)}><Wallet size={17} /> Retirar plata de esta meta</button>
    {withdrawOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="withdraw-title"><div className="withdraw-modal"><button className="modal-close" onClick={() => { stopHold(); setWithdrawOpen(false) }} aria-label="Cerrar"><X size={18} /></button><span className="withdraw-warning-icon"><TrendingDown size={22} /></span><p className="eyebrow">ANTES DE DECIDIR</p><h2 id="withdraw-title">Tu plan puede esperar, pero queremos que lo sepas.</h2><p className="withdraw-explanation">Retirar <strong>{formatMoney(withdrawAmount)}</strong> te aleja aproximadamente <strong>{monthsBehind} {monthsBehind === 1 ? 'mes' : 'meses'}</strong> de {goal.name.toLowerCase()}.</p><label className="field-label">¿Cuánto querés retirar?<span className="money-input"><span>$</span><input inputMode="numeric" min={1} max={goal.saved} value={withdrawAmount.toLocaleString('es-AR')} onChange={(event) => setWithdrawAmount(Math.min(goal.saved, Number(event.target.value.replace(/\D/g, '')) || 0))} /></span></label><div className="withdraw-hold-note"><Clock3 size={15} /> Para cuidar tu decisión, mantené presionado 3 segundos.</div><button className={`hold-button ${holding ? 'holding' : ''}`} onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === ' ' && !holding) startHold() }} onKeyUp={(event) => { if (event.key === ' ') stopHold() }} disabled={withdrawAmount <= 0}><span>{holding ? 'Mantené...' : 'Mantené para confirmar'}</span><i /></button><button className="cancel-button" onClick={() => { stopHold(); setWithdrawOpen(false) }}>Mejor no, sigo ahorrando</button></div></div>}
  </div>
}

export function ExpensesScreen({ movements }: { movements: Movement[] }) {
  const [filter, setFilter] = useState('Todos')
  const categories = ['Todos', ...categoryBudgets.map((item) => item.name)]
  const filtered = filter === 'Todos' ? movements : movements.filter((movement) => movement.category === filter)
  const grouped = filtered.reduce<Record<string, Movement[]>>((acc, movement) => { (acc[movement.day] ||= []).push(movement); return acc }, {})
  const total = categoryBudgets.reduce((sum, category) => sum + category.amount, 0)
  return <div className="screen-content expenses-screen">
    <header className="page-header"><div><p className="eyebrow">PARA MIRAR SIN CULPA</p><h1>Tus gastos</h1></div><span className="month-chip">{new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date()).replace(/^./, (letter) => letter.toUpperCase())} <CalendarDays size={14} /></span></header>
    <section className="expense-summary"><div className="expense-total"><span>Salió este mes</span><strong>{formatMoney(total)}</strong><small><span className="comparison-down"><ArrowDownLeft size={13} /> 4%</span> menos que el mes pasado</small></div><div className="expense-chart"><div className="donut-chart"><div><strong>{formatMoney(total).replace('$', '$')}</strong><small>en total</small></div></div></div></section>
    <section className="category-section"><div className="section-heading"><div><p className="eyebrow">EN QUÉ SE VA</p><h2>Por categoría</h2></div><span className="period-button">Este mes <CalendarDays size={13} /></span></div><div className="category-list">{categoryBudgets.map((category, index) => <div className="category-row" key={category.name}><span className="category-emoji" style={{ background: `${category.color}18` }}>{category.icon}</span><div className="category-info"><div><strong>{category.name}</strong><span className={category.change > 15 ? 'category-alert' : 'category-change'}>{category.change > 0 ? <TrendingUp size={12} /> : category.change < 0 ? <TrendingDown size={12} /> : null}{category.change > 0 ? '+' : ''}{category.change}%</span></div><div className="category-track"><i style={{ width: `${(category.amount / Math.max(...categoryBudgets.map((item) => item.amount))) * 100}%`, background: category.color }} /></div></div><b>{formatMoney(category.amount)}</b></div>)}</div><p className="category-footnote">Delivery subió un 42% respecto al mes pasado. Es solo un dato, no un juicio.</p></section>
    <section className="movements-section"><div className="section-heading"><div><p className="eyebrow">MOVIMIENTOS</p><h2>Lo que pasó</h2></div><span className="count-pill">{filtered.length} movimientos</span></div><div className="filter-chips">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="movement-groups">{Object.entries(grouped).map(([day, items]) => <div className="movement-group" key={day}><h3>{day}</h3>{items.map((movement) => <div className="movement-row" key={movement.id}><span className="movement-icon" style={{ background: movement.tone }}>{movement.icon}</span><span className="movement-main"><strong>{movement.merchant}</strong><small>{movement.category}</small></span><b className={movement.category === 'Ingreso' ? 'income-amount' : ''}>{movement.category === 'Ingreso' ? `+${formatMoney(Math.abs(movement.amount))}` : formatMoney(movement.amount)}</b></div>)}</div>)}</div>{filtered.length === 0 && <p className="empty-note">No encontramos movimientos para esta categoría.</p>}</section>
  </div>
}

export type RuleState = { first: boolean; rounding: boolean; weekly: boolean }
export function RulesScreen({ rules, onToggle, savingRate }: { rules: RuleState; onToggle: (name: keyof RuleState) => void; savingRate: number }) {
  const estimated = Math.round((1_250_000 * (rules.first ? savingRate : 0) / 100) + (rules.rounding ? 14_500 : 0) + (rules.weekly ? 10_000 * 4.3 : 0))
  const cards: { id: keyof RuleState; icon: string; title: string; description: string; estimate: string }[] = [
    { id: 'first', icon: '✳', title: 'Pagarme primero', description: `${savingRate}% de cada ingreso va directo a tus metas.`, estimate: `~${formatMoney(1_250_000 * savingRate / 100)} por sueldo` },
    { id: 'rounding', icon: '⌁', title: 'Redondeo de gastos', description: 'La diferencia de cada compra se suma a tu ahorro.', estimate: '~$14.500 por mes' },
    { id: 'weekly', icon: '↗', title: 'Ahorro fijo semanal', description: 'Un aporte pequeño que se repite cada semana.', estimate: '$10.000 cada viernes' },
  ]
  return <div className="screen-content rules-screen"><header className="page-header"><div><p className="eyebrow">A TU MANERA</p><h1>Reglas de ahorro</h1></div><span className="rules-header-icon">✳</span></header><section className="rules-intro"><span className="intro-flower">✳</span><p>Menos fuerza de voluntad.<br /><strong>Más planes en marcha.</strong></p><small>Activá solo lo que te haga sentido.</small></section><div className="rules-list">{cards.map((card) => <article className={`rule-card ${rules[card.id] ? 'rule-active' : ''}`} key={card.id}><div className="rule-card-top"><span className="rule-icon">{card.icon}</span><button className={`switch ${rules[card.id] ? 'switch-on' : ''}`} role="switch" aria-checked={rules[card.id]} aria-label={`Activar ${card.title}`} onClick={() => onToggle(card.id)}><i /></button></div><h2>{card.title}</h2><p>{card.description}</p><div className="rule-estimate"><span>{card.estimate}</span><span className={`switch-state ${rules[card.id] ? 'on' : ''}`}>{rules[card.id] ? 'ACTIVA' : 'PAUSADA'}</span></div></article>)}</div><section className="monthly-estimate"><div><span>Con tus reglas activas</span><strong>Podés ahorrar hasta</strong><small>Una estimación, no una promesa.</small></div><b>{formatMoney(estimated)}<small>/ mes</small></b></section><div className="rules-footnote"><Check size={16} /><span>Vos decidís. Podés pausar cualquier regla cuando quieras.</span></div></div>
}

export function LearnScreen() {
  const [current, setCurrent] = useState(0)
  const tip = tips[current]
  return <div className="screen-content learn-screen"><header className="page-header"><div><p className="eyebrow">IDEAS QUE SUMAN</p><h1>Aprender sin vueltas</h1></div><span className="learn-count">{String(current + 1).padStart(2, '0')} <i>/ {String(tips.length).padStart(2, '0')}</i></span></header><div className={`story-card story-${tip.color}`} key={current}><div className="story-progress">{tips.map((_, index) => <i key={index} className={index <= current ? 'filled' : ''} />)}</div><div className="story-inner"><span className="story-tag">{tip.tag}</span><div className="story-illustration"><span>{tip.icon}</span><i /><i /><i /></div><p className="eyebrow">UNA IDEA PARA HOY</p><h2>{tip.title}</h2><p className="story-copy">{tip.copy}</p><span className="story-small-note">No hace falta hacerlo perfecto. Hace falta empezar.</span></div><div className="story-controls"><button onClick={() => setCurrent((index) => (index + tips.length - 1) % tips.length)} aria-label="Consejo anterior"><ArrowLeft size={18} /></button><span>{current + 1} de {tips.length}</span><button onClick={() => setCurrent((index) => (index + 1) % tips.length)} aria-label="Siguiente consejo"><ArrowRight size={18} /></button></div></div><section className="learning-footer"><span className="learning-flower">✳</span><div><strong>Una idea por vez</strong><p>Guardá lo que te sirva. El resto puede esperar.</p></div></section><div className="tip-dots" aria-label={`Consejo ${current + 1} de ${tips.length}`}>{tips.map((_, index) => <button key={index} aria-label={`Ver consejo ${index + 1}`} onClick={() => setCurrent(index)} className={index === current ? 'active' : ''} />)}</div></div>
}

export function CreateGoalModal({ onClose, onCreate }: { onClose: () => void; onCreate: (goal: Omit<Goal, 'id' | 'createdAt' | 'contributions'>) => void }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [emoji, setEmoji] = useState('✈️')
  const [date, setDate] = useState('Dic 2028')
  const canCreate = name.trim().length > 0 && Number(target) > 0
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="create-title"><div className="create-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button><span className="step-icon"><Plus size={21} /></span><p className="eyebrow">UN PLAN NUEVO</p><h2 id="create-title">¿Qué querés lograr?</h2><p className="modal-description">Poné tu próxima idea en marcha.</p><div className="goal-emoji-picker compact">{['✈️', '🏡', '🚙', '🌿', '🎓'].map((item) => <button key={item} className={emoji === item ? 'selected' : ''} onClick={() => setEmoji(item)}>{item}</button>)}</div><label className="field-label">Nombre de tu meta<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Un viaje al sur" /></label><label className="field-label">Monto objetivo<span className="money-input"><span>$</span><input inputMode="numeric" value={target ? Number(target).toLocaleString('es-AR') : ''} onChange={(event) => setTarget(event.target.value.replace(/\D/g, ''))} placeholder="3.000.000" /></span></label><label className="field-label">Fecha objetivo<select value={date} onChange={(event) => setDate(event.target.value)}><option>Dic 2027</option><option>Jun 2028</option><option>Dic 2028</option><option>Jun 2029</option><option>Dic 2029</option></select></label><button className="button-primary modal-submit" disabled={!canCreate} onClick={() => onCreate({ name: name.trim(), emoji, target: Number(target), saved: 0, deadline: date, color: '#14634f' })}>Crear mi meta <ArrowRight size={17} /></button></div></div>
}
