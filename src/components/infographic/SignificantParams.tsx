interface Param {
  name: string
  value: number | string
  note?: string
  color: string
}

interface SignificantParamsProps {
  params: Param[]
}

export function SignificantParams({ params }: SignificantParamsProps) {
  const defaultParams: Param[] = [
    { name: 'גיוס לקוחות פריסייל', value: 33, note: 'מעל הממוצע', color: 'red' },
    { name: 'צפי רווח חודשי - שנה שלישית', value: 20632, note: 'פוטנציאל בתפוסה מלאה', color: 'red' },
    { name: 'קצב צמיחה MoM שנה ראשונה', value: 3.27, note: 'לקוחות/חודש', color: 'green' },
    { name: 'צפי ל-ROI מלא', value: 2.52, note: 'שנים', color: 'green' },
    { name: 'ממוצע חודשי שעות אימון בעלים', value: 68, note: 'שעות', color: 'orange' },
    { name: 'שכירות למ"ר (כולל ניהול)', value: 136, note: 'ממוצע לאזור', color: 'orange' },
    { name: 'תקציב ומימון', value: 296500, note: 'מימון נמוך, הון עצמי גבוה', color: 'orange' },
    { name: 'רווח חודשי ממוצע (2 שנים)', value: 8559, note: '* לפני הפרשות', color: 'orange' },
  ]

  const displayParams = params.length > 0 ? params : defaultParams

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-success/10',
          border: 'border-success/40',
          text: 'text-success',
        }
      case 'orange':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/40',
          text: 'text-warning',
        }
      case 'red':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/40',
          text: 'text-red-400',
        }
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/20',
          text: 'text-white',
        }
    }
  }

  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value
    if (value > 1000) return `₪${value.toLocaleString()}`
    return value.toString()
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">🚦</span> פרמטרים משמעותיים
      </h3>

      {/* Color Legend */}
      <div className="flex gap-6 mb-6 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-success rounded" />
          <span className="text-sm">תקין / חיובי</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-warning rounded" />
          <span className="text-sm">בינוני / לתשומת לב</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-danger rounded" />
          <span className="text-sm">דורש התייחסות</span>
        </div>
      </div>

      {/* Parameters Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayParams.map((param, index) => {
          const colors = getColorClasses(param.color)
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 ${colors.bg} ${colors.border}`}
            >
              <div className="text-sm opacity-80 mb-1">{param.name}</div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {formatValue(param.value)}
              </div>
              {param.note && (
                <div className={`text-xs mt-1 ${colors.text}`}>{param.note}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Owner Hours Scale */}
      <div className="mt-8 p-5 bg-white/5 rounded-xl">
        <h4 className="text-center mb-4">סקאלת עומס שעות בעלים (חודשי)</h4>
        <div className="flex h-10 rounded-lg overflow-hidden">
          <div className="flex-[48] bg-gradient-to-r from-success to-green-400 flex items-center justify-center font-bold">
            0-48
          </div>
          <div className="flex-[32] bg-gradient-to-r from-warning to-yellow-300 flex items-center justify-center font-bold text-gray-800">
            49-80
          </div>
          <div className="flex-[20] bg-gradient-to-r from-danger to-red-400 flex items-center justify-center font-bold">
            81+
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm opacity-70">
          <span>עומס קל</span>
          <span>עומס בינוני</span>
          <span>עומס גבוה</span>
        </div>
        <div className="text-center mt-4 text-warning">
          ▲ מצב נוכחי: 68 שעות
        </div>
      </div>
    </div>
  )
}
