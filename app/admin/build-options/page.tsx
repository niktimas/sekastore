import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { createBuildOptionAction, deleteBuildOptionAction, updateBuildOptionAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Компоненты | Админка"
};

const optionTypes = [
  ["groupset", "Система"],
  ["wheels", "Колеса"],
  ["handlebar", "Руль / кокпит"]
];

const availabilityOptions = [
  ["preorder", "Предзаказ"],
  ["in_stock", "В наличии"],
  ["order", "Под заказ"]
];

const ridingStyleOptions = [
  ["road", "Шоссе"],
  ["gravel", "Гравий"],
  ["all", "Шоссе + гравий"]
];

function price(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default async function AdminBuildOptionsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const options = await prisma.buildOption.findMany({
    orderBy: [{ optionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }]
  });

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Админка</p>
        <h1>Компоненты</h1>
        <p>Цены отсюда используются в конфигураторе модели.</p>
      </section>

      <section className="admin-panel">
        <h2>Добавить компонент</h2>
        <form className="admin-form-grid" action={createBuildOptionAction}>
          <input name="slug" placeholder="slug" required />
          <input name="brand" placeholder="Бренд" />
          <input name="name" placeholder="Название" required />
          <select name="optionType" defaultValue="groupset">
            {optionTypes.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <input name="price" placeholder="Цена" type="number" min="0" defaultValue={0} />
          <input name="imagePath" placeholder="/media/..." />
          <select name="availability" defaultValue="preorder">
            {availabilityOptions.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <select name="ridingStyle" defaultValue="road">
            {ridingStyleOptions.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
          <input name="sortOrder" placeholder="Сортировка" type="number" defaultValue={100} />
          <input name="source" placeholder="Источник" />
          <textarea name="description" placeholder="Описание" />
          <label className="admin-check">
            <input name="isPreorder" type="checkbox" /> Предзаказ
          </label>
          <label className="admin-check">
            <input name="isActive" type="checkbox" defaultChecked /> Активен
          </label>
          <button className="button button--dark" type="submit">
            Добавить
          </button>
        </form>
      </section>

      <section className="admin-stack">
        {options.map((option) => (
          <article className="admin-panel" key={option.id}>
            <div className="admin-panel__head">
              <div>
                <h2>{option.name}</h2>
                <p>{option.brand ? `${option.brand} / ` : ""}{option.optionType} / {price(option.price)} ₽ / {availabilityOptions.find(([value]) => value === option.availability)?.[1] ?? option.availability} / {ridingStyleOptions.find(([value]) => value === option.ridingStyle)?.[1] ?? option.ridingStyle}</p>
              </div>
              <form action={deleteBuildOptionAction}>
                <input name="id" type="hidden" value={option.id} />
                <button className="admin-danger" type="submit">
                  Удалить
                </button>
              </form>
            </div>
            <form className="admin-form-grid" action={updateBuildOptionAction}>
              <input name="id" type="hidden" value={option.id} />
              <input name="slug" defaultValue={option.slug} required />
              <input name="brand" defaultValue={option.brand ?? ""} placeholder="Бренд" />
              <input name="name" defaultValue={option.name} required />
              <select name="optionType" defaultValue={option.optionType}>
                {optionTypes.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input name="price" type="number" min="0" defaultValue={option.price} />
              <input name="imagePath" defaultValue={option.imagePath ?? ""} placeholder="/media/..." />
              <select name="availability" defaultValue={option.availability}>
                {availabilityOptions.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select name="ridingStyle" defaultValue={option.ridingStyle}>
                {ridingStyleOptions.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input name="sortOrder" type="number" defaultValue={option.sortOrder} />
              <input name="source" defaultValue={option.source ?? ""} placeholder="Источник" />
              <textarea name="description" defaultValue={option.description ?? ""} placeholder="Описание" />
              <label className="admin-check">
                <input name="isPreorder" type="checkbox" defaultChecked={option.isPreorder} /> Предзаказ
              </label>
              <label className="admin-check">
                <input name="isActive" type="checkbox" defaultChecked={option.isActive} /> Активен
              </label>
              <button className="button button--dark" type="submit">
                Сохранить
              </button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
