"use client";

import { Globe } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface LangToggleProps {
  className?: string;
}

export function LangToggle({ className }: LangToggleProps) {
  const { t, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      title="Switch language"
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-all",
        className ?? "text-gray-500 hover:text-black h-8 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-white"
      )}
    >
      <Globe className="w-4 h-4 shrink-0" />
      {t.langToggle}
    </button>
  );
}
