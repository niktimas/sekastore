import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { adminBrands, adminHref, type AdminBrand } from "@/lib/admin-brand";

const links = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/inventory", label: "Наличие" },
  { href: "/admin/build-options", label: "Компоненты" },
  { href: "/admin/models", label: "Модели" },
  { href: "/admin/analytics", label: "Метрики" }
];

type AdminNavProps = {
  brand?: AdminBrand;
};

export function AdminNav({ brand = "seka" }: AdminNavProps) {
  return (
    <nav className="admin-nav" aria-label="Навигация админки">
      <div className="admin-nav__brand-switch" aria-label="Выбор сайта">
        {(Object.keys(adminBrands) as AdminBrand[]).map((item) => (
          <Link className={item === brand ? "is-active" : ""} href={adminHref("/admin", item)} key={item}>
            {adminBrands[item].label}
          </Link>
        ))}
      </div>
      <div className="admin-nav__links">
        {links.map((link) => (
          <Link key={link.href} href={adminHref(link.href, brand)}>
            {link.label}
          </Link>
        ))}
      </div>
      <form action={logoutAction}>
        <button className="button button--ghost" type="submit">
          Выйти
        </button>
      </form>
    </nav>
  );
}
