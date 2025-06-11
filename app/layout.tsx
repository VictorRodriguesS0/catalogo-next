// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "./components/Footer";
import { CatalogoProvider } from "@/app/context/CatalogoContext";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { Suspense } from "react";
import PageTransition from "./components/PageTransition";

import { getCatalogoData } from "@/lib/getCatalogoData";
import { fetchProducts } from "@/lib/fetchProducts";
import { fetchTaxas } from "@/lib/fetchTaxas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lojinha Eletrônicos",
  description:
    "A melhor loja de eletrônicos de Brasília: Xiaomi, Realme, JBL, iPhones e muito mais.",
  openGraph: {
    title: "Lojinha Eletrônicos",
    description:
      "A melhor loja de eletrônicos de Brasília: Xiaomi, Realme, JBL, iPhones e muito mais.",
    url: "https://lojinhaeletronicos.com",
    siteName: "Lojinha Eletrônicos",
    images: [
      {
        url: "https://lojinhaeletronicos.com/logo.png",
        width: 800,
        height: 600,
        alt: "Lojinha Eletrônicos - Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const produtos = await fetchProducts();
  const categorias = await getCatalogoData();
  const todasTaxas = await fetchTaxas();

  const marcas = [
    ...new Set(produtos.map((p) => p.marca).filter((m): m is string => !!m)),
  ];
  const cores = [
    ...new Set(produtos.map((p) => p.cor).filter((c): c is string => !!c)),
  ];

  const taxa12x = todasTaxas.find((t) => t.parcelas === "12x")?.taxa ?? null;

  const initialData = {
    produtos,
    categorias,
    marcas,
    cores,
    taxa12x,
    todasTaxas,
  };

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <CatalogoProvider initialData={initialData}>
          <Header />
          <main className="max-w-6xl mx-auto p-4">
            <Suspense fallback={null}>
              <Breadcrumbs />
            </Suspense>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </CatalogoProvider>
      </body>
    </html>
  );
}
