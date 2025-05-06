import { fetchProducts } from '@/lib/fetchProducts';
import ProductCard from './components/ProductCard';

interface Props {
  searchParams: {
    busca?: string;
    categoria?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const produtos = await fetchProducts();

  const busca = searchParams.busca?.toLowerCase() || '';
  const categoriaSelecionada = searchParams.categoria?.toLowerCase() || '';

  const produtosFiltrados = produtos.filter((produto) => {
    const titulo = produto.titulo?.toLowerCase() || '';
    const categoria = produto.categoria?.toLowerCase() || '';
    const descricao = produto.descricao?.toLowerCase() || '';
    return (
      (!categoriaSelecionada || categoria === categoriaSelecionada) &&
      (!busca || titulo.includes(busca) || descricao.includes(busca) || categoria.includes(busca))
    );
  });

  return (
    <main className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>

      {produtosFiltrados.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.slug} product={{ ...produto, imagemPrincipal: produto.imagemPrincipal || '' }} />
          ))}
        </div>
      )}
    </main>
  );
}
