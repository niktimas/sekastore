import Link from "next/link";

export function TaveloFooter() {
  return (
    <footer className="tavelo-footer">
      <div>
        <strong>TAVELO Russia</strong>
        <p>Фреймсеты Tavelo, подбор размера, комплектация сборки и доставка СДЭК/ПЭК по РФ и ближайшему СНГ.</p>
      </div>
      <nav aria-label="Tavelo footer">
        <Link href="/contacts">Контакты</Link>
        <Link href="/inventory">Наличие</Link>
        <Link href="/offer">Оферта</Link>
      </nav>
    </footer>
  );
}
