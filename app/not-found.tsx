import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="page-title">
          <p className="eyebrow">404</p>
          <h1>Страница не найдена</h1>
          <p>Возможно, модель или раздел были перемещены. Каталог остается самым быстрым способом вернуться к выбору.</p>
          <Link className="button button--dark" href="/models">
            Открыть каталог <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
