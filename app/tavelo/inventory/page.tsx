import Image from "next/image";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, getTaveloHeroColor, taveloModels } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "Tavelo в наличии",
  description: "Фреймсеты Tavelo под заказ и из наличия в России."
};

export default function TaveloInventoryPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page">
        <p className="tavelo-kicker">Stock</p>
        <h1>Фреймсеты Tavelo</h1>
        <p>Проверим наличие конкретного SKU, размер и срок поставки перед подтверждением заказа.</p>
        <div className="tavelo-stock-list">
          {taveloModels.map((model) => {
            const color = getTaveloHeroColor(model);
            return (
              <article key={model.slug}>
                <div>
                  <Image src={color.image} alt={model.name} fill sizes="160px" />
                </div>
                <strong>{model.name}</strong>
                <span>{model.colors.length} SKU</span>
                <b>{formatTaveloPrice(model.price)}</b>
                <OrderButton
                  className="tavelo-link-button"
                  title={model.name}
                  details={`Проверить наличие Tavelo ${model.family}`}
                  status="Tavelo"
                  price={formatTaveloPrice(model.price)}
                  actionLabel="Проверить наличие"
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
