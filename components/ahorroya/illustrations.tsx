import type { LucideIcon } from 'lucide-react'
import { Car, Coffee, GraduationCap, House, Plane, ShoppingBasket, Sparkles, Sprout, Sun, Target, Utensils, WalletCards } from 'lucide-react'

export const goalIconOptions: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: '🏡', label: 'Casa', Icon: House },
  { value: '🚙', label: 'Auto', Icon: Car },
  { value: '🌿', label: 'Terreno', Icon: Sprout },
  { value: '✈️', label: 'Viaje', Icon: Plane },
  { value: '🎓', label: 'Estudios', Icon: GraduationCap },
]

export function GoalIcon({ value, size = 20 }: { value: string; size?: number }) {
  const Icon = goalIconOptions.find((option) => option.value === value)?.Icon ?? Target
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}

const movementIcons: Record<string, LucideIcon> = {
  Supermercado: ShoppingBasket,
  Delivery: Utensils,
  Transporte: Car,
  Salidas: Coffee,
  Servicios: House,
  Suscripciones: WalletCards,
  Ingreso: WalletCards,
}

export function MovementIcon({ category, size = 17 }: { category: string; size?: number }) {
  const Icon = movementIcons[category] ?? Target
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}

const tipIcons: Record<string, LucideIcon> = {
  '🌱': Sprout,
  '🥡': Utensils,
  '🏡': House,
  '✨': Sparkles,
  '🌤️': Sun,
}

export function TipIcon({ value, size = 34 }: { value: string; size?: number }) {
  const Icon = tipIcons[value] ?? Sparkles
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />
}
