'use client'

import { usePalette } from './PaletteProvider'

interface KeyMetricsProps {
  totalInvestment: number
  spaceGross: number
  maxCapacity: number
  monthsToBreakeven: number
  roiYears: number
  averagePrice: number
}

export function KeyMetrics({
  totalInvestment,
  spaceGross,
  maxCapacity,
  monthsToBreakeven,
  roiYears,
  averagePrice,
}: KeyMetricsProps) {
  const palette = usePalette()
  const metrics = [
    { value: `₪${totalInvestment.toLocaleString()}`, label: 'סך השקעה' },
    { value: `${spaceGross} מ"ר`, label: 'שטח ברוטו' },
    { value: maxCapacity, label: 'תפוסה מלאה' },
    { value: monthsToBreakeven, label: 'חודשים לאיזון' },
    { value: roiYears, label: 'שנים ל-ROI' },
    { value: `₪${averagePrice.toLocaleString()}`, label: 'מחיר ממוצע' },
  ]

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
        <span className="text-2xl">📊</span> מדדי מפתח
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-xl"
            style={{
              backgroundColor: hexToRgba(palette.primary, 0.1),
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: hexToRgba(palette.primary, 0.2),
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: palette.primaryLight }}>
              {metric.value}
            </div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
