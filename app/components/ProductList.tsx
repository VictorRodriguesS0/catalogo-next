'use client';

import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductList() {
    const { produtos } = useCatalogo();
    const searchParams = useSearchParams();

    const categoria = searchParams.get('categoria')?.toLowerCase() || '';
    const busca = searchParams.get('busca')?.toLowerCase() || '';
    const marcas = searchParams.getAll('marca').map((m) => m.toLowerCase());
    const cores = searchParams.getAll('cor').map((c) => c.toLowerCase());
    const ordenar = searchParams.get('ordenar') || '';
    const apenasDestaque = searchParams.get('destaque') === 'true';
    const apenasPromocao = searchParams.get('promocao') === 'true';

    const produtosFiltrados = produtos
        .filter((produto) => {
            const matchCategoria =
                categoria === 'promoções'
                    ? produto.emPromocao
                    : categoria
                        ? produto.categoria?.toLowerCase() === categoria
                        : true;

            const matchBusca =
                busca === '' ||
                produto.titulo.toLowerCase().includes(busca) ||
                produto.descricao?.toLowerCase().includes(busca) ||
                produto.categoria?.toLowerCase().includes(busca);

            const matchMarca =
                marcas.length === 0 || (produto.marca && marcas.includes(produto.marca.toLowerCase()));

            const matchCor =
                cores.length === 0 || (produto.cor && cores.includes(produto.cor.toLowerCase()));

            const matchDestaque = !apenasDestaque || produto.destaque === true;
            const matchPromocao = !apenasPromocao || produto.emPromocao === true;

            return matchCategoria && matchBusca && matchMarca && matchCor && matchDestaque && matchPromocao;
        })
        .sort((a, b) => {
            const valorA = parseFloat((a.promocao || a.valor).replace(/[^\d,]/g, '').replace(',', '.'));
            const valorB = parseFloat((b.promocao || b.valor).replace(/[^\d,]/g, '').replace(',', '.'));

            switch (ordenar) {
                case 'menor-preco':
                    return valorA - valorB;
                case 'maior-preco':
                    return valorB - valorA;
                case 'a-z':
                    return a.titulo.localeCompare(b.titulo);
                case 'z-a':
                    return b.titulo.localeCompare(a.titulo);
                default:
                    return 0;
            }
        });

    return produtosFiltrados.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-sans">
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
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    ) : (
        <p className="text-center text-gray-600 text-sm">Nenhum produto encontrado.</p>
    );
}
