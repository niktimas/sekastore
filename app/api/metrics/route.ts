import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, getUserAgent, hashForAnalytics, isBlockedBotUserAgent } from "@/lib/request-security";

const analyticsEventSchema = z.object({
  type: z.enum(["page_view", "scroll_depth", "cta_click", "form_open", "form_submit"]),
  path: z.string().min(1).max(300),
  target: z.string().trim().max(180).optional(),
  referrer: z.string().trim().max(300).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional()
});

const payloadSchema = z.object({
  sessionId: z.string().min(8).max(80),
  events: z.array(analyticsEventSchema).min(1).max(20)
});

export async function POST(request: Request) {
  const userAgent = getUserAgent(request);

  if (!userAgent || isBlockedBotUserAgent(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const json = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid metrics payload" }, { status: 400 });
  }

  const sessionHash = hashForAnalytics(parsed.data.sessionId);
  const ipHash = hashForAnalytics(getClientIp(request));
  const userAgentHash = hashForAnalytics(userAgent);

  if (!sessionHash) {
    return NextResponse.json({ message: "Invalid metrics session" }, { status: 400 });
  }

  await prisma.analyticsEvent.createMany({
    data: parsed.data.events.map((event) => ({
      sessionHash,
      eventType: event.type,
      path: event.path,
      target: event.target || null,
      referrer: event.referrer || null,
      metadata: event.metadata ?? undefined,
      ipHash,
      userAgentHash
    }))
  });

  if (Math.random() < 0.01) {
    const retentionDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);
    await prisma.analyticsEvent.deleteMany({ where: { createdAt: { lt: retentionDate } } });
  }

  return NextResponse.json({ ok: true });
}
