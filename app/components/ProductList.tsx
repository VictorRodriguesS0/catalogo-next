'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { filtrarProdutos } from '@/lib/filtrarProdutos';

export default function ProductList() {
    const { produtos } = useCatalogo();
    const searchParams = useSearchParams();

    const rawVisualizacao = searchParams.get('visualizacao');
    const visualizacao: 'grade' | 'lista' =
        rawVisualizacao === 'lista' ? 'lista' : 'grade';

    const filtros = {
        categoria: searchParams.get('categoria')?.toLowerCase() || '',
        busca: searchParams.get('busca')?.toLowerCase() || '',
        marcas: searchParams.getAll('marca').map((m) => m.toLowerCase()),
        cores: searchParams.getAll('cor').map((c) => c.toLowerCase()),
        destaque: searchParams.get('destaque') === 'true',
        promocao: searchParams.get('promocao') === 'true',
    };

    const produtosFiltrados = filtrarProdutos(produtos, filtros);

    return produtosFiltrados.length > 0 ? (
        <div
            className={
                visualizacao === 'grade'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-sans'
                    : 'flex flex-col gap-4 font-sans'
            }
        >
            <AnimatePresence>
                {produtosFiltrados.map((produto) => (
                    <motion.div
                        key={produto.slug}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProductCard
                            product={{
                                ...produto,
                                imagemPrincipal: produto.imagemPrincipal || '',
                            }}
                            visualizacao={visualizacao}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    ) : (
        <p className="text-center text-gray-600 text-sm">
            Nenhum produto encontrado.
        </p>
    );
}
