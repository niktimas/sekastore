import crypto from "node:crypto";

const BOT_USER_AGENT_PATTERN =
  /(gptbot|chatgpt-user|ccbot|anthropic-ai|claudebot|perplexitybot|bytespider|amazonbot|applebot-extended|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|scrapy|python-requests|curl|wget|httpclient|headlesschrome)/i;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

export function getUserAgent(request: Request) {
  return request.headers.get("user-agent")?.trim() || "";
}

export function isBlockedBotUserAgent(userAgent: string) {
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}

export function hashForAnalytics(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_SESSION_SECRET || "seka-bike";
  return crypto.createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function validateHumanForm(data: { website?: string | null; formStartedAt?: string | number | null }) {
  if (data.website?.trim()) {
    return "Заявка не прошла антиспам-проверку.";
  }

  const startedAt = Number(data.formStartedAt);
  if (!Number.isFinite(startedAt)) {
    return "Обновите страницу и отправьте форму еще раз.";
  }

  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs < 1200 || elapsedMs > 1000 * 60 * 60 * 12) {
    return "Обновите страницу и отправьте форму еще раз.";
  }

  return null;
}
