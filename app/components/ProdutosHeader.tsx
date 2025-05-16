'use client';

import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { filtrarProdutos } from '@/lib/filtrarProdutos';

export default function ProdutosHeader() {
    const { produtos } = useCatalogo();
    const searchParams = useSearchParams();

    const termo = searchParams.get('busca')?.trim() || '';
    const titulo = termo ? `Resultados para "${termo}"` : 'Todos os Produtos';

    const filtros = {
        categoria: searchParams.get('categoria')?.toLowerCase() || '',
        busca: termo.toLowerCase(),
        marcas: searchParams.getAll('marca').map((m) => m.toLowerCase()),
        cores: searchParams.getAll('cor').map((c) => c.toLowerCase()),
        destaque: searchParams.get('destaque') === 'true',
        promocao: searchParams.get('promocao') === 'true',
    };

    const produtosFiltrados = filtrarProdutos(produtos, filtros);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{titulo}</h1>
            <p className="text-sm text-gray-600 mt-1">{produtosFiltrados.length} produto(s) encontrado(s)</p>
        </div>
    );
}
