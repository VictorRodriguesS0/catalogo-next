import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/lib/fetchProducts';
import { formatPreco } from '@/lib/formatPrice';

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.slug} href={`/produto/${product.slug}`}>
            <div className="border rounded-xl p-4 shadow hover:shadow-lg transition hover:scale-[1.01] cursor-pointer bg-white">
              {product.imagemPrincipal && (
                <div className="relative w-full h-48 mb-3 overflow-hidden rounded">
                  <Image
                    src={product.imagemPrincipal}
                    alt={product.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{product.titulo}</h2>
              {product.promocao ? (
                <p className="text-green-600 text-lg font-bold">
                  {formatPreco(product.promocao)}{' '}
                  <span className="text-sm line-through text-gray-500">
                    {formatPreco(product.valor)}
                  </span>
                </p>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {formatPreco(product.valor)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
