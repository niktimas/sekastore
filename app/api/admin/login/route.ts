import { NextResponse } from "next/server";
import { z } from "zod";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success || !verifyAdminCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ message: "Неверный email или пароль" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
