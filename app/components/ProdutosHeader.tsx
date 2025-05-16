'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { filtrarProdutos } from '@/lib/filtrarProdutos';
import { aliasesCategorias } from '@/lib/aliasesCategorias';

export default function ProdutosHeader() {
    const { produtos } = useCatalogo();
    const searchParams = useSearchParams();
    const router = useRouter();

    const termo = searchParams.get('busca')?.trim() || '';
    const categoria = searchParams.get('categoria')?.trim() || '';

    const [visualizacao, setVisualizacao] = useState<'grade' | 'lista'>('grade');

    // Ao montar, define visualização com base na URL ou localStorage
    useEffect(() => {
        const param = searchParams.get('visualizacao') as 'grade' | 'lista' | null;
        const local = localStorage.getItem('visualizacao') as 'grade' | 'lista' | null;

        if (param === 'grade' || param === 'lista') {
            setVisualizacao(param);
            localStorage.setItem('visualizacao', param);
        } else if (local === 'grade' || local === 'lista') {
            setVisualizacao(local);
            const params = new URLSearchParams(searchParams.toString());
            params.set('visualizacao', local);
            router.replace(`/produtos?${params.toString()}`);
        }
    }, [searchParams, router]);

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
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        return (
            aliasesCategorias[lower] ||
            lower
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toLocaleUpperCase('pt-BR'))
        );
    }

    const titulo = termo
        ? `Resultados para "${termo}"`
        : categoria
            ? `Categoria: ${formatarCategoria(categoria)}`
            : 'Todos os Produtos';

    function alterarVisualizacao(tipo: 'grade' | 'lista') {
        setVisualizacao(tipo);
        localStorage.setItem('visualizacao', tipo);

        const params = new URLSearchParams(searchParams.toString());
        params.set('visualizacao', tipo);
        router.push(`/produtos?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{titulo}</h1>
                <p className="text-sm text-gray-600 mt-1">
                    {produtosFiltrados.length} produto(s) encontrado(s)
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => alterarVisualizacao('grade')}
                    className={`px-3 py-1 text-sm rounded border ${visualizacao === 'grade'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                        }`}
                >
                    🔳 Grade
                </button>
                <button
                    onClick={() => alterarVisualizacao('lista')}
                    className={`px-3 py-1 text-sm rounded border ${visualizacao === 'lista'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                        }`}
                >
                    📄 Lista
                </button>
            </div>
        </div>
    );
}
