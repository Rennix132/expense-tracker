"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, Settings, User, LogOut, Wallet, Globe } from "lucide-react";
import { useLang } from "@/lib/language-context";

interface SidebarProps {
  logout: () => Promise<void>;
}

export function Sidebar({ logout }: SidebarProps) {
  const pathname = usePathname();
  const { t, toggleLang } = useLang();

  const navItems = [
    { href: "/dashboard", label: t.navDashboard, icon: LayoutDashboard },
    { href: "/analytics", label: t.navAnalytics, icon: BarChart2 },
    { href: "/settings", label: t.navSettings, icon: Settings },
    { href: "/profile", label: t.navProfile, icon: User },
  ];

  return (
    <aside className="hidden md:flex group flex-col min-h-screen w-[60px] hover:w-56 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out">

      <div className="flex items-center gap-3 px-[14px] py-6 border-b border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4 text-white dark:text-black" />
        </div>
        <span className="font-bold text-base tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
          Money Keeper
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-[10px] py-4 flex-1 overflow-hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-[10px] py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-[10px] py-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-1 overflow-hidden">
        <button
          onClick={toggleLang}
          className="flex items-center gap-3 px-[10px] py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all whitespace-nowrap w-full"
          title="Switch language"
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            {t.langToggle}
          </span>
        </button>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-[10px] py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
              {t.dashLogout}
            </span>
          </button>
        </form>
      </div>

    </aside>
  );
}
