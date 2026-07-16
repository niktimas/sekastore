import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHeroColor } from "@/lib/catalog";
import { getPublicBikeModels } from "@/lib/public-catalog";
import { doneBikeGallery } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const bikeModels = await getPublicBikeModels();

  return (
    <div className="site-shell home-shell">
      <Header />
      <main>
        <section className="hero">
          <div className="hero__image">
            <Image src="/media/background/spear-rdc-studio.jpg" alt="Студийный велосипед SEKA Spear RDC" fill priority sizes="100vw" />
          </div>
          <div className="hero__content">
            <h1>Фреймсеты SEKA в России</h1>
            <p className="hero__copy">
              Подберем Spear, Exceed или Exaero GR, проверим наличие и соберем велосипед под ваш рост, задачи и бюджет.
              Carbonara Bike помогает пройти путь от выбора рамы до готовой сборки без лишних догадок.
            </p>
            <div className="hero__actions">
              <Link className="button" href="/models">
                Каталог моделей <ArrowRight size={18} />
              </Link>
              <Link className="button button--ghost" href="/inventory">
                Проверить наличие
              </Link>
            </div>
          </div>
        </section>

        <section className="section" id="models">
          <div className="line-links" aria-label="Линейки SEKA">
            <Link href="#spear-rdc">SEKA SPEAR RDC</Link>
            <Link href="#spear-standard">SEKA SPEAR Standard</Link>
            <Link href="#exceed-rdc">SEKA EXCEED RDC</Link>
            <Link href="#exceed-standard">SEKA EXCEED Standard</Link>
            <Link href="#exaero-gr">SEKA ExAeroGR</Link>
          </div>
          <div className="section__head section__head--intro">
            <p>
              Пять актуальных фреймсетов: гоночный Spear, универсальный Exceed и быстрый гравийный Exaero GR.
            </p>
          </div>
          <div className="model-list">
            {bikeModels.map((model) => {
              const color = getHeroColor(model);
              return (
                <article className="model-row" id={model.slug} key={model.slug}>
                  <Link className="model-row__media" href={`/models/${model.slug}`} aria-label={model.name}>
                    <Image src={color.image} alt={model.name} fill sizes="(max-width: 900px) 100vw, 680px" />
                  </Link>
                  <div className="model-row__body">
                    <div className="model-row__kicker">
                      {model.category} / {model.version}
                    </div>
                    <h3>{model.name}</h3>
                    <p>{model.tagline}</p>
                    <Link className="button button--dark" href={`/models/${model.slug}`}>
                      Подробнее <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section" id="gallery">
          <div className="section__head">
            <h2>Собранные велосипеды</h2>
            <p>Несколько реальных сборок Carbonara Bike: живые велосипеды, а не только студийные рендеры рам.</p>
          </div>
          <div className="gallery-carousel" aria-label="Галерея собранных велосипедов">
            {doneBikeGallery.map((item, index) => (
              <div className="gallery-item" key={item.src}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 900px) 86vw, 900px"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
