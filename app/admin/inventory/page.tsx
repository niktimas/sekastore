import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import {
  createInventoryItemAction,
  deleteInventoryItemAction,
  updateInventoryItemAction
} from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Наличие | Админка"
};

const itemTypes = [
  ["ready_bike", "Готовый велосипед"],
  ["frame", "Фрейм"]
];

const statuses = [
  ["in_stock", "В наличии"],
  ["reserved", "Резерв"],
  ["sold", "Продано"],
  ["unknown", "Неизвестно"]
];

function price(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default async function AdminInventoryPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [items, models, colors, sizes, buildOptions] = await Promise.all([
    prisma.inventoryItem.findMany({
      include: { model: true, color: true, size: true, buildOption: true },
      orderBy: [{ itemType: "asc" }, { sortOrder: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.model.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.color.findMany({ orderBy: [{ modelId: "asc" }, { sortOrder: "asc" }, { name: "asc" }] }),
    prisma.size.findMany({ orderBy: [{ modelId: "asc" }, { sortOrder: "asc" }, { label: "asc" }] }),
    prisma.buildOption.findMany({ orderBy: [{ optionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }] })
  ]);

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Админка</p>
        <h1>Наличие</h1>
        <p>Эти записи формируют страницу “Наличие” и список фреймов в конфигураторе.</p>
      </section>

      <section className="admin-panel">
        <h2>Добавить позицию</h2>
        <form className="admin-form-grid" action={createInventoryItemAction}>
          <select name="itemType" defaultValue="frame">
            {itemTypes.map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
          <select name="modelId" required defaultValue="">
            <option value="" disabled>Модель</option>
            {models.map((model) => (
              <option value={model.id} key={model.id}>{model.name}</option>
            ))}
          </select>
          <select name="colorId" defaultValue="">
            <option value="">Цвет из каталога</option>
            {colors.map((color) => (
              <option value={color.id} key={color.id}>{color.name}</option>
            ))}
          </select>
          <select name="sizeId" defaultValue="">
            <option value="">Размер из каталога</option>
            {sizes.map((size) => (
              <option value={size.id} key={size.id}>{size.label}</option>
            ))}
          </select>
          <input name="displayModel" placeholder="Модель для таблицы" />
          <input name="displayColor" placeholder="Цвет для таблицы" />
          <input name="displaySize" placeholder="Размер для таблицы" />
          <input name="cockpit" placeholder="Руль" />
          <input name="price" placeholder="Цена" type="number" min="0" defaultValue={0} />
          <input name="quantity" placeholder="Кол-во" type="number" min="0" />
          <select name="status" defaultValue="in_stock">
            {statuses.map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
          <select name="buildOptionId" defaultValue="">
            <option value="">Компонент не привязан</option>
            {buildOptions.map((option) => (
              <option value={option.id} key={option.id}>{option.name}</option>
            ))}
          </select>
          <input name="sortOrder" type="number" defaultValue={100} />
          <input name="sourceNote" placeholder="Служебная заметка" />
          <textarea name="buildDescription" placeholder="Сборка готового велосипеда" />
          <label className="admin-check">
            <input name="isPublished" type="checkbox" defaultChecked /> Показывать на сайте
          </label>
          <button className="button button--dark" type="submit">
            Добавить
          </button>
        </form>
      </section>

      <section className="admin-stack">
        {items.map((item) => (
          <article className="admin-panel" key={item.id}>
            <div className="admin-panel__head">
              <div>
                <h2>{item.displayModel ?? item.model.name}</h2>
                <p>{item.itemType} / {item.displayColor ?? item.color?.name ?? "цвет не указан"} / {price(item.price)} ₽</p>
              </div>
              <form action={deleteInventoryItemAction}>
                <input name="id" type="hidden" value={item.id} />
                <button className="admin-danger" type="submit">Удалить</button>
              </form>
            </div>
            <form className="admin-form-grid" action={updateInventoryItemAction}>
              <input name="id" type="hidden" value={item.id} />
              <select name="itemType" defaultValue={item.itemType}>
                {itemTypes.map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
              <select name="modelId" required defaultValue={item.modelId}>
                {models.map((model) => (
                  <option value={model.id} key={model.id}>{model.name}</option>
                ))}
              </select>
              <select name="colorId" defaultValue={item.colorId ?? ""}>
                <option value="">Цвет из каталога</option>
                {colors.map((color) => (
                  <option value={color.id} key={color.id}>{color.name}</option>
                ))}
              </select>
              <select name="sizeId" defaultValue={item.sizeId ?? ""}>
                <option value="">Размер из каталога</option>
                {sizes.map((size) => (
                  <option value={size.id} key={size.id}>{size.label}</option>
                ))}
              </select>
              <input name="displayModel" defaultValue={item.displayModel ?? ""} placeholder="Модель для таблицы" />
              <input name="displayColor" defaultValue={item.displayColor ?? ""} placeholder="Цвет для таблицы" />
              <input name="displaySize" defaultValue={item.displaySize ?? ""} placeholder="Размер для таблицы" />
              <input name="cockpit" defaultValue={item.cockpit ?? ""} placeholder="Руль" />
              <input name="price" type="number" min="0" defaultValue={item.price} />
              <input name="quantity" type="number" min="0" defaultValue={item.quantity ?? ""} placeholder="Кол-во" />
              <select name="status" defaultValue={item.status}>
                {statuses.map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
              <select name="buildOptionId" defaultValue={item.buildOptionId ?? ""}>
                <option value="">Компонент не привязан</option>
                {buildOptions.map((option) => (
                  <option value={option.id} key={option.id}>{option.name}</option>
                ))}
              </select>
              <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
              <input name="sourceNote" defaultValue={item.sourceNote ?? ""} placeholder="Служебная заметка" />
              <textarea name="buildDescription" defaultValue={item.buildDescription ?? ""} placeholder="Сборка готового велосипеда" />
              <label className="admin-check">
                <input name="isPublished" type="checkbox" defaultChecked={item.isPublished} /> Показывать на сайте
              </label>
              <button className="button button--dark" type="submit">Сохранить</button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
