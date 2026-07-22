import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
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
  eventType: string;
  count: bigint;
};

function formatCount(value: bigint | number) {
  return Number(value).toLocaleString("ru-RU");
}

export default async function AdminAnalyticsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);

  const [pageViews, sessions, ctaClicks, formSubmits, topPaths, eventRows] = await Promise.all([
    prisma.analyticsEvent.count({ where: { eventType: "page_view", createdAt: { gte: since } } }),
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(DISTINCT session_hash)::bigint AS count
      FROM analytics_events
      WHERE created_at >= ${since}
    `,
    prisma.analyticsEvent.count({ where: { eventType: "cta_click", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { eventType: "form_submit", createdAt: { gte: since } } }),
    prisma.$queryRaw<TopPathRow[]>`
      SELECT path, COUNT(*)::bigint AS views, COUNT(DISTINCT session_hash)::bigint AS sessions
      FROM analytics_events
      WHERE event_type = 'page_view'
        AND created_at >= ${since}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 12
    `,
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { eventType: "desc" } }
    })
  ]);

  const eventSummary: EventRow[] = eventRows.map((row) => ({
    eventType: row.eventType,
    count: BigInt(row._count._all)
  }));

  return (
    <main className="admin-page">
      <AdminNav />
      <section className="page-title">
        <p className="eyebrow">Метрики</p>
        <h1>Поведение пользователей</h1>
        <p>Легкая first-party аналитика за последние 14 дней: без внешних пикселей, cookies и тяжелых скриптов.</p>
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <span>Просмотры</span>
          <strong>{formatCount(pageViews)}</strong>
          <small>page_view</small>
        </div>
        <div className="admin-card">
          <span>Сессии</span>
          <strong>{formatCount(sessions[0]?.count ?? 0)}</strong>
          <small>уникальные session hash</small>
        </div>
        <div className="admin-card">
          <span>CTA-клики</span>
          <strong>{formatCount(ctaClicks)}</strong>
          <small>кнопки и карточки</small>
        </div>
        <div className="admin-card">
          <span>Формы</span>
          <strong>{formatCount(formSubmits)}</strong>
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
                <tr key={row.eventType}>
                  <td>{row.eventType}</td>
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
