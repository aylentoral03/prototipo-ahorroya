'use client'

import { useCallback, useState } from 'react'
import { BookOpen, ChartNoAxesCombined, CreditCard, Home, ListChecks, ShieldCheck, Target } from 'lucide-react'
import { categoryBudgets, goalShare, initialDebts, initialGoals, initialMovements, initialSpendable, type Currency, type Goal, type Movement } from '@/lib/ahorroya-data'
import type { BudgetCategory, Debt, NewDebtInput, NewExpenseInput } from '@/lib/finance-types'
import { addDemoExpenseToBudget, applyDemoDebtPayment, createDemoDebt, createDemoExpense, updateDemoBudgetLimit } from '@/lib/demo-finance-service'
import { APP_NAME } from '@/lib/ahorria-config'
import { AccessScreen } from './access-screen'
import { Onboarding, type SetupValues } from './onboarding'
import { SalaryOverlay } from './salary-overlay'
import { IncomeEntry } from './income-entry'
import { DebtsScreen } from './debts-screen'
import { ExpensesScreen } from './expenses-screen'
import { CreateGoalModal, GoalDetailScreen, GoalsScreen, HomeScreen, LearnScreen, RulesScreen, type RuleState } from './screens'

type Tab = 'Inicio' | 'Metas' | 'Gastos' | 'Deudas' | 'Reglas' | 'Aprender'
type SalaryPhase = 'entering' | 'dividing' | 'done'
const navigation: { label: Tab; icon: typeof Home }[] = [
  { label: 'Inicio', icon: Home }, { label: 'Metas', icon: Target }, { label: 'Gastos', icon: ChartNoAxesCombined }, { label: 'Deudas', icon: CreditCard }, { label: 'Reglas', icon: ListChecks }, { label: 'Aprender', icon: BookOpen },
]

