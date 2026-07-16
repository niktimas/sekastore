import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrderButton } from "@/components/order-button";
import { formatPrice } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Компоненты",
  description: "Системы, кокпиты и колеса для сборок SEKA Carbonara Bike."
};

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
  groupset: "Система",
  handlebar: "Руль / кокпит",
  wheels: "Колеса"
};

const availabilityLabels: Record<string, string> = {
  preorder: "Предзаказ",
  in_stock: "В наличии",
  order: "Под заказ"
};

const ridingStyleLabels: Record<string, string> = {
  road: "Шоссе",
  gravel: "Гравий",
  all: "Шоссе + гравий"
};

function actionLabel(availability: string) {
  return availability === "in_stock" ? "Заказать из наличия" : availability === "preorder" ? "Оформить предзаказ" : "Оставить заявку";
}

async function getBuildOptions() {
  try {
    return await prisma.buildOption.findMany({
      where: {
        isActive: true,
        optionType: { in: ["groupset", "handlebar", "wheels"] }
      },
      orderBy: [{ ridingStyle: "desc" }, { optionType: "asc" }, { sortOrder: "asc" }, { price: "asc" }]
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function BuildOptionsPage() {
  const options = await getBuildOptions();
  const sections = [
    {
      key: "road-groupsets",
      title: "Шоссейные системы",
      items: options.filter((option) => option.optionType === "groupset" && option.ridingStyle === "road")
    },
    {
      key: "gravel-groupsets",
      title: "Гравийные системы",
      items: options.filter((option) => option.optionType === "groupset" && option.ridingStyle === "gravel")
    },
    {
      key: "cockpits",
      title: "Рули и кокпиты",
      items: options.filter((option) => option.optionType === "handlebar")
    },
    {
      key: "road-wheels",
      title: "Шоссейные и универсальные колеса",
      items: options.filter((option) => option.optionType === "wheels" && option.ridingStyle !== "gravel")
    },
    {
      key: "gravel-wheels",
      title: "Гравийные колеса",
      items: options.filter((option) => option.optionType === "wheels" && option.ridingStyle === "gravel")
    }
  ].filter((section) => section.items.length > 0);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="page-title">
          <p className="eyebrow">Компоненты</p>
          <h1>Системы и кокпиты для сборки</h1>
          <p>Позиции под заказ для полной сборки велосипеда на базе фреймсетов SEKA.</p>
        </section>

        <section className="component-catalog" aria-label="Список компонентов">
          {sections.map((section) => (
            <div className="component-section" key={section.key}>
              <div className="section__head">
                <h2>{section.title}</h2>
              </div>
              {section.items.map((option) => (
                <article className="component-row" key={option.id}>
                  <div className="component-row__media">
                    {option.imagePath ? (
                      <Image src={option.imagePath} alt={`${option.brand ? `${option.brand} ` : ""}${option.name}`} fill sizes="(max-width: 900px) 100vw, 420px" />
                    ) : null}
                  </div>
                  <div className="component-row__body">
                    <div className="component-row__meta">
                      <span>{typeLabels[option.optionType] ?? option.optionType}</span>
                      <span>{ridingStyleLabels[option.ridingStyle] ?? option.ridingStyle}</span>
                      {option.availability ? <strong data-status={option.availability}>{availabilityLabels[option.availability] ?? option.availability}</strong> : null}
                    </div>
                    <h2>{option.brand ? `${option.brand} ` : ""}{option.name}</h2>
                    {option.description ? <p>{option.description}</p> : null}
                    <div className="component-row__footer">
                      <span>{formatPrice(option.price)}</span>
                      <OrderButton
                        title={`${option.brand ? `${option.brand} ` : ""}${option.name}`}
                        details={`${typeLabels[option.optionType] ?? option.optionType}, ${ridingStyleLabels[option.ridingStyle] ?? option.ridingStyle}`}
                        status={availabilityLabels[option.availability] ?? option.availability}
                        price={formatPrice(option.price)}
                        actionLabel={actionLabel(option.availability)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
          {options.length === 0 ? <p className="admin-empty">Компоненты пока не добавлены.</p> : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
