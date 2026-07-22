import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Админка"
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [leadCount, newLeadCount, inventoryCount, buildOptionCount, modelCount, analyticsCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.inventoryItem.count(),
    prisma.buildOption.count(),
    prisma.model.count(),
    prisma.analyticsEvent.count()
  ]);

  const cards = [
    { href: "/admin/leads", label: "Заявки", value: leadCount, note: `${newLeadCount} новых` },
    { href: "/admin/inventory", label: "Наличие", value: inventoryCount, note: "велосипеды и фреймы" },
    { href: "/admin/build-options", label: "Компоненты", value: buildOptionCount, note: "системы, рули и колеса" },
    { href: "/admin/models", label: "Модели", value: modelCount, note: "каталог SEKA" },
    { href: "/admin/analytics", label: "Метрики", value: analyticsCount, note: "события поведения" }
  ];

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Админка</p>
        <h1>Управление сайтом</h1>
        <p>Редактирование наличия, цен, компонентов, моделей и заявок.</p>
      </section>

      <section className="admin-grid">
        {cards.map((card) => (
          <Link className="admin-card" href={card.href} key={card.href}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </Link>
        ))}
      </section>
    </main>
  );
}
