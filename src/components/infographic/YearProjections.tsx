'use client'

import { usePalette } from './PaletteProvider'

interface YearProjectionsProps {
  year1: Record<string, number>
  year2: Record<string, number>
  kpis: Record<string, number>
}

export function YearProjections({ year1, year2, kpis }: YearProjectionsProps) {
  const palette = usePalette()
  const years = [
    {
      title: 'שנה ראשונה',
      data: [
        { label: 'הכנסות שנתיות', value: year1.revenue || 482074, type: 'neutral' },
        { label: 'הוצאות שנתיות', value: year1.expenses || 451654, type: 'negative' },
        { label: 'לקוחות (התחלה → סוף)', value: `${year1.customersStart || 33} → ${year1.customersEnd || 73}`, type: 'neutral' },
        { label: 'רווח תפעולי', value: year1.operatingProfit || -43117, type: 'negative' },
        { label: 'יתרת סגירה', value: year1.closingBalance || 4897, type: 'positive' },
      ],
    },
    {
      title: 'שנה שניה',
      data: [
        { label: 'הכנסות שנתיות', value: year2.revenue || 901740, type: 'neutral' },
        { label: 'לקוחות (התחלה → סוף)', value: `${year2.customersStart || 76} → ${year2.customersEnd || 109}`, type: 'neutral' },
        { label: 'רווח (שכר + יתרה)', value: kpis.year2Profit || 170523, type: 'positive' },
        { label: 'יתרת השקעה להחזר', value: 129130, type: 'neutral' },
      ],
    },
    {
      title: 'שנה שלישית (צפי)',
      data: [
        { label: 'רווח צפוי', value: kpis.year3Profit || 247590, type: 'positive' },
        { label: 'רווח חודשי ממוצע', value: 20632, type: 'positive' },
        { label: 'ROI מלא', value: `${kpis.roiYears || 2.52} שנים`, type: 'neutral' },
      ],
    },
  ]

  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value
    const prefix = value < 0 ? '-' : ''
    return `${prefix}₪${Math.abs(value).toLocaleString()}`
  }

  const getValueColor = (type: string) => {
    switch (type) {
      case 'positive':
        return '#92D050' // success green - keep consistent
      case 'negative':
        return '#FF0000' // danger red - keep consistent
      default:
        return palette.secondary
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🎯</span> תחזיות פיננסיות
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {years.map((year, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-5">
            <h4 className="text-lg font-semibold mb-4 text-center" style={{ color: palette.primary }}>
              {year.title}
            </h4>
            <div className="space-y-3">
              {year.data.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="font-bold" style={{ color: getValueColor(item.type) }}>
                    {formatValue(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
