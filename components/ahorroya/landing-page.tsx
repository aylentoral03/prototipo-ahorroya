'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, Check, CircleHelp, CreditCard, LockKeyhole, PiggyBank, ShieldCheck, Sparkles, Target, Wallet } from 'lucide-react'
import { APP_NAME, DEMO_NOTICE } from '@/lib/ahorria-config'

const benefits = [
  { icon: Wallet, title: 'Entendé tu plata', text: 'Mirá tus gastos por categoría y encontrá patrones sin culpa ni planillas eternas.' },
  { icon: Target, title: 'Dale un destino', text: 'Creá metas para tus proyectos y seguí el progreso en pesos o en dólares, por separado.' },
  { icon: PiggyBank, title: 'Armá un hábito', text: 'Probá reglas simples de ahorro y elegí un ritmo que te resulte posible.' },
]

const steps = [
  { number: '01', title: 'Contanos qué querés', text: 'Elegí una meta y una fecha. Podés cambiarla cuando quieras.' },
  { number: '02', title: 'Definí tu ritmo', text: 'Elegí un porcentaje de ejemplo que separemos de cada ingreso que cargues.' },
  { number: '03', title: 'Mirá cómo avanzás', text: 'Revisá tus gastos, ajustá tus planes y aprendé en el camino.' },
]

const questions = [
  { question: '¿La demo mueve o guarda mi dinero?', answer: 'No. Esta versión es un prototipo con datos ficticios: no conecta cuentas, no custodia fondos y no realiza transferencias.' },
  { question: '¿Tengo que compartir mis datos bancarios?', answer: 'No. La demo no solicita datos bancarios, claves ni información financiera sensible. Podés recorrerla sin crear una cuenta.' },
  { question: '¿Pesos y dólares se convierten entre sí?', answer: 'No. Las metas y los saldos se muestran por separado. No usamos cotizaciones ni hacemos conversiones.' },
  { question: '¿Qué incluye el plan Premium?', answer: 'La propuesta de funciones está en definición. Los precios, cobros y beneficios premium no están activos en esta demo.' },
]

function BrandLockup() {
  return <span className="brand-lockup"><span className="brand-mark">a.</span><span>{APP_NAME}</span></span>
}

function DashboardPreview() {
  return <div className="landing-preview" aria-label="Vista previa ilustrativa del panel de AHORRIA">
    <div className="preview-topbar"><div className="preview-brand"><span className="preview-brand-mark">a.</span><span>{APP_NAME}</span></div><span className="preview-avatar">V</span></div>
    <div className="preview-content">
      <div className="preview-greeting"><span>Buen día, Vale</span><strong>Tu plata, en calma.</strong></div>
      <div className="preview-balance"><span><i /> DISPONIBLE PARA VOS</span><small>Pesos argentinos · demo</small><strong>$684.500</strong><div className="preview-balance-bottom"><span>USD 0</span><span>Datos de ejemplo</span></div></div>
      <div className="preview-metrics"><div className="preview-metric"><span>Metas en marcha</span><strong>3 objetivos</strong><div className="preview-meter"><i /></div></div><div className="preview-metric preview-metric-chart"><span>Gastos del mes</span><strong>$857.347</strong><div className="preview-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div>
      <div className="preview-goal"><span className="preview-goal-icon"><Target size={17} /></span><div><strong>Mi casa</strong><small>USD 4.850 de USD 120.000</small></div><span className="preview-goal-progress">4%</span></div>
      <div className="preview-note"><ShieldCheck size={14} /> Vista ilustrativa · sin conexión bancaria</div>
    </div>
  </div>
}

