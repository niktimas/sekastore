"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? "Не удалось войти");
        return;
      }

      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form className="form" action={submit}>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label className="field">
        <span>Пароль</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="button button--dark" type="submit" disabled={isPending}>
        {isPending ? "Вход..." : "Войти"}
      </button>
      <p className="form-status" role="status">
        {error}
      </p>
    </form>
  );
}
