import { bikeModels, getModelBySlug, type BikeModel } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

type DbModelOverlay = {
  slug: string;
  name: string;
  version: string | null;
  category: string;
  shortDescription: string | null;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
  specs: Array<{ label: string; value: string }>;
  sizes: Array<{ label: string }>;
};

function overlayModel(base: BikeModel, dbModel: DbModelOverlay | null | undefined): BikeModel {
  if (!dbModel) {
    return base;
  }

  return {
    ...base,
    name: dbModel.name,
    version: (dbModel.version ?? base.version) as BikeModel["version"],
    category: dbModel.category as BikeModel["category"],
    tagline: dbModel.shortDescription ?? base.tagline,
    description: dbModel.description ?? base.description,
    sizes: dbModel.sizes.length > 0 ? dbModel.sizes.map((size) => size.label) : base.sizes,
    specs: dbModel.specs.length > 0 ? dbModel.specs.map((spec) => ({ label: spec.label, value: spec.value })) : base.specs
  };
}

async function getDbModels() {
  return prisma.model.findMany({
    include: {
      specs: { orderBy: { sortOrder: "asc" } },
      sizes: { orderBy: { sortOrder: "asc" } }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getPublicBikeModels() {
  try {
    const dbModels = await getDbModels();
    const dbBySlug = new Map(dbModels.map((model) => [model.slug, model]));
    const sortBySlug = new Map(dbModels.map((model) => [model.slug, model.sortOrder]));

    return bikeModels
      .flatMap((baseModel) => {
        const dbModel = dbBySlug.get(baseModel.slug);
        if (dbModel && !dbModel.isPublished) {
          return [];
        }

        return [overlayModel(baseModel, dbModel)];
      })
      .sort((left, right) => (sortBySlug.get(left.slug) ?? 1000) - (sortBySlug.get(right.slug) ?? 1000));
  } catch (error) {
    console.error(error);
    return bikeModels;
  }
}

export async function getPublicBikeModelBySlug(slug: string) {
  const baseModel = getModelBySlug(slug);

  if (!baseModel) {
    return null;
  }

  try {
    const dbModel = await prisma.model.findUnique({
      where: { slug },
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        sizes: { orderBy: { sortOrder: "asc" } }
      }
    });

    if (dbModel && !dbModel.isPublished) {
      return null;
    }

    return overlayModel(baseModel, dbModel);
  } catch (error) {
    console.error(error);
    return baseModel;
  }
}
