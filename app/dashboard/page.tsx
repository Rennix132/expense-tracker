import { prisma } from "@/lib/db";
import { getSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; type?: string }>;
}) {
  const session = await getSession();

  if (!session) redirect("/login");

  const params = await searchParams;

  const from = params.from ? new Date(params.from) : startOfMonth(new Date());
  const to = params.to ? new Date(params.to) : endOfMonth(new Date());

  const typeFilter = params.type === "INCOME" || params.type === "EXPENSE"
    ? params.type
    : undefined;

  const transactions = await prisma.expense.findMany({
    where: { 
      userId: session.userId,
      date: {
        gte: from,
        lte: to
      },
      type: typeFilter
    },
    orderBy: { date: "desc" },
  });

  const expenseTransactions = transactions.filter(t => t.type === "EXPENSE");
  
  const chartDataRaw = expenseTransactions.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const COLORS = ["#000000", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"];

  const chartData = Object.keys(chartDataRaw).map((name, index) => ({
    name,
    value: chartDataRaw[name],
    color: COLORS[index % COLORS.length]
  }));

  async function logout() {
    "use server";
    await deleteSession();
    redirect("/login");
  }

  return (
    <DashboardClient 
      transactions={transactions} 
      logout={logout} 
      chartData={chartData} 
      dateRange={{ 
        from: from.toISOString(), 
        to: to.toISOString() 
      }}
      currentType={params.type || "ALL"}
    />
  );
}