import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/inventory", label: "Наличие" },
  { href: "/admin/build-options", label: "Компоненты" },
  { href: "/admin/models", label: "Модели" }
];

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Навигация админки">
      <div className="admin-nav__links">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
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
