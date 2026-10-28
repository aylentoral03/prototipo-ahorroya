'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { APP_NAME, DEMO_NOTICE } from '@/lib/ahorria-config'

type AccessMode = 'login' | 'register'

export function AccessScreen({ onContinue }: { onContinue: () => void }) {
  const [mode, setMode] = useState<AccessMode>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (mode === 'register' && name.trim().length < 2) {
      setMessage('Escribí tu nombre para continuar.')
      return
    }
    onContinue()
  }

  return <main className="access-page"><header className="access-header"><Link className="access-back-link" href="/" aria-label="Volver al inicio"><ArrowLeft size={16} /> Inicio</Link><Link className="brand-lockup" href="/"><span className="brand-mark">a.</span><span>{APP_NAME}</span></Link><span className="access-demo-label">DEMO</span></header><div className="access-layout"><section className="access-card"><span className="access-lock-icon"><LockKeyhole size={19} /></span><p className="eyebrow">TU ESPACIO, A TU RITMO</p><h1>{mode === 'register' ? 'Empezá por vos.' : 'Qué bueno verte.'}</h1><p className="access-lede">{mode === 'register' ? 'Armá un perfil de prueba y conocé una forma más clara de organizarte.' : 'Entrá a un recorrido de ejemplo y seguí explorando tus planes.'}</p><div className="access-mode-tabs" role="group" aria-label="Elegir acceso"><button type="button" aria-pressed={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage('') }}>Crear perfil demo</button><button type="button" aria-pressed={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage('') }}>Iniciar sesión</button></div><form className="access-form" onSubmit={submit}>{mode === 'register' && <label className="field-label">Tu nombre<input autoComplete="off" required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Vale" /></label>}<label className="field-label">Correo de ejemplo<input type="email" autoComplete="off" required maxLength={120} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vos@ejemplo.com" /></label><label className="field-label">Contraseña ficticia<input type="password" autoComplete="new-password" required minLength={8} maxLength={64} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Al menos 8 caracteres" /><small>Usá datos inventados. No pongas una contraseña que uses de verdad.</small></label>{message && <p className="form-error" role="alert">{message}</p>}<button className="button-primary access-submit" type="submit">{mode === 'register' ? 'Crear perfil de demo' : 'Entrar a la demo'} <ArrowRight size={16} /></button></form><div className="access-or"><span />o<span /></div><button className="access-skip" onClick={onContinue}>Explorar sin registrarme <ArrowRight size={15} /></button><div className="access-safety"><ShieldCheck size={15} /><span>No se envían ni guardan estos datos. Esta pantalla no crea una cuenta real.</span></div></section><aside className="access-side"><span className="access-side-mark">a.</span><p className="eyebrow">{DEMO_NOTICE.toUpperCase()}</p><h2>Un plan claro empieza con un primer paso.</h2><p>Probá metas, presupuestos y movimientos inventados. Tus datos quedan solo en esta sesión de demostración.</p><ul><li><ShieldCheck size={15} /> No hay conexión bancaria</li><li><ShieldCheck size={15} /> No se mueve dinero real</li><li><ShieldCheck size={15} /> No guardamos tus credenciales</li></ul></aside></div></main>
}
