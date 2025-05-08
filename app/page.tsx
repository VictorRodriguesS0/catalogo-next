import { fetchProducts } from '@/lib/fetchProducts';
import ProductList from './components/ProductList';
import { Suspense } from 'react';

export default async function Home() {
  const produtos = await fetchProducts();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <Suspense fallback={<p className="text-center text-gray-500">Carregando produtos...</p>}>
        <ProductList produtos={produtos} />
      </Suspense>
    </main>
  );
}
