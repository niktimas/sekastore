import Link from "next/link";

export function TaveloHeader() {
  return (
    <header className="tavelo-header">
      <nav className="tavelo-nav" aria-label="Навигация Tavelo">
        <Link className="tavelo-logo" href="/">
          Tavelo
        </Link>
        <div className="tavelo-nav__links">
          <Link href="/#models">Каталог</Link>
          <Link href="/inventory">Наличие</Link>
          <Link href="/build-options">Компоненты</Link>
          <Link href="/contacts">Контакты</Link>
        </div>
      </nav>
    </header>
  );
}
