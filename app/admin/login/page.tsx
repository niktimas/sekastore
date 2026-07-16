import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Вход в админку"
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="admin-login">
      <section className="admin-login__panel">
        <p className="eyebrow">Админка</p>
        <h1>Вход</h1>
        <AdminLoginForm />
      </section>
    </main>
  );
}
