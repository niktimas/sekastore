import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, getTaveloHeroColor, taveloCockpit, taveloModels } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "TAVELO Russia",
  description: "Фреймсеты Tavelo в России: AROW Race, AROW SL, Arden, GROW и WILD.",
  openGraph: {
    title: "TAVELO Russia",
    description: "Фреймсеты Tavelo в России: AROW Race, AROW SL, Arden, GROW и WILD.",
    url: "https://tavelo.ru",
    siteName: "TAVELO Russia",
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
            <p className="tavelo-kicker">Carbonara Bike · Tavelo Russia</p>
            <h1>TAVELO</h1>
            <p>
              Аэродинамические шоссейные и гравийные фреймсеты Tavelo в России. Подбор размера, проверка SKU,
              комплектация сборки и доставка по РФ.
            </p>
            <div className="tavelo-actions">
              <Link className="tavelo-button" href="#models">
                Bikes <ArrowRight size={18} />
              </Link>
              <OrderButton
                className="tavelo-button tavelo-button--ghost"
                title="TAVELO frameset"
                details="Подбор модели, цвета и размера Tavelo"
                status="Заявка"
                actionLabel="Подобрать Tavelo"
              />
            </div>
          </div>
          <div className="tavelo-hero__media">
            <Image src={heroColor.image} alt={heroModel.name} fill priority sizes="(max-width: 900px) 100vw, 62vw" />
          </div>
        </section>

        <section className="tavelo-section tavelo-runner" aria-label="Tavelo lines">
          <span>AROW Race</span>
          <span>AROW SL</span>
          <span>Arden</span>
          <span>GROW</span>
          <span>WILD</span>
        </section>

        <section className="tavelo-section" id="models">
          <div className="tavelo-section__head">
            <p className="tavelo-kicker">All framesets</p>
            <h2>Road aero, light road and gravel platforms</h2>
          </div>
          <div className="tavelo-grid">
            {taveloModels.map((model) => {
              const color = getTaveloHeroColor(model);
              return (
                <article className="tavelo-product" key={model.slug}>
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
            <p className="tavelo-kicker">Cockpit</p>
            <h2>{taveloCockpit.name}</h2>
            <p>{taveloCockpit.description}</p>
            <strong>{formatTaveloPrice(taveloCockpit.price)}</strong>
          </div>
          <div className="tavelo-feature__image">
            <Image src={taveloCockpit.image} alt={taveloCockpit.name} fill sizes="(max-width: 900px) 100vw, 46vw" />
          </div>
        </section>

        <section className="tavelo-cta">
          <p className="tavelo-kicker">Order in Russia</p>
          <h2>Соберем Tavelo под задачу, рост и бюджет.</h2>
          <OrderButton
            className="tavelo-button"
            title="TAVELO frameset"
            details="Подбор фреймсета Tavelo и комплектации"
            status="Заявка"
            actionLabel="Оставить заявку"
          />
        </section>
      </main>
      <TaveloFooter />
    </div>
  );
}
