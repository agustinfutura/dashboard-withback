import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener el tipo de gráfico solicitado
    const { searchParams } = new URL(req.url)
    const chartType = searchParams.get("type")

    // Solo administradores pueden acceder a ciertos gráficos
    if (
      session.user.role !== "ADMIN" &&
      ["income-expense", "client-growth", "ticket-status"].includes(chartType || "")
    ) {
      return NextResponse.json({ error: "No tienes permisos para acceder a estos datos" }, { status: 403 })
    }

    // Generar datos según el tipo de gráfico solicitado
    switch (chartType) {
      case "income-expense": {
        // Datos de ingresos y gastos mensuales para el último año
        const months = []
        const currentDate = new Date()

        for (let i = 0; i < 7; i++) {
          const month = new Date(currentDate)
          month.setMonth(currentDate.getMonth() - i)
          months.unshift(month)
        }

        const chartData = await Promise.all(
          months.map(async (month) => {
            const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
            const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

            // Obtener ingresos del mes
            const income = await db.payment.aggregate({
              where: {
                status: "COMPLETED",
                paymentDate: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
              _sum: {
                amount: true,
              },
            })

            // Obtener gastos del mes
            const expenses = await db.expense.aggregate({
              where: {
                paidDate: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
              _sum: {
                amount: true,
              },
            })

            const monthName = month.toLocaleString("default", { month: "short" })

            return {
              name: monthName,
              ingresos: income._sum.amount || 0,
              gastos: expenses._sum.amount || 0,
              netcash: (income._sum.amount || 0) - (expenses._sum.amount || 0),
            }
          }),
        )

        return NextResponse.json(chartData)
      }

      case "client-growth": {
        // Datos de crecimiento de clientes por mes
        const months = []
        const currentDate = new Date()

        for (let i = 0; i < 7; i++) {
          const month = new Date(currentDate)
          month.setMonth(currentDate.getMonth() - i)
          months.unshift(month)
        }

        const chartData = await Promise.all(
          months.map(async (month) => {
            const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
            const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

            // Obtener nuevos clientes del mes
            const newClients = await db.client.count({
              where: {
                createdAt: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
            })

            // Obtener clientes activos al final del mes
            const activeClients = await db.client.count({
              where: {
                status: "ACTIVE",
                createdAt: {
                  lte: endOfMonth,
                },
              },
            })

            // Obtener clientes inactivos al final del mes
            const inactiveClients = await db.client.count({
              where: {
                status: { in: ["INACTIVE", "DELINQUENT", "CANCELLED"] },
                createdAt: {
                  lte: endOfMonth,
                },
              },
            })

            const monthName = month.toLocaleString("default", { month: "short" })

            return {
              name: monthName,
              nuevos: newClients,
              activos: activeClients,
              inactivos: inactiveClients,
            }
          }),
        )

        return NextResponse.json(chartData)
      }

      case "ticket-status": {
        // Datos de tickets por estado
        const ticketsByStatus = await db.ticket.groupBy({
          by: ["status"],
          _count: {
            id: true,
          },
        })

        const chartData = ticketsByStatus.map((item) => ({
          status: item.status,
          count: item._count.id,
        }))

        return NextResponse.json(chartData)
      }

      case "client-payments": {
        // Para clientes: historial de pagos
        if (session.user.role === "USER") {
          const client = await db.client.findUnique({
            where: { userId: session.user.id },
          })

          if (!client) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
          }

          const months = []
          const currentDate = new Date()

          for (let i = 0; i < 6; i++) {
            const month = new Date(currentDate)
            month.setMonth(currentDate.getMonth() - i)
            months.unshift(month)
          }

          const chartData = await Promise.all(
            months.map(async (month) => {
              const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
              const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

              // Obtener pagos del mes
              const payments = await db.payment.aggregate({
                where: {
                  clientId: client.id,
                  status: "COMPLETED",
                  paymentDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                  },
                },
                _sum: {
                  amount: true,
                },
              })

              const monthName = month.toLocaleString("default", { month: "short" })

              return {
                name: monthName,
                amount: payments._sum.amount || 0,
              }
            }),
          )

          return NextResponse.json(chartData)
        }

        return NextResponse.json({ error: "Tipo de gráfico no válido para este usuario" }, { status: 400 })
      }

      default:
        return NextResponse.json({ error: "Tipo de gráfico no válido" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error al obtener datos para gráficos:", error)
    return NextResponse.json({ error: "Error al obtener los datos para gráficos" }, { status: 500 })
  }
}
