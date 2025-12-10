'use client'

import { usePalette } from './PaletteProvider'

interface ExpensesListProps {
  expenses: Record<string, number>
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  const palette = usePalette()
  const items = [
    { name: 'שכירות', amount: expenses.rent || 0 },
    { name: 'דמי ניהול', amount: expenses.management || 0 },
    { name: 'ארנונה', amount: expenses.propertyTax || 0 },
    { name: 'מערכת ניהול', amount: expenses.managementSystem || 0 },
    { name: 'ביטוח', amount: expenses.insurance || 0 },
    { name: 'מאמני קבוצות', amount: expenses.groupTrainers || 0 },
    { name: 'מאמנים אישיים', amount: expenses.personalTrainers || 0 },
  ]

  const total = items.reduce((sum, item) => sum + item.amount, 0)

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
        <span className="text-2xl">📉</span> הוצאות חודשיות קבועות
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-3 border-b border-white/10 last:border-0"
          >
            <span>{item.name}</span>
            <span className="font-bold" style={{ color: palette.primaryLight }}>
              ₪{item.amount.toLocaleString()}
            </span>
          </div>
        ))}
        <div
          className="flex justify-between py-3 mt-4 rounded-lg px-3"
          style={{ backgroundColor: hexToRgba(palette.primary, 0.1) }}
        >
          <span className="font-bold">סה"כ קבוע (לפני שכר)</span>
          <span className="font-bold text-xl" style={{ color: palette.primaryLight }}>
            ~₪{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
