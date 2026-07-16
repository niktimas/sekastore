import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Договор публичной оферты",
  description: "Публичная оферта на продажу велосипедов, рам и компонентов."
};

export default function OfferPage() {
  const doc = getLegalDoc("terms");

  if (!doc) {
    return null;
  }

  return (
    <div className="site-shell">
      <Header />
      <LegalPage doc={doc} />
      <Footer />
    </div>
  );
}
