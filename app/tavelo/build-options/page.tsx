import Image from "next/image";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, taveloCockpit } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "Tavelo Gear",
  description: "Кокпиты и компоненты для сборок Tavelo."
};

export default function TaveloBuildOptionsPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page">
        <p className="tavelo-kicker">Gear</p>
        <h1>Компоненты для сборки</h1>
        <p>Базовый компонент Tavelo для полной сборки: аэрококпит Rise Handlebar.</p>
        <section className="tavelo-feature tavelo-feature--compact">
          <div>
            <h2>{taveloCockpit.name}</h2>
            <p>{taveloCockpit.description}</p>
            <strong>{formatTaveloPrice(taveloCockpit.price)}</strong>
            <OrderButton
              className="tavelo-button"
              title={taveloCockpit.name}
              details="Карбоновый интегрированный кокпит Tavelo"
              status="Tavelo"
              price={formatTaveloPrice(taveloCockpit.price)}
              actionLabel="Заказать кокпит"
            />
          </div>
          <div className="tavelo-feature__image">
            <Image src={taveloCockpit.image} alt={taveloCockpit.name} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </section>
      </main>
      <TaveloFooter />
    </div>
  );
}
