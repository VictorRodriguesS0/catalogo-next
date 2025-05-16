'use client';

import { useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { filtrarProdutos } from '@/lib/filtrarProdutos';
import { aliasesCategorias } from '@/lib/aliasesCategorias';

export default function ProdutosHeader() {
    const { produtos } = useCatalogo();
    const searchParams = useSearchParams();

    const termo = searchParams.get('busca')?.trim() || '';
    const categoria = searchParams.get('categoria')?.trim() || '';

    const filtros = {
        categoria: categoria.toLowerCase(),
        busca: termo.toLowerCase(),
        marcas: searchParams.getAll('marca').map((m) => m.toLowerCase()),
        cores: searchParams.getAll('cor').map((c) => c.toLowerCase()),
        destaque: searchParams.get('destaque') === 'true',
        promocao: searchParams.get('promocao') === 'true',
    };

    const produtosFiltrados = filtrarProdutos(produtos, filtros);

    function formatarCategoria(nome: string) {
        const lower = nome
            .normalize('NFD') // remove acentos
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        return aliasesCategorias[lower] ||
            lower
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toLocaleUpperCase('pt-BR'));
    }



    const titulo = termo
        ? `Resultados para "${termo}"`
        : categoria
            ? `Categoria: ${formatarCategoria(categoria)}`
            : 'Todos os Produtos';

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{titulo}</h1>
            <p className="text-sm text-gray-600 mt-1">
                {produtosFiltrados.length} produto(s) encontrado(s)
            </p>
        </div>
    );
}
