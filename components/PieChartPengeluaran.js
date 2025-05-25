'use client'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#B2EBF2']

export default function PieChartPengeluaran({ data }) {
  const chartData = Object.entries(
    data.reduce((acc, curr) => {
      if (curr.type === 'expense') {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      }
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  if (chartData.length === 0) return <p className="text-gray-500">Tidak ada pengeluaran.</p>

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {chartData.map((_, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
