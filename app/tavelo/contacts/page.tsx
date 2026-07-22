import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";

export const metadata = {
  title: "Контакты Tavelo Russia",
  description: "Связаться с Carbonara Bike по фреймсетам Tavelo."
};

export default function TaveloContactsPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page tavelo-contacts">
        <p className="tavelo-kicker">Support</p>
        <h1>Контакты</h1>
        <p>Подбор Tavelo, проверка SKU, комплектация сборки и доставка СДЭК/ПЭК по России и ближайшему СНГ.</p>
        <div>
          <a href="https://t.me/CarbonaraBike">Telegram</a>
          <a href="https://vk.com/carbonara_bike">VK</a>
          <a href="https://max.ru/id510204041407_biz">MAX</a>
          <a href="mailto:niktimas696@gmail.com">Email</a>
        </div>
        <address>Санкт-Петербург, 8-я линия В.О, 25</address>
      </main>
      <TaveloFooter />
    </div>
  );
}
