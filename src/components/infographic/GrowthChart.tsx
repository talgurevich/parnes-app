'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface GrowthChartProps {
  monthlyData: { month: number; customers: number }[]
}

export function GrowthChart({ monthlyData }: GrowthChartProps) {
  const defaultData = [33, 37, 41, 45, 49, 53, 57, 61, 64, 67, 70, 73]
  const customers = monthlyData.length > 0
    ? monthlyData.map((d) => d.customers)
    : defaultData

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    datasets: [
      {
        label: 'לקוחות במסלול',
        data: customers,
        borderColor: '#e94560',
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#e94560',
        pointRadius: 5,
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
          color: 'rgba(255,255,255,0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'מספר לקוחות',
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        min: 30,
        max: 80,
      },
    },
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">📈</span> צמיחת לקוחות
      </h3>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
