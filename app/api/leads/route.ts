import { NextResponse } from "next/server";
import { z } from "zod";
import { bikeModels } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

const leadSchema = z
  .object({
    modelSlug: z.string().min(1),
    colorSlug: z.string().min(1),
    sizeLabel: z.string().min(1),
    name: z.string().min(2, "Укажите имя"),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
    city: z.string().trim().optional(),
    frameOption: z.string().trim().optional(),
    groupsetOption: z.string().trim().optional(),
    handlebarOption: z.string().trim().optional(),
    wheelOption: z.string().trim().optional(),
    message: z.string().trim().optional()
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Укажите телефон или email"
  });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Проверьте данные заявки" },
      { status: 400 }
    );
  }

  const catalogModel = bikeModels.find((model) => model.slug === parsed.data.modelSlug);
  const catalogColor = catalogModel?.colors.find((color) => color.slug === parsed.data.colorSlug);

  if (!catalogModel || !catalogColor) {
    return NextResponse.json({ message: "Модель или цвет не найдены" }, { status: 404 });
  }

  try {
    const model = await prisma.model.findUnique({
      where: { slug: parsed.data.modelSlug },
      include: {
        colors: true,
        sizes: true
      }
    });

    if (!model) {
      return NextResponse.json(
        { message: "Каталог еще не загружен в базу. Запустите seed после настройки PostgreSQL." },
        { status: 503 }
      );
    }

    const color = model.colors.find((item) => item.slug === parsed.data.colorSlug);
    const size = model.sizes.find((item) => item.label === parsed.data.sizeLabel);

    const details = [
      `Интерес: ${catalogModel.name}, ${catalogColor.name}, размер ${parsed.data.sizeLabel}`,
      parsed.data.frameOption ? `Фрейм из наличия: ${parsed.data.frameOption}` : null,
      parsed.data.groupsetOption ? `Система: ${parsed.data.groupsetOption}` : null,
      parsed.data.handlebarOption ? `Руль/кокпит: ${parsed.data.handlebarOption}` : null,
      parsed.data.wheelOption ? `Колеса: ${parsed.data.wheelOption}` : null,
      parsed.data.message ? `Комментарий: ${parsed.data.message}` : null
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.lead.create({
      data: {
        modelId: model.id,
        colorId: color?.id,
        sizeId: size?.id,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        city: parsed.data.city || null,
        message: details
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "База данных пока недоступна. Проверьте DATABASE_URL и миграции." },
      { status: 503 }
    );
  }
}
