import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHeroColor } from "@/lib/catalog";
import { getPublicBikeModels } from "@/lib/public-catalog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Каталог моделей",
  description: "Каталог SEKA Spear, Exceed и Exaero GR у официального дистрибьютора в России."
};

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const bikeModels = await getPublicBikeModels();

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="page-title">
          <p className="eyebrow">Каталог</p>
          <h1>Фреймсеты SEKA</h1>
          <p>Все модели и цвета заведены из локальных материалов. Остатки будут подключены после оцифровки таблицы наличия.</p>
        </section>

        <section className="model-grid" aria-label="Список моделей SEKA">
          {bikeModels.map((model) => {
            const color = getHeroColor(model);
            return (
              <article className="model-card" key={model.slug}>
                <Link className="model-card__media" href={`/models/${model.slug}`}>
                  <Image src={color.image} alt={model.name} fill sizes="(max-width: 900px) 100vw, 560px" />
                </Link>
                <div className="model-row__kicker">
                  {model.category} / {model.version}
                </div>
                <h2>{model.name}</h2>
                <p>{model.tagline}</p>
                <div className="swatches">
                  {model.colors.map((item) => (
                    <span
                      className="swatch"
                      key={item.slug}
                      style={{ "--swatch": item.swatch } as React.CSSProperties}
                    />
                  ))}
                </div>
                <Link className="button button--dark" href={`/models/${model.slug}`}>
                  Подробнее <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}
