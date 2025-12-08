'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface InvestmentChartProps {
  equipment: number
  additional: number
  contingency: number
  renovation: number
}

export function InvestmentChart({
  equipment,
  additional,
  contingency,
  renovation,
}: InvestmentChartProps) {
  const total = equipment + additional + contingency + renovation

  const data = {
    labels: ['ציוד מקצועי', 'הוצאות נוספות', 'בלתי מתוכנן', 'שיפוץ ובינוי'],
    datasets: [
      {
        data: [equipment, additional, contingency, renovation],
        backgroundColor: ['#e94560', '#16213e', '#f39c12', '#4ecdc4'],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 15,
        },
      },
    },
  }

  const items = [
    { name: 'ציוד מקצועי', amount: equipment, color: 'bg-primary' },
    { name: 'הוצאות נוספות', amount: additional, color: 'bg-background-light' },
    { name: 'שיפוץ ובינוי', amount: renovation, color: 'bg-secondary' },
    { name: 'בלתי מתוכנן', amount: contingency, color: 'bg-warning' },
  ]

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">💰</span> התפלגות השקעות
      </h3>
      <div className="h-64 mb-6">
        <Doughnut data={data} options={options} />
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.name}</span>
              <span>₪{item.amount.toLocaleString()}</span>
            </div>
            <div className="h-6 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full flex items-center justify-center text-xs font-bold`}
                style={{ width: `${(item.amount / total) * 100}%` }}
              >
                {((item.amount / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
