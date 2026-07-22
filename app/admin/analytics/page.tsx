import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { adminBrands, resolveAdminBrand } from "@/lib/admin-brand";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Метрики"
};

type CountRow = {
  count: bigint;
};

type TopPathRow = {
  path: string;
  views: bigint;
  sessions: bigint;
};

type EventRow = {
  event_type: string;
  count: bigint;
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<{ brand?: string }>;
};

function formatCount(value: bigint | number) {
  return Number(value).toLocaleString("ru-RU");
}

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const brand = await resolveAdminBrand(await searchParams);
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);
  const taveloMode = brand === "tavelo";

  const brandSql = taveloMode
    ? prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `
    : prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `;

  const sessionsSql = taveloMode
    ? prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(DISTINCT session_hash)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `
    : prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(DISTINCT session_hash)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `;

  const ctaSql = taveloMode
    ? prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND event_type = 'cta_click'
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `
    : prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND event_type = 'cta_click'
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `;

  const formsSql = taveloMode
    ? prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND event_type = 'form_submit'
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `
    : prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND event_type = 'form_submit'
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
      `;

  const topPathsSql = taveloMode
    ? prisma.$queryRaw<TopPathRow[]>`
        SELECT path, COUNT(*)::bigint AS views, COUNT(DISTINCT session_hash)::bigint AS sessions
        FROM analytics_events
        WHERE event_type = 'page_view'
          AND created_at >= ${since}
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
        GROUP BY path
        ORDER BY views DESC
        LIMIT 12
      `
    : prisma.$queryRaw<TopPathRow[]>`
        SELECT path, COUNT(*)::bigint AS views, COUNT(DISTINCT session_hash)::bigint AS sessions
        FROM analytics_events
        WHERE event_type = 'page_view'
          AND created_at >= ${since}
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
        GROUP BY path
        ORDER BY views DESC
        LIMIT 12
      `;

  const eventsSql = taveloMode
    ? prisma.$queryRaw<EventRow[]>`
        SELECT event_type, COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
        GROUP BY event_type
        ORDER BY count DESC
      `
    : prisma.$queryRaw<EventRow[]>`
        SELECT event_type, COUNT(*)::bigint AS count
        FROM analytics_events
        WHERE created_at >= ${since}
          AND NOT (path LIKE '/tavelo%' OR COALESCE(target, '') ILIKE '%Tavelo%' OR COALESCE(metadata->>'brand', '') = 'tavelo' OR COALESCE(metadata->>'host', '') ILIKE '%tavelo.ru%')
        GROUP BY event_type
        ORDER BY count DESC
      `;

  const [pageViews, sessions, ctaClicks, formSubmits, topPaths, eventSummary] = await Promise.all([
    brandSql,
    sessionsSql,
    ctaSql,
    formsSql,
    topPathsSql,
    eventsSql
  ]);

  return (
    <main className="admin-page">
      <AdminNav brand={brand} />
      <section className="page-title">
        <p className="eyebrow">Метрики / {adminBrands[brand].label}</p>
        <h1>Поведение пользователей</h1>
        <p>Легкая аналитика за последние 14 дней. Новые события дополнительно сохраняют домен и бренд сайта.</p>
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <span>Просмотры</span>
          <strong>{formatCount(pageViews[0]?.count ?? 0)}</strong>
          <small>открытия страниц</small>
        </div>
        <div className="admin-card">
          <span>Сессии</span>
          <strong>{formatCount(sessions[0]?.count ?? 0)}</strong>
          <small>уникальные посещения</small>
        </div>
        <div className="admin-card">
          <span>Клики</span>
          <strong>{formatCount(ctaClicks[0]?.count ?? 0)}</strong>
          <small>кнопки и карточки</small>
        </div>
        <div className="admin-card">
          <span>Формы</span>
          <strong>{formatCount(formSubmits[0]?.count ?? 0)}</strong>
          <small>успешные отправки</small>
        </div>
      </section>

      <section className="admin-panel">
        <h2>Популярные страницы</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Страница</th>
                <th>Просмотры</th>
                <th>Сессии</th>
              </tr>
            </thead>
            <tbody>
              {topPaths.map((row) => (
                <tr key={row.path}>
                  <td>{row.path}</td>
                  <td>{formatCount(row.views)}</td>
                  <td>{formatCount(row.sessions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <h2>События</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {eventSummary.map((row) => (
                <tr key={row.event_type}>
                  <td>{row.event_type}</td>
                  <td>{formatCount(row.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
