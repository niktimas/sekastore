import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, getTaveloHeroColor, taveloCockpit, taveloModels } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "Tavelo в России | Carbonara Bike",
  description: "Фреймсеты Tavelo в России: AROW Race, AROW SL, Arden, GROW и WILD. Подбор размера, цвета, компонентов и доставка.",
  openGraph: {
    title: "Tavelo в России | Carbonara Bike",
    description: "Фреймсеты Tavelo в России: шоссе, выносливость и гравийные платформы под кастомную сборку.",
    url: "https://tavelo.ru",
    siteName: "Tavelo Carbonara Bike",
    locale: "ru_RU",
    type: "website"
  }
};

export default function TaveloHomePage() {
  const heroModel = taveloModels[0];
  const heroColor = getTaveloHeroColor(heroModel);

  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main>
        <section className="tavelo-hero">
          <div className="tavelo-hero__copy">
            <p className="tavelo-kicker">Tavelo в Carbonara Bike</p>
            <h1>Фреймсеты Tavelo для кастомной сборки</h1>
            <p>
              Подберем модель, цвет, размер и комплектующие под вашу посадку и задачи. Работаем по России и ближайшему СНГ,
              доставляем СДЭК/ПЭК, перед заказом проверяем актуальное наличие и сроки поставки.
            </p>
            <div className="tavelo-actions">
              <Link className="tavelo-button" href="#models">
                Каталог моделей <ArrowRight size={18} />
              </Link>
              <OrderButton
                className="tavelo-button tavelo-button--ghost"
                title="Tavelo"
                details="Подбор фреймсета Tavelo, цвета, размера и комплектации"
                status="Заявка с Tavelo"
                actionLabel="Получить консультацию"
              />
            </div>
          </div>
          <div className="tavelo-hero__media">
            <Image src={heroColor.image} alt={heroModel.name} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          </div>
        </section>

        <section className="tavelo-runner" aria-label="Модельный ряд Tavelo">
          {taveloModels.map((model) => (
            <Link key={model.slug} href={`#${model.slug}`}>
              {model.family}
            </Link>
          ))}
        </section>

        <section className="tavelo-section" id="models">
          <div className="tavelo-section__head">
            <p className="tavelo-kicker">Каталог</p>
            <h2>Шоссейные и гравийные фреймсеты Tavelo</h2>
            <p>Выберите платформу, откройте модель и оставьте заявку на нужный цвет или сборку.</p>
          </div>
          <div className="tavelo-grid">
            {taveloModels.map((model) => {
              const color = getTaveloHeroColor(model);
              return (
                <article className="tavelo-product" id={model.slug} key={model.slug}>
                  <Link className="tavelo-product__image" href={`/models/${model.slug}`}>
                    <Image src={color.image} alt={model.name} fill sizes="(max-width: 900px) 100vw, 33vw" />
                  </Link>
                  <div className="tavelo-product__meta">
                    <span>{model.category}</span>
                    <strong>{model.name}</strong>
                    <p>{model.tagline}</p>
                    <div>
                      <b>{formatTaveloPrice(model.price)}</b>
                      <Link href={`/models/${model.slug}`}>
                        Подробнее <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="tavelo-feature">
          <div>
            <p className="tavelo-kicker">Компоненты</p>
            <h2>Кокпит Tavelo для аккуратной интеграции</h2>
            <p>{taveloCockpit.description}</p>
            <strong>{formatTaveloPrice(taveloCockpit.price)}</strong>
            <Link className="tavelo-text-link" href="/build-options">
              Смотреть компоненты <ArrowRight size={16} />
            </Link>
          </div>
          <div className="tavelo-feature__image">
            <Image src={taveloCockpit.image} alt={taveloCockpit.name} fill sizes="(max-width: 900px) 100vw, 46vw" />
          </div>
        </section>

        <section className="tavelo-cta">
          <p className="tavelo-kicker">Заявка</p>
          <h2>Соберем Tavelo под рост, стиль езды и бюджет.</h2>
          <p>Напишите нам, если хотите уточнить наличие, заказать фреймсет или собрать велосипед целиком.</p>
          <OrderButton
            className="tavelo-button"
            title="Tavelo"
            details="Подбор фреймсета Tavelo и комплектации"
            status="Заявка с Tavelo"
            actionLabel="Оставить заявку"
          />
        </section>
      </main>
      <TaveloFooter />
    </div>
  );
}
