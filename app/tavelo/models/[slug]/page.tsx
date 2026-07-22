import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, getTaveloHeroColor, getTaveloModelBySlug, taveloModels } from "@/lib/tavelo-catalog";

type TaveloModelPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return taveloModels.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: TaveloModelPageProps) {
  const { slug } = await params;
  const model = getTaveloModelBySlug(slug);

  return {
    title: model ? model.name : "Tavelo",
    description: model?.tagline ?? "Фреймсеты Tavelo в России.",
    openGraph: {
      title: model ? model.name : "Tavelo",
      description: model?.tagline ?? "Фреймсеты Tavelo в России.",
      url: model ? `https://tavelo.ru/models/${model.slug}` : "https://tavelo.ru",
      siteName: "TAVELO Russia",
      locale: "ru_RU",
      type: "website"
    }
  };
}

export default async function TaveloModelPage({ params }: TaveloModelPageProps) {
  const { slug } = await params;
  const model = getTaveloModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const heroColor = getTaveloHeroColor(model);

  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main>
        <section className="tavelo-model">
          <Link className="tavelo-back" href="/">
            <ArrowLeft size={17} /> All products
          </Link>
          <div className="tavelo-model__media">
            <Image src={heroColor.image} alt={model.name} fill priority sizes="(max-width: 900px) 100vw, 54vw" />
          </div>
          <div className="tavelo-model__body">
            <p className="tavelo-kicker">{model.category}</p>
            <h1>{model.name}</h1>
            <p>{model.description}</p>
            <strong className="tavelo-price">{formatTaveloPrice(model.price)}</strong>
            <div className="tavelo-specs">
              {model.specs.map((spec) => (
                <div key={spec.label}>
                  <span>{spec.label}</span>
                  <b>{spec.value}</b>
                </div>
              ))}
            </div>
            <OrderButton
              className="tavelo-button"
              title={model.name}
              details={`${heroColor.name} / SKU ${heroColor.sku}`}
              status="Tavelo"
              price={formatTaveloPrice(model.price)}
              actionLabel="Заказать фреймсет"
            />
          </div>
        </section>

        <section className="tavelo-section">
          <div className="tavelo-section__head">
            <p className="tavelo-kicker">SKU / colors</p>
            <h2>Доступные варианты</h2>
          </div>
          <div className="tavelo-color-grid">
            {model.colors.map((color) => (
              <article className="tavelo-color" key={color.slug}>
                <div className="tavelo-color__image">
                  <Image src={color.image} alt={`${model.name} ${color.name}`} fill sizes="(max-width: 900px) 100vw, 32vw" />
                </div>
                <div>
                  <span style={{ backgroundColor: color.swatch }} />
                  <h3>{color.name}</h3>
                  <p>SKU: {color.sku}</p>
                  <OrderButton
                    className="tavelo-link-button"
                    title={model.name}
                    details={`${color.name} / SKU ${color.sku}`}
                    status="Tavelo"
                    price={formatTaveloPrice(model.price)}
                    actionLabel="Заказать этот цвет"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <TaveloFooter />
    </div>
  );
}
