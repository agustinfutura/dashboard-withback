"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Ene",
    nuevos: 40,
    activos: 240,
    inactivos: 20,
  },
  {
    name: "Feb",
    nuevos: 30,
    activos: 260,
    inactivos: 25,
  },
  {
    name: "Mar",
    nuevos: 98,
    activos: 340,
    inactivos: 18,
  },
  {
    name: "Abr",
    nuevos: 39,
    activos: 370,
    inactivos: 22,
  },
  {
    name: "May",
    nuevos: 48,
    activos: 410,
    inactivos: 28,
  },
  {
    name: "Jun",
    nuevos: 38,
    activos: 435,
    inactivos: 30,
  },
  {
    name: "Jul",
    nuevos: 43,
    activos: 470,
    inactivos: 25,
  },
]

export function ClientStats() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="nuevos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="activos" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="inactivos" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}
