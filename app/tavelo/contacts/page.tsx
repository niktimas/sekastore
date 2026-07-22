import { Mail, MapPin, MessageCircle } from "lucide-react";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";

export const metadata = {
  title: "Контакты Tavelo | Carbonara Bike",
  description: "Связаться с Carbonara Bike по фреймсетам Tavelo, подбору модели, наличию и доставке."
};

export default function TaveloContactsPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page tavelo-contacts">
        <p className="tavelo-kicker">Контакты</p>
        <h1>Связаться с Carbonara Bike</h1>
        <p>
          Подбор Tavelo, проверка наличия, комплектация сборки и консультация по доставке.
          Напишите удобным способом, и мы поможем выбрать фреймсет под ваши задачи.
        </p>
        <div>
          <a href="https://t.me/CarbonaraBike" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Telegram
          </a>
          <a href="https://vk.com/carbonara_bike" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> ВКонтакте
          </a>
          <a href="https://max.ru/id510204041407_biz" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> MAX
          </a>
          <a href="mailto:niktimas696@gmail.com">
            <Mail size={18} /> Почта
          </a>
        </div>
        <address>
          <MapPin size={18} /> Санкт-Петербург, 8-я линия В.О., 25
        </address>
      </main>
      <TaveloFooter />
    </div>
  );
}
