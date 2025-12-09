'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { usePalette } from './PaletteProvider'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface RevenueChartProps {
  monthlyData: { month: number; revenueSubscription: number; revenuePersonal: number }[]
}

export function RevenueChart({ monthlyData }: RevenueChartProps) {
  const palette = usePalette()
  const defaultSubscription = [17936, 20110, 22284, 27342, 29772, 32203, 34633, 37064, 38886, 40709, 42532, 44355]
  const defaultPersonal = [2772, 3696, 4620, 5544, 6468, 7392, 8316, 9240, 10164, 11088, 12012, 12936]

  const subscription = monthlyData.length > 0
    ? monthlyData.map((d) => d.revenueSubscription)
    : defaultSubscription

  const personal = monthlyData.length > 0
    ? monthlyData.map((d) => d.revenuePersonal)
    : defaultPersonal

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    datasets: [
      {
        label: 'הכנסות מסלולים',
        data: subscription,
        backgroundColor: palette.secondary,
        borderRadius: 5,
      },
      {
        label: 'הכנסות אישיים',
        data: personal,
        backgroundColor: palette.primary,
        borderRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'חודש',
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
        grid: {
          display: false,
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: '₪',
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          callback: function (value: unknown) {
            return '₪' + Number(value).toLocaleString()
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        stacked: true,
      },
    },
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">💵</span> תזרים הכנסות - שנה ראשונה
      </h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
