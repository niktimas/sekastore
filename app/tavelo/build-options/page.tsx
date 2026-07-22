import Image from "next/image";
import { OrderButton } from "@/components/order-button";
import { TaveloFooter } from "@/components/tavelo-footer";
import { TaveloHeader } from "@/components/tavelo-header";
import { formatTaveloPrice, taveloCockpit } from "@/lib/tavelo-catalog";

export const metadata = {
  title: "Компоненты Tavelo | Carbonara Bike",
  description: "Кокпиты и компоненты Tavelo для кастомной сборки велосипеда."
};

export default function TaveloBuildOptionsPage() {
  return (
    <div className="tavelo-shell">
      <TaveloHeader />
      <main className="tavelo-simple-page">
        <p className="tavelo-kicker">Компоненты</p>
        <h1>Кокпиты и детали для сборки Tavelo</h1>
        <p>
          Подберем совместимый кокпит, трансмиссию, колеса и посадочные размеры под выбранный фреймсет.
          Ниже базовый компонент Tavelo, который чаще всего используют для аккуратной интегрированной сборки.
        </p>
        <section className="tavelo-feature tavelo-feature--compact">
          <div>
            <p className="tavelo-kicker">Карбоновый кокпит</p>
            <h2>{taveloCockpit.name}</h2>
            <p>{taveloCockpit.description}</p>
            <strong>{formatTaveloPrice(taveloCockpit.price)}</strong>
            <OrderButton
              className="tavelo-button"
              title={taveloCockpit.name}
              details="Карбоновый интегрированный кокпит Tavelo. Подобрать ширину и вынос"
              status="Заявка на компонент Tavelo"
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
