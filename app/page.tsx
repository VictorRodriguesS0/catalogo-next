import { Suspense } from 'react';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <Suspense fallback={<p>Carregando filtros...</p>}>
        <FilterBar />
      </Suspense>
      <Suspense fallback={<p className="text-center text-gray-500">Carregando produtos...</p>}>
        <ProductList />
      </Suspense>
    </main>
  );
}
