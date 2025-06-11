import { Suspense } from "react";
import ProdutosHeader from "../components/ProdutosHeader";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";

export default function ProdutosPage() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <Suspense
        fallback={<div className="h-10 bg-gray-100 rounded animate-pulse" />}
      >
        <ProdutosHeader />
      </Suspense>

      <Suspense
        fallback={<div className="h-16 bg-gray-100 rounded animate-pulse" />}
      >
        <FilterBar />
      </Suspense>

      <Suspense
        fallback={
          <p className="text-center text-gray-500">Carregando produtos...</p>
        }
      >
        <ProductList />
      </Suspense>
    </main>
  );
}
