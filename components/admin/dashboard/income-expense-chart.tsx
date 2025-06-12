"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Ene",
    ingresos: 4000,
    gastos: 2400,
    netcash: 1600,
  },
  {
    name: "Feb",
    ingresos: 3000,
    gastos: 1398,
    netcash: 1602,
  },
  {
    name: "Mar",
    ingresos: 9800,
    gastos: 2800,
    netcash: 7000,
  },
  {
    name: "Abr",
    ingresos: 3908,
    gastos: 2908,
    netcash: 1000,
  },
  {
    name: "May",
    ingresos: 4800,
    gastos: 2800,
    netcash: 2000,
  },
  {
    name: "Jun",
    ingresos: 3800,
    gastos: 2600,
    netcash: 1200,
  },
  {
    name: "Jul",
    ingresos: 4300,
    gastos: 2900,
    netcash: 1400,
  },
]

export function IncomeExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, ""]} labelFormatter={(label) => `Mes: ${label}`} />
        <Legend />
        <Line type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="gastos" stroke="hsl(var(--destructive))" strokeWidth={2} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="netcash" stroke="hsl(var(--success))" strokeWidth={2} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
