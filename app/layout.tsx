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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lojinha Eletrônicos",
  description:
    "Todos os produtos possuem nota fiscal e garantia. Pagamento à vista ou em até 12x com juros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <CatalogoProvider>
          <CompararProvider>
            <Header />
            <main className="max-w-6xl mx-auto p-4">
              <Suspense fallback={null}>
                <Breadcrumbs />
              </Suspense>
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            <BotaoCompararFlutuante />
            <Footer />
          </CompararProvider>
        </CatalogoProvider>
      </body>
    </html>
  );
}
