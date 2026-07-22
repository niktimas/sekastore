import Image from "next/image";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatPrice } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Компоненты Tavelo | Carbonara Bike",
  description: "Системы, колеса и кокпиты для сборок Tavelo с едиными ценами Carbonara Bike."
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
  if (availability === "in_stock") {
    return "Заказать из наличия";
  }

  return availability === "preorder" ? "Оформить предзаказ" : "Оставить заявку";
}

async function getTaveloOptions() {
  try {
    return await prisma.buildOption.findMany({
      where: {
        isActive: true,
        applicableBrands: { contains: "tavelo" },
        optionType: { in: ["groupset", "handlebar", "wheels"] }
      },
      orderBy: [{ ridingStyle: "desc" }, { optionType: "asc" }, { sortOrder: "asc" }, { price: "asc" }]
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TaveloBuildOptionsPage() {
  const options = await getTaveloOptions();
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
      key: "wheels",
      title: "Колеса",
      items: options.filter((option) => option.optionType === "wheels")
    }
  ].filter((section) => section.items.length > 0);

  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page">
        <p className="tavelo-kicker">Компоненты</p>
        <h1>Системы, колеса и кокпиты для сборки Tavelo</h1>
        <p>
          Это общий склад Carbonara Bike: цены и наличие совпадают с SEKA-витриной, а применимость управляется в админке.
        </p>

        <section className="component-catalog tavelo-component-catalog" aria-label="Компоненты Tavelo">
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
                      <strong data-status={option.availability}>{availabilityLabels[option.availability] ?? option.availability}</strong>
                    </div>
                    <h2>{option.brand ? `${option.brand} ` : ""}{option.name}</h2>
                    {option.description ? <p>{option.description}</p> : null}
                    <div className="component-row__footer">
                      <span>{formatPrice(option.price)}</span>
                      <OrderButton
                        className="tavelo-button"
                        title={`${option.brand ? `${option.brand} ` : ""}${option.name}`}
                        details={`Для сборки Tavelo. ${typeLabels[option.optionType] ?? option.optionType}, ${ridingStyleLabels[option.ridingStyle] ?? option.ridingStyle}`}
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
      <TaveloFooter />
    </div>
  );
}
