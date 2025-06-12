"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    ingresos: 4000,
    gastos: 2400,
  },
  {
    name: "Feb",
    ingresos: 3000,
    gastos: 1398,
  },
  {
    name: "Mar",
    ingresos: 9800,
    gastos: 2800,
  },
  {
    name: "Abr",
    ingresos: 3908,
    gastos: 2908,
  },
  {
    name: "May",
    ingresos: 4800,
    gastos: 2800,
  },
  {
    name: "Jun",
    ingresos: 3800,
    gastos: 2600,
  },
  {
    name: "Jul",
    ingresos: 4300,
    gastos: 2900,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, ""]} labelFormatter={(label) => `Mes: ${label}`} />
        <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gastos" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