export function LandingPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0)

  return <main className="landing-page" id="inicio">
    <a className="landing-skip-link" href="#contenido">Saltar al contenido</a>
    <header className="landing-header">
      <div className="landing-nav-wrap"><Link href="/" aria-label={`${APP_NAME}, inicio`}><BrandLockup /></Link><nav className="landing-nav" aria-label="Navegación principal"><a href="#beneficios">Qué podés hacer</a><a href="#como-funciona">Cómo funciona</a><a href="#planes">Planes</a></nav><Link className="landing-nav-cta" href="/demo">Entrar a la demo <ArrowRight size={15} /></Link></div>
    </header>
    <section className="landing-hero" id="contenido">
      <div className="landing-hero-copy"><span className="landing-kicker"><Sparkles size={14} /> UNA FORMA MÁS AMABLE DE AHORRAR</span><h1>Empezá a ahorrar <em>sin complicarte.</em></h1><p className="landing-lede">Organizá tus gastos, ordená tus prioridades y acercate a eso que querés lograr. Paso a paso y a tu ritmo.</p><div className="landing-hero-actions"><Link className="landing-button-primary" href="/demo">Empezar gratis <ArrowRight size={17} /></Link><a className="landing-button-secondary" href="#como-funciona">Conocer cómo funciona <ArrowDownRight size={16} /></a></div><div className="landing-trust-row"><span><Check size={14} /> Sin conectar tu banco</span><span><Check size={14} /> Datos de demostración</span></div></div>
      <div className="landing-hero-visual"><span className="landing-visual-orbit landing-orbit-one" /><span className="landing-visual-orbit landing-orbit-two" /><DashboardPreview /><div className="floating-insight"><span className="floating-insight-icon"><ArrowUpRight size={16} /></span><span><small>UN PASO A LA VEZ</small><strong>Tu próximo objetivo</strong></span><span className="floating-insight-dot" /></div></div>
    </section>
    <section className="landing-proof"><div><strong>100%</strong><span>prototipo demostrativo</span></div><span className="landing-proof-divider" /><div><strong>2 monedas</strong><span>sin conversiones automáticas</span></div><span className="landing-proof-divider" /><div><strong>Tu ritmo</strong><span>sin juicios ni promesas</span></div></section>
    <section className="landing-section landing-benefits" id="beneficios"><div className="landing-section-heading"><span className="landing-kicker">MENOS RUIDO, MÁS CLARIDAD</span><h2>Tu plata tiene planes.<br /><em>Ayudemos a que lleguen.</em></h2><p>Una mirada simple para tomar decisiones cotidianas con más tranquilidad.</p></div><div className="landing-benefit-grid">{benefits.map(({ icon: Icon, title, text }, index) => <article className="landing-benefit-card" key={title}><span className={`landing-benefit-icon benefit-icon-${index}`}><Icon size={20} /></span><span className="landing-benefit-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="landing-how" id="como-funciona"><div className="landing-how-header"><div><span className="landing-kicker">CLARO DESDE EL PRINCIPIO</span><h2>Tres pasos.<br /><em>Un plan más tuyo.</em></h2></div><p>No necesitás saber de finanzas. Empezá con lo que tenés y ajustá sobre la marcha.</p></div><div className="landing-steps">{steps.map((step, index) => <article className="landing-step" key={step.number}><div className="landing-step-number">{step.number}<span>{index < steps.length - 1 && <ArrowRight size={16} />}</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section className="landing-plans" id="planes"><div className="landing-section-heading"><span className="landing-kicker">A TU MANERA</span><h2>Empezá simple.<br /><em>Elegí lo que te sirve.</em></h2><p>La propuesta es freemium. En esta demo no se realizan cobros ni se activan suscripciones.</p></div><div className="landing-plan-grid"><article className="landing-plan-card"><div className="landing-plan-head"><div><span className="landing-plan-label">PARA EMPEZAR</span><h3>Gratis</h3></div><span className="landing-plan-price">$0 <small>en la demo</small></span></div><p>Lo esencial para organizarte y poner tus metas en marcha.</p><ul><li><Check size={15} /> Presupuesto y gastos de ejemplo</li><li><Check size={15} /> Metas en ARS y USD</li><li><Check size={15} /> Reglas de ahorro editables</li><li><Check size={15} /> Contenido de educación financiera</li></ul><Link className="landing-plan-cta landing-plan-cta-quiet" href="/demo">Explorar gratis <ArrowRight size={15} /></Link></article><article className="landing-plan-card landing-plan-premium"><div className="landing-plan-head"><div><span className="landing-plan-label">MÁS HERRAMIENTAS</span><h3>Premium</h3></div><span className="landing-plan-status">En desarrollo</span></div><p>Una propuesta para quienes quieren profundizar su organización.</p><ul><li><Check size={15} /> Reportes y análisis ampliados</li><li><Check size={15} /> Más opciones de seguimiento</li><li><Check size={15} /> Herramientas avanzadas por definir</li><li><CircleHelp size={15} /> Precio y alcance todavía no definidos</li></ul><a className="landing-plan-cta landing-plan-cta-premium" href="#preguntas">Conocer la propuesta <ArrowRight size={15} /></a></article></div></section>
    <section className="landing-privacy" id="privacidad"><div className="landing-privacy-icon"><LockKeyhole size={23} /></div><div><span className="landing-kicker">TRANSPARENCIA ANTES QUE NADA</span><h2>Tu privacidad también es parte del plan.</h2><p>Esta versión funciona con datos ficticios en tu navegador. No pide claves bancarias, no se conecta a entidades financieras y no mueve ni guarda dinero real.</p><div className="landing-privacy-tags"><span><ShieldCheck size={14} /> Sin conexiones financieras</span><span><CreditCard size={14} /> Sin cobros activos</span><span><BarChart3 size={14} /> Saldos ilustrativos</span></div></div></section>
    <section className="landing-faq" id="preguntas"><div className="landing-faq-intro"><span className="landing-kicker">PREGUNTAS FRECUENTES</span><h2>Lo importante,<br /><em>sin letra chica.</em></h2><p>Si algo no está claro, preferimos decirlo de frente.</p></div><div className="landing-faq-list">{questions.map((item, index) => <article className={`landing-faq-item ${openQuestion === index ? 'is-open' : ''}`} key={item.question}><button type="button" aria-expanded={openQuestion === index} onClick={() => setOpenQuestion(openQuestion === index ? null : index)}><span>{item.question}</span><span className="faq-toggle" aria-hidden="true">{openQuestion === index ? '−' : '+'}</span></button>{openQuestion === index && <p>{item.answer}</p>}</article>)}</div></section>
    <section className="landing-final-cta"><div><span className="landing-kicker">EMPEZÁ CON LO QUE TENÉS</span><h2>Un paso chiquito<br />también te acerca.</h2><p>Recorré la demo y descubrí una forma más clara de mirar tu plata.</p></div><Link className="landing-button-primary landing-final-button" href="/demo">Entrar a la demo <ArrowRight size={17} /></Link><span className="landing-final-mark" aria-hidden="true">a.</span></section>
    <footer className="landing-footer"><div className="landing-footer-main"><div><Link href="/" aria-label={`${APP_NAME}, inicio`}><BrandLockup /></Link><p>Una forma más simple de ordenar tu plata y acercarte a tus planes.</p></div><div className="landing-footer-links"><a href="#privacidad">Privacidad (demo)</a><a href="#preguntas">Términos (demo)</a><a href="mailto:hola@ahorria.demo">Contacto de ejemplo</a></div></div><div className="landing-footer-bottom"><span>© {new Date().getFullYear()} {APP_NAME}. Prototipo de demostración.</span><span>{DEMO_NOTICE}</span></div></footer>
  </main>
}
