"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/language-context";

export default function AddExpense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const selectedType = formData.get("type");

    await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        type: selectedType,
        title: formData.get("title"),
        amount: formData.get("amount"),
        date: formData.get("date"),
        category: selectedType === "INCOME" ? "Доход" : formData.get("category"),
      }),
    });

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardContent className="p-6">

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t.back}
              </Link>
              <LangToggle />
            </div>

            <h1 className="text-2xl font-bold">{t.addTitle}</h1>
            <p className="text-gray-500 text-sm">{t.addSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-600">{t.typeLabel}</Label>
              <select
                name="type"
                id="type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="EXPENSE">{t.typeExpense}</option>
                <option value="INCOME">{t.typeIncome}</option>
              </select>
            </div>

            {transactionType === "EXPENSE" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="category" className="text-gray-600">{t.categoryLabel}</Label>
                <select
                  name="category"
                  id="category"
                  className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Еда">{t.cats.food}</option>
                  <option value="Такси">{t.cats.taxi}</option>
                  <option value="Развлечения">{t.cats.fun}</option>
                  <option value="Шоппинг">{t.cats.shop}</option>
                  <option value="Дом">{t.cats.home}</option>
                  <option value="Здоровье">{t.cats.health}</option>
                  <option value="Другое">{t.cats.other}</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-600">{t.titleLabel}</Label>
              <Input
                name="title"
                id="title"
                placeholder={t.titlePlaceholder}
                required
                className="h-12 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-600">{t.amountLabel}</Label>
              <Input
                name="amount"
                id="amount"
                type="number"
                placeholder="0"
                required
                className="h-12 bg-gray-50 border-gray-200 font-mono text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-600">{t.dateLabel}</Label>
              <Input
                name="date"
                id="date"
                type="date"
                required
                className="h-12 bg-gray-50 border-gray-200"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-white text-base transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 w-5 h-5" />}
              {loading ? t.savingBtn : t.saveBtn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
