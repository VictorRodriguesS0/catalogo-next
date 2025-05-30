import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "./components/Footer";
import { CatalogoProvider } from "@/app/context/CatalogoContext";
import { CompararProvider } from "@/app/context/CompararContext";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { Suspense } from "react";
import BotaoCompararFlutuante from "./components/BotaoCompararFlutuante";
import PageTransition from "./components/PageTransition";
import { getCatalogoData } from "@/lib/getCatalogoData"; // ✅ novo

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
  description: "A melhor loja de eletrônicos de Brasília: Xiaomi, Realme, JBL, iPhones e muito mais.",
  openGraph: {
    title: "Lojinha Eletrônicos",
    description: "A melhor loja de eletrônicos de Brasília: Xiaomi, Realme, JBL, iPhones e muito mais.",
    url: "https://lojinhaeletronicos.com", // substitua pelo domínio real
    siteName: "Lojinha Eletrônicos",
    images: [
      {
        url: "https://lojinhaeletronicos.com/logo.png", // certifique-se de que a logo está hospedada aqui
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getCatalogoData(); // ✅ pré-carregamento server-side

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <CatalogoProvider initialData={initialData}> {/* ✅ dados passados prontos */}
          <CompararProvider>
            <Header />
            <main className="max-w-6xl mx-auto p-4">
              <Suspense fallback={null}>
                <Breadcrumbs />
              </Suspense>
              <PageTransition>{children}</PageTransition>
            </main>

            <BotaoCompararFlutuante />
            <Footer />
          </CompararProvider>
        </CatalogoProvider>
      </body>
    </html>
  );
}
