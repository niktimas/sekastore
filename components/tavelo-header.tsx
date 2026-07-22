import Link from "next/link";

export function TaveloHeader() {
  return (
    <header className="tavelo-header">
      <div className="tavelo-topline">New aero gravel · Rise handlebar · available in Russia</div>
      <nav className="tavelo-nav" aria-label="Tavelo navigation">
        <Link className="tavelo-logo" href="/">
          TAVELO
        </Link>
        <div className="tavelo-nav__links">
          <Link href="/#models">Bikes</Link>
          <Link href="/inventory">Stock</Link>
          <Link href="/build-options">Gear</Link>
          <Link href="/contacts">Support</Link>
        </div>
      </nav>
    </header>
  );
}
