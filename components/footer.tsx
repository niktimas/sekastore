import Link from "next/link";
import { brand } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span>Официальный дистрибьютор SEKA в России.</span>
          <small>
            {brand.legalName}
            <br />
            {brand.legalDetails}
            <br />
            Юридический адрес: {brand.legalAddress}
            <br />
            <Link href="/privacy">Политика обработки данных</Link>{" · "}
            <Link href="/consent">Согласие на обработку данных</Link>{" · "}
            <Link href="/terms">Оферта</Link>{" · "}
            <Link href="/user-agreement">Пользовательское соглашение</Link>{" · "}
            <Link href="/warranty">Гарантия</Link>
          </small>
        </div>
        <div className="footer__links">
          <Link href="/contacts">Контакты</Link>
        </div>
      </div>
    </footer>
  );
}
