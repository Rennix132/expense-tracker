import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();

    const newExpense = await prisma.expense.create({
      data: {
        type: body.type || "EXPENSE", 
        title: body.title,
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        userId: session.userId,
        category: body.category || "Другое",
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании:", error);
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}