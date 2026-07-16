import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactIcons } from "@/components/contact-icons";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты официального дистрибьютора SEKA в России."
};

export default function ContactsPage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="contacts-hero">
          <div className="contacts-hero__copy">
            <p className="eyebrow">Контакты</p>
            <h1>Связаться с {brand.name}</h1>
            <p>Подбор модели, проверка наличия, комплектация сборки и консультация по доставке.</p>
            <address>Санкт-Петербург, 8-я линия В.О., 25</address>
            <ContactIcons />
          </div>
          <div className="map-panel">
            <iframe
              title="Карта: Санкт-Петербург, 8-я линия В.О., 25"
              src="https://www.openstreetmap.org/export/embed.html?bbox=30.269953%2C59.934640%2C30.289953%2C59.944640&layer=mapnik&marker=59.939640%2C30.279953"
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
