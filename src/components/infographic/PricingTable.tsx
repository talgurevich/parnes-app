'use client'

import { usePalette } from './PaletteProvider'

interface PricingPlan {
  name: string
  sessionsPerMonth: number
  price: number
  pricePerSession: number
  customerPercentage: number
}

interface PricingTableProps {
  plans: PricingPlan[]
  personalTraining: number
  clinicTreatment: number
}

export function PricingTable({ plans, personalTraining, clinicTreatment }: PricingTableProps) {
  const palette = usePalette()
  const defaultPlans: PricingPlan[] = [
    { name: 'עד 5 אימונים', sessionsPerMonth: 5, price: 554, pricePerSession: 110.8, customerPercentage: 32 },
    { name: 'עד 9 אימונים', sessionsPerMonth: 9, price: 624, pricePerSession: 69.3, customerPercentage: 60 },
    { name: 'עד 13 אימונים', sessionsPerMonth: 13, price: 684, pricePerSession: 52.6, customerPercentage: 5 },
    { name: 'ללא הגבלה', sessionsPerMonth: 16, price: 724, pricePerSession: 45.3, customerPercentage: 3 },
  ]

  const displayPlans = plans.length > 0 ? plans : defaultPlans

  // Convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🏷️</span> מחירון מסלולים
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: hexToRgba(palette.primary, 0.3) }}>
              <th className="p-3 text-right rounded-tr-lg">מסלול</th>
              <th className="p-3 text-center">מחיר</th>
              <th className="p-3 text-center">% לקוחות</th>
              <th className="p-3 text-center rounded-tl-lg">לאימון</th>
            </tr>
          </thead>
          <tbody>
            {displayPlans.map((plan, index) => (
              <tr
                key={index}
                className="border-b border-white/10"
                style={plan.customerPercentage > 50 ? { backgroundColor: hexToRgba(palette.primary, 0.1) } : undefined}
              >
                <td className="p-3">{plan.name}</td>
                <td className="p-3 text-center">₪{plan.price}</td>
                <td className="p-3 text-center">{plan.customerPercentage}%</td>
                <td className="p-3 text-center">₪{plan.pricePerSession.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-lg font-medium mb-4" style={{ color: palette.secondary }}>שירותים נוספים</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <span className="text-2xl">🏋️</span>
            <div className="flex-1">
              <div className="font-medium">אימון אישי</div>
              <div className="font-bold" style={{ color: palette.secondary }}>₪{personalTraining} לאימון</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <span className="text-2xl">💆</span>
            <div className="flex-1">
              <div className="font-medium">טיפול קליניקה</div>
              <div className="font-bold" style={{ color: palette.secondary }}>₪{clinicTreatment} לטיפול</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
