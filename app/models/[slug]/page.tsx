import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicBikeModelBySlug } from "@/lib/public-catalog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ModelViewer } from "@/components/model-viewer";
import { LeadForm } from "@/components/lead-form";
import { prisma } from "@/lib/prisma";

type ModelPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getPublicBikeModelBySlug(slug);

  if (!model) {
    return {};
  }

  return {
    title: model.name,
    description: model.tagline,
    openGraph: {
      title: model.name,
      description: model.tagline,
      images: [model.colors[0].image]
    }
  };
}

async function getConfiguratorOptions(modelSlug: string) {
  try {
    const [frameOptions, buildOptions] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: {
          itemType: "frame",
          isPublished: true,
          status: "in_stock",
          model: { slug: modelSlug }
        },
        include: {
          model: true,
          color: true,
          size: true
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
      }),
      prisma.buildOption.findMany({
        where: { isActive: true, applicableBrands: { contains: "seka" } },
        orderBy: [{ optionType: "asc" }, { sortOrder: "asc" }, { name: "asc" }]
      })
    ]);

    const targetStyle = modelSlug === "exaero-gr" ? "gravel" : "road";
    const isCompatible = (option: { ridingStyle: string }) => option.ridingStyle === "all" || option.ridingStyle === targetStyle;

    return {
      frameOptions: frameOptions.map((item) => ({
        model: item.displayModel ?? item.model.name,
        color: item.displayColor ?? item.color?.name ?? "Цвет не указан",
        size: item.displaySize ?? item.size?.label ?? "",
        cockpit: item.cockpit ?? "",
        price: item.price
      })),
      groupsets: buildOptions
        .filter((option) => option.optionType === "groupset")
        .filter(isCompatible)
        .map((option) => ({ brand: option.brand, name: option.name, price: option.price, isPreorder: option.isPreorder, availability: option.availability, ridingStyle: option.ridingStyle })),
      wheels: buildOptions
        .filter((option) => option.optionType === "wheels")
        .filter(isCompatible)
        .map((option) => ({ brand: option.brand, name: option.name, price: option.price, isPreorder: option.isPreorder, availability: option.availability, ridingStyle: option.ridingStyle })),
      handlebars: buildOptions
        .filter((option) => option.optionType === "handlebar")
        .filter(isCompatible)
        .map((option) => ({ brand: option.brand, name: option.name, price: option.price, isPreorder: option.isPreorder, availability: option.availability, ridingStyle: option.ridingStyle }))
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = await getPublicBikeModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const configuratorOptions = await getConfiguratorOptions(model.slug);

  return (
    <div className="site-shell">
      <Header />
      <main className="model-page">
        <section className="model-hero">
          <div className="model-hero__copy">
            <div className="model-page__kicker">
              {model.category} / {model.version}
            </div>
            <h1>{model.name}</h1>
            <p>{model.description}</p>
          </div>
          <ModelViewer model={model} />
        </section>

        <section className="details">
          <div>
            <div className="section__head">
              <h2>Характеристики</h2>
            </div>
            <dl className="spec-list">
              {model.specs.map((spec) => (
                <div className="spec-row" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
              <div className="spec-row">
                <dt>Размеры</dt>
                <dd>{model.sizes.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <aside className="lead-panel">
            <h2>Запросить наличие</h2>
            <p>Остатки по цветам и размерам сейчас переносятся из исходной таблицы. Заявка сохранит интересующую конфигурацию.</p>
            <LeadForm
              model={model}
              frameOptions={configuratorOptions?.frameOptions ?? undefined}
              groupsets={configuratorOptions?.groupsets ?? undefined}
              wheels={configuratorOptions?.wheels ?? undefined}
              handlebars={configuratorOptions?.handlebars ?? undefined}
            />
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
