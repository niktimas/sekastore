import Image from "next/image";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, getTaveloHeroColor, taveloModels } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "Наличие Tavelo | Carbonara Bike",
  description: "Проверка наличия фреймсетов Tavelo, цветов, размеров и сроков поставки по России."
};

export default function TaveloInventoryPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page">
        <p className="tavelo-kicker">Наличие</p>
        <h1>Фреймсеты Tavelo под заказ и из поставок Carbonara Bike</h1>
        <p>
          Актуальные цвета и размеры быстро меняются. Перед оплатой мы проверяем доступность нужного варианта,
          согласуем срок поставки и помогаем выбрать размер под рост и посадку.
        </p>
        <div className="tavelo-stock-list">
          {taveloModels.map((model) => {
            const color = getTaveloHeroColor(model);
            return (
              <article key={model.slug}>
                <div>
                  <Image src={color.image} alt={model.name} fill sizes="160px" />
                </div>
                <strong>{model.name}</strong>
                <span>{model.category}</span>
                <b>{formatTaveloPrice(model.price)}</b>
                <OrderButton
                  className="tavelo-link-button"
                  title={model.name}
                  details={`Проверить наличие, цвет и размер ${model.family}`}
                  status="Проверка наличия Tavelo"
                  price={formatTaveloPrice(model.price)}
                  actionLabel="Заказать из наличия"
                />
              </article>
            );
          })}
        </div>
      </main>
      <TaveloFooter />
    </div>
  );
}
