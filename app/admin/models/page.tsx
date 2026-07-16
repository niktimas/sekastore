import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { createModelAction, deleteModelAction, updateModelAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Модели | Админка"
};

export default async function AdminModelsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [models, lines] = await Promise.all([
    prisma.model.findMany({
      include: { line: true, colors: true, sizes: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.productLine.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Админка</p>
        <h1>Модели</h1>
        <p>Управление списком моделей и текстами каталога.</p>
      </section>

      <section className="admin-panel">
        <h2>Добавить модель</h2>
        <form className="admin-form-grid" action={createModelAction}>
          <select name="lineId" required defaultValue="">
            <option value="" disabled>Линейка</option>
            {lines.map((line) => (
              <option value={line.id} key={line.id}>{line.name}</option>
            ))}
          </select>
          <input name="slug" placeholder="slug" required />
          <input name="name" placeholder="Название" required />
          <input name="version" placeholder="Версия" />
          <input name="category" placeholder="Категория" required defaultValue="Road" />
          <input name="sortOrder" type="number" defaultValue={100} />
          <textarea name="shortDescription" placeholder="Короткое описание" />
          <textarea name="description" placeholder="Описание" />
          <label className="admin-check">
            <input name="isPublished" type="checkbox" defaultChecked /> Опубликована
          </label>
          <button className="button button--dark" type="submit">Добавить</button>
        </form>
      </section>

      <section className="admin-stack">
        {models.map((model) => (
          <article className="admin-panel" key={model.id}>
            <div className="admin-panel__head">
              <div>
                <h2>{model.name}</h2>
                <p>{model.line.name} / цветов: {model.colors.length} / размеров: {model.sizes.length}</p>
              </div>
              <form action={deleteModelAction}>
                <input name="id" type="hidden" value={model.id} />
                <button className="admin-danger" type="submit">Удалить / скрыть</button>
              </form>
            </div>
            <form className="admin-form-grid" action={updateModelAction}>
              <input name="id" type="hidden" value={model.id} />
              <input name="slug" defaultValue={model.slug} required />
              <input name="name" defaultValue={model.name} required />
              <input name="version" defaultValue={model.version ?? ""} placeholder="Версия" />
              <input name="category" defaultValue={model.category} required />
              <input name="sortOrder" type="number" defaultValue={model.sortOrder} />
              <textarea name="shortDescription" defaultValue={model.shortDescription ?? ""} placeholder="Короткое описание" />
              <textarea name="description" defaultValue={model.description ?? ""} placeholder="Описание" />
              <label className="admin-check">
                <input name="isPublished" type="checkbox" defaultChecked={model.isPublished} /> Опубликована
              </label>
              <button className="button button--dark" type="submit">Сохранить</button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
