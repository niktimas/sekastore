import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderSchema = z
  .object({
    itemTitle: z.string().min(1),
    itemDetails: z.string().trim().optional(),
    itemStatus: z.string().trim().optional(),
    itemPrice: z.string().trim().optional(),
    name: z.string().min(2, "Укажите имя"),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
    message: z.string().trim().optional()
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Укажите телефон или email"
  });

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Проверьте данные" }, { status: 400 });
  }

  const details = [
    `Товар: ${parsed.data.itemTitle}`,
    parsed.data.itemStatus ? `Статус: ${parsed.data.itemStatus}` : null,
    parsed.data.itemPrice ? `Цена: ${parsed.data.itemPrice}` : null,
    parsed.data.itemDetails ? `Детали: ${parsed.data.itemDetails}` : null,
    parsed.data.message ? `Комментарий: ${parsed.data.message}` : null
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.lead.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      message: details,
      status: "new"
    }
  });

  return NextResponse.json({ ok: true });
}
