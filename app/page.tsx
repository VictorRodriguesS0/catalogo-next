import { Suspense } from 'react';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';

export const metadata = {
  title: 'Catálogo de Produtos | Sua Loja',
  description: 'Confira eletrônicos com preços imperdíveis e frete rápido para o DF.',
};

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      {/* HERO */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 px-6 rounded-2xl text-center shadow-md">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Bem-vindo ao nosso Catálogo!</h1>
        <p className="text-lg md:text-xl">Encontre os melhores eletrônicos com ofertas imperdíveis.</p>
      </section>

      {/* FILTROS */}
      <Suspense fallback={<div className="animate-pulse text-gray-500 text-sm">Carregando filtros...</div>}>
        <FilterBar />
      </Suspense>

      {/* LISTA DE PRODUTOS */}
      <Suspense fallback={<div className="text-center text-gray-400 py-10">Carregando produtos...</div>}>
        <ProductList />
      </Suspense>
    </main>
  );
}
