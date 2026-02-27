"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Calendar as CalendarIcon, ListFilter, Plus } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { Sidebar } from "@/components/sidebar";
import ExpenseChart from "./ExpenseChart";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: string;
  date: Date;
};

interface DashboardClientProps {
  transactions: Transaction[];
  logout: () => Promise<void>;
  chartData: { name: string; value: number; color: string }[];
  dateRange: { from: string; to: string };
  currentType: string;
}

export function DashboardClient({ transactions, logout, chartData, dateRange, currentType }: DashboardClientProps) {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "from" | "to") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(field, e.target.value);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "ALL") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;
  const hasExpenses = transactions.some((tx) => tx.type === "EXPENSE");

  const tabLabels: Record<string, string> = {
    ALL: t.dashAll,
    INCOME: t.dashIncome,
    EXPENSE: t.dashExpense,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashTitle}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</p>
            </div>
            <Link href="/add-expense">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-lg gap-2">
                <Plus className="w-4 h-4" />
                {t.dashAdd}
              </Button>
            </Link>
          </div>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="date"
                  value={dateRange.from.split("T")[0]}
                  onChange={(e) => handleDateChange(e, "from")}
                  className="w-full text-sm bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-2 pl-8 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                />
                <CalendarIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              </div>
              <span className="text-gray-400 text-sm">→</span>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={dateRange.to.split("T")[0]}
                  onChange={(e) => handleDateChange(e, "to")}
                  className="w-full text-sm bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-2 pl-8 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                />
                <CalendarIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              </div>
            </div>
          </Card>

          <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl">
            {["ALL", "INCOME", "EXPENSE"].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentType === type
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tabLabels[type]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="col-span-2 border-none shadow-xl bg-black text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> {t.dashBalance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-mono">
                  {balance.toLocaleString("ru-KZ")} ₸
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <ArrowUpCircle className="w-3 h-3 text-green-500" /> {t.dashIncome}
                </p>
                <p className="font-bold text-lg text-green-600 font-mono">
                  +{totalIncome.toLocaleString("ru-KZ")} ₸
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <ArrowDownCircle className="w-3 h-3 text-red-500" /> {t.dashExpense}
                </p>
                <p className="font-bold text-lg text-red-600 font-mono">
                  -{totalExpense.toLocaleString("ru-KZ")} ₸
                </p>
              </CardContent>
            </Card>
          </div>

          {hasExpenses && (
            <ExpenseChart
              data={chartData}
              title={t.dashChartTitle ?? "Распределение"}
              noDataText={t.dashEmpty}
            />
          )}

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ListFilter className="w-4 h-4" /> {t.dashHistory}
            </h2>

            {transactions.length === 0 ? (
              <div className="text-center p-10 text-gray-500 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-dashed border-gray-200 dark:border-zinc-800">
                {t.dashEmpty}
              </div>
            ) : (
              <div className="grid gap-3">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                        <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-xs text-gray-500 mt-1 inline-block">
                          {tx.category}
                        </span>
                      </div>
                      <div className={`font-mono font-bold text-base ${tx.type === "INCOME" ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                        {tx.type === "INCOME" ? "+" : "-"}{tx.amount.toLocaleString("ru-KZ")} ₸
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
