import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { OrderModalProvider } from "@/components/order-modal";
import { SiteAnalytics } from "@/components/site-analytics";
import { brand } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://seka-bike.ru"),
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`
  },
  description: "Официальный дистрибьютор велосипедов и фреймсетов SEKA в России.",
  openGraph: {
    title: brand.name,
    description: "Каталог SEKA Spear, Exceed и Exaero GR в России.",
    url: "https://seka-bike.ru",
    siteName: brand.name,
    locale: "ru_RU",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <OrderModalProvider>
          <SiteAnalytics />
          {children}
        </OrderModalProvider>
      </body>
    </html>
  );
}
