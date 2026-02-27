import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 1. Проверяем, нет ли уже такого email в базе
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // 2. Хешируем пароль 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Создаем пользователя в БД
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "Без имени",
      },
    });

    // 4. Сразу авторизуем его 
    await createSession(user.id);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return NextResponse.json(
      { error: "Что-то пошло не так при регистрации" },
      { status: 500 }
    );
  }
}