import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Estadísticas para administradores
    if (session.user.role === "ADMIN") {
      // Obtener estadísticas de clientes
      const totalClients = await db.client.count()
      const activeClients = await db.client.count({
        where: { status: "ACTIVE" },
      })
      const inactiveClients = await db.client.count({
        where: { status: "INACTIVE" },
      })
      const delinquentClients = await db.client.count({
        where: { status: "DELINQUENT" },
      })

      // Obtener estadísticas de tickets
      const totalTickets = await db.ticket.count()
      const openTickets = await db.ticket.count({
        where: { status: "OPEN" },
      })
      const inProgressTickets = await db.ticket.count({
        where: { status: "IN_PROGRESS" },
      })
      const resolvedTickets = await db.ticket.count({
        where: { status: "RESOLVED" },
      })

      // Obtener estadísticas financieras
      const currentMonthStart = new Date()
      currentMonthStart.setDate(1)
      currentMonthStart.setHours(0, 0, 0, 0)

      const previousMonthStart = new Date(currentMonthStart)
      previousMonthStart.setMonth(previousMonthStart.getMonth() - 1)

      const currentMonthIncome = await db.payment.aggregate({
        where: {
          status: "COMPLETED",
          paymentDate: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      })

      const previousMonthIncome = await db.payment.aggregate({
        where: {
          status: "COMPLETED",
          paymentDate: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      })

      const currentMonthExpenses = await db.expense.aggregate({
        where: {
          paidDate: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      })

      const previousMonthExpenses = await db.expense.aggregate({
        where: {
          paidDate: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
        _sum: {
          amount: true,
        },
      })

      // Calcular cambios porcentuales
      const incomeChange =
        previousMonthIncome._sum.amount && previousMonthIncome._sum.amount > 0
          ? (((currentMonthIncome._sum.amount || 0) - previousMonthIncome._sum.amount) /
              previousMonthIncome._sum.amount) *
            100
          : 0

      const expensesChange =
        previousMonthExpenses._sum.amount && previousMonthExpenses._sum.amount > 0
          ? (((currentMonthExpenses._sum.amount || 0) - previousMonthExpenses._sum.amount) /
              previousMonthExpenses._sum.amount) *
            100
          : 0

      const netIncome = (currentMonthIncome._sum.amount || 0) - (currentMonthExpenses._sum.amount || 0)
      const previousNetIncome = (previousMonthIncome._sum.amount || 0) - (previousMonthExpenses._sum.amount || 0)

      const netIncomeChange =
        previousNetIncome && previousNetIncome > 0 ? ((netIncome - previousNetIncome) / previousNetIncome) * 100 : 0

      // Obtener saldos de cuentas
      const accounts = await db.account.findMany()
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

      return NextResponse.json({
        clients: {
          total: totalClients,
          active: activeClients,
          inactive: inactiveClients,
          delinquent: delinquentClients,
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
        },
        finances: {
          currentMonthIncome: currentMonthIncome._sum.amount || 0,
          incomeChange,
          currentMonthExpenses: currentMonthExpenses._sum.amount || 0,
          expensesChange,
          netIncome,
          netIncomeChange,
          totalBalance,
          accounts,
        },
      })
    }
    // Estadísticas para agentes
    else if (session.user.role === "AGENT") {
      // Obtener estadísticas de clientes asignados al agente
      const totalClients = await db.client.count({
        where: { agentId: session.user.id },
      })
      const activeClients = await db.client.count({
        where: {
          agentId: session.user.id,
          status: "ACTIVE",
        },
      })

      // Obtener estadísticas de tickets asignados al agente
      const totalTickets = await db.ticket.count({
        where: { assignedAgentId: session.user.id },
      })
      const openTickets = await db.ticket.count({
        where: {
          assignedAgentId: session.user.id,
          status: "OPEN",
        },
      })

      return NextResponse.json({
        clients: {
          total: totalClients,
          active: activeClients,
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
        },
      })
    }
    // Estadísticas para clientes
    else {
      // Obtener el cliente
      const client = await db.client.findUnique({
        where: { userId: session.user.id },
      })

      if (!client) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
      }

      // Obtener suscripciones activas
      const activeSubscriptions = await db.subscription.count({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      })

      // Obtener planes de pago activos
      const activePaymentPlans = await db.paymentPlan.count({
        where: {
          userId: session.user.id,
          remainingAmount: { gt: 0 },
        },
      })

      // Obtener tickets abiertos
      const openTickets = await db.ticket.count({
        where: {
          clientId: session.user.id,
          status: { in: ["OPEN", "IN_PROGRESS", "WAITING_CLIENT"] },
        },
      })

      // Obtener próximo pago
      const nextPayment = await db.paymentPlan.findFirst({
        where: {
          userId: session.user.id,
          remainingAmount: { gt: 0 },
        },
        orderBy: {
          nextPaymentDate: "asc",
        },
        select: {
          nextPaymentDate: true,
          name: true,
          remainingAmount: true,
          installments: true,
        },
      })

      return NextResponse.json({
        subscriptions: {
          active: activeSubscriptions,
        },
        paymentPlans: {
          active: activePaymentPlans,
        },
        tickets: {
          open: openTickets,
        },
        nextPayment: nextPayment
          ? {
              date: nextPayment.nextPaymentDate,
              name: nextPayment.name,
              amount: nextPayment.remainingAmount / nextPayment.installments,
            }
          : null,
      })
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener las estadísticas" }, { status: 500 })
  }
}