export function AhorroYaApp() {
  const [accessOpen, setAccessOpen] = useState(true)
  const [onboarding, setOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('Inicio')
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [movements, setMovements] = useState<Movement[]>(initialMovements)
  const [budgets, setBudgets] = useState<BudgetCategory[]>(categoryBudgets)
  const [debts, setDebts] = useState<Debt[]>(initialDebts)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [spendable, setSpendable] = useState(initialSpendable)
  const [saveRate, setSaveRate] = useState(15)
  const [income, setIncome] = useState(3_500)
  const [incomeCurrency, setIncomeCurrency] = useState<Currency>('USD')
  const [usdSpendable, setUsdSpendable] = useState(0)
  const [incomeModalOpen, setIncomeModalOpen] = useState(false)
  const [salaryCount, setSalaryCount] = useState(0)
  const [salaryPhase, setSalaryPhase] = useState<SalaryPhase | null>(null)
  const [salaryAmount, setSalaryAmount] = useState(0)
  const [salaryCurrency, setSalaryCurrency] = useState<Currency>('USD')
  const [salarySaved, setSalarySaved] = useState(0)
  const [salarySpendable, setSalarySpendable] = useState(0)
  const [rules, setRules] = useState<RuleState>({ first: true, rounding: false, weekly: false })
  const [createGoalOpen, setCreateGoalOpen] = useState(false)

  const finishOnboarding = (values: SetupValues) => {
    setSaveRate(values.percentage)
    setIncome(values.income)
    setIncomeCurrency(values.incomeCurrency)
    setGoals((current) => current.map((goal, index) => index === 0 ? {
      ...goal,
      name: values.goalName,
      emoji: values.goalEmoji,
      currency: values.goalCurrency,
      saved: values.goalCurrency === 'USD' ? 4_850 : 4_850_000,
      target: values.goalTarget,
      deadline: values.goalDeadline,
      contributions: values.goalCurrency === 'USD'
        ? [{ date: 'Hoy', amount: 150, label: 'Ahorro automático' }, { date: 'Hace 2 semanas', amount: 95, label: 'Ahorro automático' }, { date: '28 abr', amount: 120, label: 'Ahorro automático' }]
        : [{ date: 'Hoy', amount: 187_500, label: 'Ahorro automático' }, { date: 'Hace 2 semanas', amount: 95_000, label: 'Ahorro automático' }, { date: '28 abr', amount: 120_000, label: 'Ahorro automático' }],
    } : goal))
    setOnboarding(false)
  }

  const recordIncome = (amount: number, currency: Currency) => {
    const matchingGoals = goals.filter((goal) => goal.currency === currency)
    const saved = matchingGoals.length > 0 ? Math.round(amount * saveRate / 100) : 0
    const available = amount - saved
    setIncome(amount)
    setIncomeCurrency(currency)
    setSalaryAmount(amount)
    setSalaryCurrency(currency)
    setSalarySaved(saved)
    setSalarySpendable(available)
    setIncomeModalOpen(false)
    setSalaryPhase('entering')
    window.setTimeout(() => setSalaryPhase((phase) => phase === 'entering' ? 'dividing' : phase), 1200)
    window.setTimeout(() => {
      setGoals((current) => current.map((goal) => {
        if (goal.currency !== currency) return goal
        const contribution = Math.round(saved * goalShare(goal, current))
        return { ...goal, saved: goal.saved + contribution, contributions: [{ date: 'Hoy', amount: contribution, label: 'Ingreso nuevo · ahorro automático' }, ...goal.contributions] }
      }))
      if (currency === 'USD') setUsdSpendable((current) => current + available)
      else setSpendable((current) => current + available)
      setSalaryCount((current) => current + 1)
      setMovements((current) => [{ id: `income-${Date.now()}`, merchant: `Ingreso · ${currency === 'USD' ? 'Dólares' : 'Datos de ejemplo'}`, category: 'Ingreso', amount: -amount, currency, icon: '✳', tone: '#dff1e8', day: 'Hoy', date: 'Hoy' }, ...current])
      setSalaryPhase((phase) => phase ? 'done' : null)
    }, 2700)
  }

  const handleSalaryClose = useCallback(() => setSalaryPhase(null), [])
  const openGoal = (id: string) => { setSelectedGoal(id); setActiveTab('Metas') }
  const createGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'contributions'>) => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}`, createdAt: 'Hoy', contributions: [] }
    setGoals((current) => [...current, newGoal])
    setCreateGoalOpen(false)
    setSelectedGoal(newGoal.id)
  }
  const withdraw = (id: string, amount: number, currency: Currency) => {
    setGoals((current) => current.map((goal) => goal.id === id ? { ...goal, saved: Math.max(0, goal.saved - amount) } : goal))
    if (currency === 'USD') setUsdSpendable((current) => current + amount)
    else setSpendable((current) => current + amount)
  }
  const toggleRule = (name: keyof RuleState) => setRules((current) => ({ ...current, [name]: !current[name] }))
  const addDemoExpense = (input: NewExpenseInput) => {
    const expense = createDemoExpense(input, budgets)
    setMovements((current) => [expense, ...current])
    setBudgets((current) => addDemoExpenseToBudget(current, expense))
  }
  const updateBudget = (category: string, limit: number) => setBudgets((current) => updateDemoBudgetLimit(current, category, limit))
  const addDemoDebt = (input: NewDebtInput) => setDebts((current) => [...current, createDemoDebt(input)])
  const addDemoDebtPayment = (id: string, amount: number) => setDebts(applyDemoDebtPayment(debts, id, amount))

  if (accessOpen) return <AccessScreen onContinue={() => setAccessOpen(false)} />
  if (onboarding) return <Onboarding onComplete={finishOnboarding} />

  const chosenGoal = goals.find((goal) => goal.id === selectedGoal)
  return <main className="app-frame">
    <aside className="desktop-sidebar"><div className="brand-lockup"><span className="brand-mark">a.</span><span>{APP_NAME}</span></div><p className="sidebar-label">TU ESPACIO</p><nav aria-label="Navegación principal">{navigation.map(({ label, icon: Icon }) => <button key={label} className={`sidebar-nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => { setActiveTab(label); if (label !== 'Metas') setSelectedGoal(null) }}><Icon size={19} />{label}{activeTab === label && <span />}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-plan-icon">✳</div><strong>Tu plan avanza.</strong><span>A tu ritmo, todos los días.</span></div><div className="profile-mini"><span>V</span><div><strong>Vale</strong><small>Plan personal · Demo</small></div></div></aside>
    <div className="app-main"><header className="mobile-brand"><div className="brand-lockup"><span className="brand-mark">a.</span><span>{APP_NAME}</span></div><span className="avatar-button" aria-label="Vale">V</span></header>
      <div className="app-demo-banner" role="note"><ShieldCheck size={14} /><span><strong>Demo:</strong> saldos y movimientos ilustrativos; no hay operaciones reales.</span></div>
      {activeTab === 'Inicio' && <HomeScreen spendable={spendable} usdSpendable={usdSpendable} goals={goals} income={income} incomeCurrency={incomeCurrency} savingRate={saveRate} onGoal={openGoal} onSalary={() => setIncomeModalOpen(true)} salaryCount={salaryCount} />}
      {activeTab === 'Metas' && (chosenGoal ? <GoalDetailScreen goal={chosenGoal} goals={goals} income={income} incomeCurrency={incomeCurrency} savingRate={saveRate} onBack={() => setSelectedGoal(null)} onWithdraw={withdraw} /> : <GoalsScreen goals={goals} income={income} incomeCurrency={incomeCurrency} savingRate={saveRate} onGoal={setSelectedGoal} onCreate={() => setCreateGoalOpen(true)} />)}
      {activeTab === 'Gastos' && <ExpensesScreen movements={movements} budgets={budgets} onAddExpense={addDemoExpense} onUpdateBudget={updateBudget} />}
      {activeTab === 'Deudas' && <DebtsScreen debts={debts} onCreate={addDemoDebt} onPayment={addDemoDebtPayment} />}
      {activeTab === 'Reglas' && <RulesScreen rules={rules} onToggle={toggleRule} savingRate={saveRate} income={income} incomeCurrency={incomeCurrency} />}
      {activeTab === 'Aprender' && <LearnScreen />}
      <nav className="bottom-nav" aria-label="Navegación inferior">{navigation.map(({ label, icon: Icon }) => <button key={label} className={`bottom-nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => { setActiveTab(label); if (label !== 'Metas') setSelectedGoal(null) }} aria-current={activeTab === label ? 'page' : undefined}><span><Icon size={20} /></span><small>{label}</small></button>)}</nav>
    </div>
    {incomeModalOpen && <IncomeEntry initialAmount={income} initialCurrency={incomeCurrency} savingRate={saveRate} onClose={() => setIncomeModalOpen(false)} onSubmit={recordIncome} />}
    {salaryPhase && <SalaryOverlay phase={salaryPhase} income={salaryAmount} currency={salaryCurrency} saved={salarySaved} spendable={salarySpendable} goals={goals} onClose={handleSalaryClose} />}
    {createGoalOpen && <CreateGoalModal onClose={() => setCreateGoalOpen(false)} onCreate={createGoal} />}
  </main>
}
