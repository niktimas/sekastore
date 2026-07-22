import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { adminBrands, adminHref, resolveAdminBrand, type AdminBrand } from "@/lib/admin-brand";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Админка"
};

type AdminPageProps = {
  searchParams: Promise<{ brand?: string }>;
};

function leadWhere(brand: AdminBrand) {
  const tavelo = {
    OR: [{ message: { contains: "Tavelo", mode: "insensitive" as const } }, { model: { name: { contains: "Tavelo", mode: "insensitive" as const } } }]
  };

  if (brand === "tavelo") {
    return tavelo;
  }

  return {
    NOT: tavelo
  };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const brand = await resolveAdminBrand(await searchParams);
  const isTavelo = brand === "tavelo";
  const leadFilter = leadWhere(brand);

  const [leadCount, newLeadCount, inventoryCount, buildOptionCount, modelCount, analyticsCount] = await Promise.all([
    prisma.lead.count({ where: leadFilter }),
    prisma.lead.count({ where: { ...leadFilter, status: "new" } }),
    isTavelo ? Promise.resolve(0) : prisma.inventoryItem.count(),
    isTavelo ? Promise.resolve(1) : prisma.buildOption.count(),
    isTavelo ? Promise.resolve(5) : prisma.model.count(),
    prisma.analyticsEvent.count({
      where: isTavelo
        ? { OR: [{ path: { startsWith: "/tavelo" } }, { target: { contains: "Tavelo", mode: "insensitive" } }] }
        : { NOT: { OR: [{ path: { startsWith: "/tavelo" } }, { target: { contains: "Tavelo", mode: "insensitive" } }] } }
    })
  ]);

  const cards = [
    { href: "/admin/leads", label: "Заявки", value: leadCount, note: `${newLeadCount} новых` },
    { href: "/admin/inventory", label: "Наличие", value: inventoryCount, note: isTavelo ? "витрина Tavelo отдельно" : "велосипеды и фреймы" },
    { href: "/admin/build-options", label: "Компоненты", value: buildOptionCount, note: isTavelo ? "кокпит Tavelo" : "системы, рули и колеса" },
    { href: "/admin/models", label: "Модели", value: modelCount, note: isTavelo ? "каталог Tavelo" : "каталог SEKA" },
    { href: "/admin/analytics", label: "Метрики", value: analyticsCount, note: "события поведения" }
  ];

  return (
    <main className="admin-page">
      <AdminNav brand={brand} />
      <section className="page-title">
        <p className="eyebrow">Админка / {adminBrands[brand].label}</p>
        <h1>Управление сайтом {adminBrands[brand].title}</h1>
        <p>
          Выберите сайт в переключателе сверху. Разделы, заявки и метрики открываются в выбранном контексте, чтобы SEKA и Tavelo не смешивались.
        </p>
      </section>

      <section className="admin-grid">
        {cards.map((card) => (
          <Link className="admin-card" href={adminHref(card.href, brand)} key={card.href}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </Link>
        ))}
      </section>
    </main>
  );
}
