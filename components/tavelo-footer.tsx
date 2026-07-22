import Link from "next/link";

export function TaveloFooter() {
  return (
    <footer className="tavelo-footer">
      <div>
        <strong>Tavelo в Carbonara Bike</strong>
        <p>
          Подбор фреймсета, проверка цвета и размера, комплектация сборки и доставка СДЭК/ПЭК по России и ближайшему СНГ.
        </p>
        <small>
          Индивидуальный предприниматель Белятич Александр Вячеславович. ИНН 510204041407, ОГРНИП 326784700009073.
        </small>
      </div>
      <nav aria-label="Документы и разделы Tavelo">
        <Link href="/contacts">Контакты</Link>
        <Link href="/inventory">Наличие</Link>
        <Link href="/offer">Оферта</Link>
      </nav>
    </footer>
  );
}
