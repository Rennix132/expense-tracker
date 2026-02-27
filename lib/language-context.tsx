"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "ru" | "en";

export const translations = {
  ru: {
    // общее
    langToggle: "EN",
    // sidebar
    navDashboard: "Дашборд",
    navAnalytics: "Аналитика",
    navSettings: "Настройки",
    navProfile: "Профиль",
    // dashboard
    dashTitle: "Мои финансы",
    dashAdd: "+ Добавить",
    dashBalance: "Текущий баланс",
    dashIncome: "Доходы",
    dashExpense: "Расходы",
    dashAll: "Все",
    dashHistory: "История",
    dashEmpty: "Нет операций",
    dashLogout: "Выйти",
    dashChartTitle: "Распределение расходов",
    // add-expense
    back: "Назад",
    addTitle: "Новая операция",
    addSubtitle: "Добавьте доход или расход",
    typeLabel: "Тип операции",
    typeExpense: "Расход",
    typeIncome: "Доход",
    categoryLabel: "Категория",
    titleLabel: "Название",
    titlePlaceholder: "Например: Обед или Аванс",
    amountLabel: "Сумма (₸)",
    dateLabel: "Дата",
    saveBtn: "Добавить",
    savingBtn: "Сохранение...",
    cats: {
      food: "Еда",
      taxi: "Такси",
      fun: "Развлечения",
      shop: "Шоппинг",
      home: "Дом",
      health: "Здоровье",
      other: "Другое",
    },
    // login
    loginTitle: "С возвращением!",
    loginSubtitle: "Введите данные для входа в аккаунт",
    loginPassword: "Пароль",
    loginBtn: "Войти",
    loginLoading: "Вход...",
    loginNoAccount: "Нет аккаунта?",
    loginRegisterLink: "Зарегистрироваться",
    loginError: "Ошибка авторизации",
    // register
    registerTitle: "Создать аккаунт",
    registerSubtitle: "Начните контролировать свои финансы прямо сейчас",
    registerName: "Имя",
    registerNamePlaceholder: "Иван Иванов",
    registerPassword: "Пароль",
    registerBtn: "Зарегистрироваться",
    registerLoading: "Регистрация...",
    registerHasAccount: "Уже есть аккаунт?",
    registerLoginLink: "Войти",
    registerError: "Ошибка при регистрации",
    unexpectedError: "Произошла непредвиденная ошибка",
  },
  en: {
    // general
    langToggle: "RU",
    // sidebar
    navDashboard: "Dashboard",
    navAnalytics: "Analytics",
    navSettings: "Settings",
    navProfile: "Profile",
    // dashboard
    dashTitle: "My Finances",
    dashAdd: "+ Add",
    dashBalance: "Current Balance",
    dashIncome: "Income",
    dashExpense: "Expenses",
    dashAll: "All",
    dashHistory: "History",
    dashEmpty: "No transactions",
    dashLogout: "Log out",
    dashChartTitle: "Expense Distribution",
    // add-expense
    back: "Back",
    addTitle: "New Transaction",
    addSubtitle: "Add an income or expense",
    typeLabel: "Transaction Type",
    typeExpense: "Expense",
    typeIncome: "Income",
    categoryLabel: "Category",
    titleLabel: "Title",
    titlePlaceholder: "e.g., Lunch or Salary",
    amountLabel: "Amount (₸)",
    dateLabel: "Date",
    saveBtn: "Add",
    savingBtn: "Saving...",
    cats: {
      food: "Food",
      taxi: "Taxi",
      fun: "Entertainment",
      shop: "Shopping",
      home: "Home",
      health: "Health",
      other: "Other",
    },
    // login
    loginTitle: "Welcome back!",
    loginSubtitle: "Enter your credentials to sign in",
    loginPassword: "Password",
    loginBtn: "Sign In",
    loginLoading: "Signing in...",
    loginNoAccount: "Don't have an account?",
    loginRegisterLink: "Register",
    loginError: "Authentication error",
    // register
    registerTitle: "Create Account",
    registerSubtitle: "Start tracking your finances right now",
    registerName: "Name",
    registerNamePlaceholder: "John Doe",
    registerPassword: "Password",
    registerBtn: "Register",
    registerLoading: "Registering...",
    registerHasAccount: "Already have an account?",
    registerLoginLink: "Sign In",
    registerError: "Registration error",
    unexpectedError: "An unexpected error occurred",
  },
};

type Translations = typeof translations.ru;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  t: translations.ru,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "ru" || saved === "en") setLang(saved);
  }, []);

  function toggleLang() {
    setLang((prev) => {
      const next = prev === "ru" ? "en" : "ru";
      localStorage.setItem("lang", next);
      return next;
    });
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
