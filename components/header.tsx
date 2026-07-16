import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/site";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link className="brand" href="/">
          <Image src={brand.logo} alt={brand.name} width={480} height={161} priority />
        </Link>
        <nav className="nav" aria-label="Основная навигация">
          <Link href="/#gallery">Галерея</Link>
          <Link href="/inventory">Наличие</Link>
          <Link href="/build-options">Компоненты</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
      </div>
    </header>
  );
}
