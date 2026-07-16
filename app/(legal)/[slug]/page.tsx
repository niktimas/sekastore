import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LegalPage } from "@/components/legal-page";
import { getLegalDoc, legalDocs } from "@/lib/legal-docs";

type LegalRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: LegalRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description
  };
}

export default async function LegalRoutePage({ params }: LegalRouteProps) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="site-shell">
      <Header />
      <LegalPage doc={doc} />
      <Footer />
    </div>
  );
}
