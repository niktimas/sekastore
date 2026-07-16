import { PrismaClient } from "@prisma/client";
import { bikeModels } from "../lib/catalog";
import { buildOptions, frames, readyBikes } from "../lib/inventory";
import wheelsImport from "../data/carbonara-premium-wheels.json";

const prisma = new PrismaClient();

function lineDescription(line: string) {
  if (line === "Spear") {
    return "Гоночная аэродинамическая линейка SEKA.";
  }

  if (line === "Exceed") {
    return "Шоссейная endurance-race линейка SEKA.";
  }

  return "Гравийная линейка SEKA.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function ridingStyleForWheel(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("gravel") || lower.includes("гравий")) {
    return "gravel";
  }

  return "all";
}

async function main() {
  for (const lineName of [...new Set(bikeModels.map((model) => model.line))]) {
    await prisma.productLine.upsert({
      where: { slug: lineName.toLowerCase() },
      create: {
        slug: lineName.toLowerCase(),
        name: lineName,
        description: lineDescription(lineName)
      },
      update: {
        name: lineName,
        description: lineDescription(lineName)
      }
    });
  }

  for (const [modelIndex, item] of bikeModels.entries()) {
    const line = await prisma.productLine.findUniqueOrThrow({
      where: { slug: item.line.toLowerCase() }
    });

    const model = await prisma.model.upsert({
      where: { slug: item.slug },
      create: {
        lineId: line.id,
        slug: item.slug,
        name: item.name,
        version: item.version,
        category: item.category,
        shortDescription: item.tagline,
        description: item.description,
        sortOrder: modelIndex + 1,
        isPublished: true
      },
      update: {
        lineId: line.id,
        name: item.name,
        version: item.version,
        category: item.category,
        shortDescription: item.tagline,
        description: item.description,
        sortOrder: modelIndex + 1,
        isPublished: true
      }
    });

    await prisma.modelSpec.deleteMany({ where: { modelId: model.id } });
    await prisma.mediaAsset.deleteMany({ where: { modelId: model.id } });

    await prisma.modelSpec.createMany({
      data: item.specs.map((spec, index) => ({
        modelId: model.id,
        label: spec.label,
        value: spec.value,
        sortOrder: index + 1
      }))
    });

    for (const [sizeIndex, size] of item.sizes.entries()) {
      await prisma.size.upsert({
        where: {
          modelId_label: {
            modelId: model.id,
            label: size
          }
        },
        create: {
          modelId: model.id,
          label: size,
          sortOrder: sizeIndex + 1
        },
        update: {
          sortOrder: sizeIndex + 1
        }
      });
    }

    for (const [colorIndex, color] of item.colors.entries()) {
      const dbColor = await prisma.color.upsert({
        where: {
          modelId_slug: {
            modelId: model.id,
            slug: color.slug
          }
        },
        create: {
          modelId: model.id,
          slug: color.slug,
          name: color.name,
          swatchHex: color.swatch,
          sourceFilename: color.sourceFilename,
          sortOrder: colorIndex + 1
        },
        update: {
          name: color.name,
          swatchHex: color.swatch,
          sourceFilename: color.sourceFilename,
          sortOrder: colorIndex + 1
        }
      });

      await prisma.mediaAsset.create({
        data: {
          modelId: model.id,
          colorId: dbColor.id,
          kind: "color",
          path: color.image,
          alt: `${item.name}, цвет ${color.name}`,
          sortOrder: colorIndex + 1
        }
      });
    }
  }

  for (const [index, option] of buildOptions.entries()) {
    await prisma.buildOption.upsert({
      where: { slug: slugify(option.name) },
      create: {
        slug: slugify(option.name),
        brand: option.brand,
        name: option.name,
        optionType: option.type,
        price: option.price,
        description: option.description,
        imagePath: option.imagePath,
        source: option.source,
        isPreorder: option.isPreorder ?? false,
        availability: option.availability ?? (option.isPreorder ? "preorder" : "order"),
        ridingStyle: option.ridingStyle ?? "road",
        sortOrder: index + 1,
        isActive: true
      },
      update: {
        brand: option.brand,
        name: option.name,
        optionType: option.type,
        price: option.price,
        description: option.description,
        imagePath: option.imagePath,
        source: option.source,
        isPreorder: option.isPreorder ?? false,
        availability: option.availability ?? (option.isPreorder ? "preorder" : "order"),
        ridingStyle: option.ridingStyle ?? "road",
        sortOrder: index + 1,
        isActive: true
      }
    });
  }

  for (const [index, wheel] of wheelsImport.products.entries()) {
    await prisma.buildOption.upsert({
      where: { slug: wheel.slug },
      create: {
        slug: wheel.slug,
        brand: wheel.brand,
        name: wheel.name,
        optionType: "wheels",
        price: wheel.priceRub,
        description: wheel.description,
        imagePath: wheel.localImagePath,
        source: "carbonara-premium.ru",
        isPreorder: wheel.status === "preorder",
        availability: wheel.status,
        ridingStyle: ridingStyleForWheel(wheel.name),
        sortOrder: 1000 + index + 1,
        isActive: true
      },
      update: {
        brand: wheel.brand,
        name: wheel.name,
        optionType: "wheels",
        price: wheel.priceRub,
        description: wheel.description,
        imagePath: wheel.localImagePath,
        source: "carbonara-premium.ru",
        isPreorder: wheel.status === "preorder",
        availability: wheel.status,
        ridingStyle: ridingStyleForWheel(wheel.name),
        sortOrder: 1000 + index + 1,
        isActive: true
      }
    });
  }

  await prisma.buildOption.updateMany({
    where: { optionType: "reference" },
    data: { isActive: false }
  });

  await prisma.inventoryItem.deleteMany({
    where: {
      sourceNote: "seed:inventory"
    }
  });

  for (const [index, item] of [...readyBikes, ...frames].entries()) {
    const model = await prisma.model.findUnique({
      where: { slug: item.modelSlug },
      include: { colors: true, sizes: true }
    });

    if (!model) {
      continue;
    }

    const color = item.colorSlug ? model.colors.find((entry) => entry.slug === item.colorSlug) : undefined;
    const size = model.sizes.find((entry) => entry.label === item.size);

    await prisma.inventoryItem.create({
      data: {
        modelId: model.id,
        colorId: color?.id,
        sizeId: size?.id,
        itemType: item.build ? "ready_bike" : "frame",
        displayModel: item.model,
        displayColor: item.color,
        displaySize: item.size,
        cockpit: item.cockpit,
        price: item.price,
        buildDescription: item.build,
        quantity: 1,
        status: "in_stock",
        isPublished: true,
        sortOrder: index + 1,
        sourceNote: "seed:inventory"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
