import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { createLeadAction, deleteLeadAction, updateLeadAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Заявки | Админка"
};

const statuses = [
  ["new", "Новая"],
  ["in_work", "В работе"],
  ["done", "Закрыта"],
  ["cancelled", "Отменена"]
];

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [leads, models, colors, sizes] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { model: true, color: true, size: true }
    }),
    prisma.model.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.color.findMany({ orderBy: [{ modelId: "asc" }, { sortOrder: "asc" }] }),
    prisma.size.findMany({ orderBy: [{ modelId: "asc" }, { sortOrder: "asc" }] })
  ]);

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Админка</p>
        <h1>Заявки</h1>
      </section>

      <section className="admin-panel">
        <h2>Добавить заявку вручную</h2>
        <form className="admin-form-grid" action={createLeadAction}>
          <input name="name" placeholder="Имя" required />
          <input name="phone" placeholder="Телефон" />
          <input name="email" placeholder="Email" type="email" />
          <input name="city" placeholder="Город" />
          <select name="status" defaultValue="new">
            {statuses.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <select name="modelId" defaultValue="">
            <option value="">Модель не выбрана</option>
            {models.map((model) => (
              <option value={model.id} key={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <select name="colorId" defaultValue="">
            <option value="">Цвет не выбран</option>
            {colors.map((color) => (
              <option value={color.id} key={color.id}>
                {color.name}
              </option>
            ))}
          </select>
          <select name="sizeId" defaultValue="">
            <option value="">Размер не выбран</option>
            {sizes.map((size) => (
              <option value={size.id} key={size.id}>
                {size.label}
              </option>
            ))}
          </select>
          <textarea name="message" placeholder="Комментарий" />
          <button className="button button--dark" type="submit">
            Создать заявку
          </button>
        </form>
      </section>

      <section className="admin-stack">
        {leads.map((lead) => (
          <article className="admin-panel" key={lead.id}>
            <div className="admin-panel__head">
              <div>
                <h2>{lead.name}</h2>
                <p>{lead.createdAt.toLocaleString("ru-RU")}</p>
              </div>
              <form action={deleteLeadAction}>
                <input name="id" type="hidden" value={lead.id} />
                <button className="admin-danger" type="submit">
                  Удалить
                </button>
              </form>
            </div>
            <form className="admin-form-grid" action={updateLeadAction}>
              <input name="id" type="hidden" value={lead.id} />
              <input name="name" placeholder="Имя" defaultValue={lead.name} required />
              <input name="phone" placeholder="Телефон" defaultValue={lead.phone ?? ""} />
              <input name="email" placeholder="Email" defaultValue={lead.email ?? ""} type="email" />
              <input name="city" placeholder="Город" defaultValue={lead.city ?? ""} />
              <select name="status" defaultValue={lead.status}>
                {statuses.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select name="modelId" defaultValue={lead.modelId ?? ""}>
                <option value="">Модель не выбрана</option>
                {models.map((model) => (
                  <option value={model.id} key={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <select name="colorId" defaultValue={lead.colorId ?? ""}>
                <option value="">Цвет не выбран</option>
                {colors.map((color) => (
                  <option value={color.id} key={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
              <select name="sizeId" defaultValue={lead.sizeId ?? ""}>
                <option value="">Размер не выбран</option>
                {sizes.map((size) => (
                  <option value={size.id} key={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
              <textarea name="message" placeholder="Комментарий" defaultValue={lead.message ?? ""} />
              <button className="button button--dark" type="submit">
                Сохранить
              </button>
            </form>
          </article>
        ))}
        {leads.length === 0 ? <p className="admin-empty">Заявок пока нет.</p> : null}
      </section>
    </main>
  );
}
