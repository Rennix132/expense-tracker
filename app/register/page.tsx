"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.registerError);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t.unexpectedError);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-end mb-2">
            <LangToggle />
          </div>
          <CardTitle className="text-2xl font-bold">{t.registerTitle}</CardTitle>
          <CardDescription>{t.registerSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t.registerName}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t.registerNamePlaceholder}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ivan@example.com"
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.registerPassword}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-gray-50 border-gray-200"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-black hover:bg-gray-800 text-white mt-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
              {loading ? t.registerLoading : t.registerBtn}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {t.registerHasAccount}{" "}
            <Link href="/login" className="text-black font-medium hover:underline dark:text-white">
              {t.registerLoginLink}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
