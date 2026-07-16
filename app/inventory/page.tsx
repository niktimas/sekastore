import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrderButton } from "@/components/order-button";
import { getHeroColor, getModelBySlug } from "@/lib/catalog";
import { formatPrice, frames, readyBikes, type InventoryRow } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Наличие",
  description: "Готовые велосипеды и фреймсеты SEKA в наличии."
};

export const dynamic = "force-dynamic";

type InventoryTableRow = InventoryRow & {
  image?: string;
  imageAlt?: string;
};

function withInventoryImage(item: InventoryRow): InventoryTableRow {
  const model = getModelBySlug(item.modelSlug);

  if (!model) {
    return item;
  }

  const color = item.colorSlug
    ? model.colors.find((entry) => entry.slug === item.colorSlug)
    : model.colors.find((entry) => entry.name.toLowerCase() === item.color.toLowerCase());
  const imageColor = color ?? getHeroColor(model);

  return {
    ...item,
    image: imageColor.image,
    imageAlt: `${item.model}, цвет ${imageColor.name}`
  };
}

function InventoryTable({ items }: { items: InventoryTableRow[] }) {
  return (
    <div className="inventory-table-wrap">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Модель</th>
            <th>Цвет</th>
            <th>Размер</th>
            <th>Руль</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.model}-${item.color}-${item.size}-${item.cockpit}-${index}`}>
              <td>
                <details className="inventory-disclosure">
                  <summary>
                    <strong>{item.model}</strong>
                    <span>Подробнее</span>
                  </summary>
                  <div className="inventory-disclosure__body">
                    {item.image ? (
                      <div className="inventory-disclosure__media">
                        <Image src={item.image} alt={item.imageAlt ?? item.model} fill sizes="(max-width: 900px) 78vw, 260px" />
                      </div>
                    ) : null}
                    <div className="inventory-disclosure__copy">
                      <p>{item.build ?? `Фреймсет ${item.model}: ${item.color}, размер ${item.size}, руль ${item.cockpit}.`}</p>
                      <OrderButton
                        className="button button--dark inventory-row-cta"
                        title={item.model}
                        details={`${item.color}, размер ${item.size}, руль ${item.cockpit}${item.build ? `. ${item.build}` : ""}`}
                        status="В наличии"
                        price={formatPrice(item.price)}
                        actionLabel="Заказать из наличия"
                      />
                    </div>
                  </div>
                </details>
              </td>
              <td>{item.color}</td>
              <td>{item.size}</td>
              <td>{item.cockpit}</td>
              <td>{formatPrice(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function getInventory() {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: {
        isPublished: true,
        status: "in_stock"
      },
      orderBy: [{ itemType: "asc" }, { sortOrder: "asc" }],
      include: { model: true, color: true }
    });

    if (!items.length) {
      return { ready: readyBikes.map(withInventoryImage), frameItems: frames.map(withInventoryImage) };
    }

    const mapped = items.map((item) => ({
      model: item.displayModel ?? item.model.name,
      modelSlug: item.model.slug,
      color: item.displayColor ?? item.color?.name ?? "",
      colorSlug: item.color?.slug,
      size: item.displaySize ?? "",
      cockpit: item.cockpit ?? "",
      price: item.price,
      build: item.buildDescription ?? undefined
    }));

    return {
      ready: mapped.filter((item, index) => items[index].itemType === "ready_bike").map(withInventoryImage),
      frameItems: mapped.filter((item, index) => items[index].itemType === "frame").map(withInventoryImage)
    };
  } catch {
    return { ready: readyBikes.map(withInventoryImage), frameItems: frames.map(withInventoryImage) };
  }
}

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="page-title">
          <h1>Наличие</h1>
        </section>

        <section className="section section--tight inventory-section">
          <div className="section__head">
            <h2>Готовые велосипеды</h2>
          </div>
          <InventoryTable items={inventory.ready} />

          <div className="section__head inventory-subhead">
            <h2>Фреймы</h2>
          </div>
          <InventoryTable items={inventory.frameItems} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
