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
  const defaultPlans: PricingPlan[] = [
    { name: 'עד 5 אימונים', sessionsPerMonth: 5, price: 554, pricePerSession: 110.8, customerPercentage: 32 },
    { name: 'עד 9 אימונים', sessionsPerMonth: 9, price: 624, pricePerSession: 69.3, customerPercentage: 60 },
    { name: 'עד 13 אימונים', sessionsPerMonth: 13, price: 684, pricePerSession: 52.6, customerPercentage: 5 },
    { name: 'ללא הגבלה', sessionsPerMonth: 16, price: 724, pricePerSession: 45.3, customerPercentage: 3 },
  ]

  const displayPlans = plans.length > 0 ? plans : defaultPlans

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🏷️</span> מחירון מסלולים
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/30">
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
                className={`border-b border-white/10 ${
                  plan.customerPercentage > 50 ? 'bg-primary/10' : ''
                }`}
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
        <h4 className="text-lg font-medium mb-4 text-secondary">שירותים נוספים</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <span className="text-2xl">🏋️</span>
            <div className="flex-1">
              <div className="font-medium">אימון אישי</div>
              <div className="text-secondary font-bold">₪{personalTraining} לאימון</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <span className="text-2xl">💆</span>
            <div className="flex-1">
              <div className="font-medium">טיפול קליניקה</div>
              <div className="text-secondary font-bold">₪{clinicTreatment} לטיפול</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
