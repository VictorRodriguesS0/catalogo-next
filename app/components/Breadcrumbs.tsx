'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';
import { Home } from 'lucide-react';

type Crumb = {
    label: string;
    href?: string;
};

export default function Breadcrumbs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { produtos } = useCatalogo();

    const segments = pathname.split('/').filter(Boolean);
    if (pathname === '/') return null;

    const termoBusca = searchParams.get('busca');
    const categoriaParam = searchParams.get('categoria');

    const crumbs: Crumb[] = [{ label: 'Início', href: '/' }];

    // Corrigido: só exibe "Resultados para..." se for realmente uma busca
    const isPaginaBusca =
        termoBusca &&
        !pathname.startsWith('/produtos/') &&
        !pathname.startsWith('/categorias/') &&
        !segments.some((seg) => produtos.some((p) => p.slug === seg));

    if (isPaginaBusca) {
        crumbs.push({ label: 'Produtos', href: '/produtos' });
        crumbs.push({ label: `Resultados para "${termoBusca}"` });
    } else if (pathname === '/produtos' && categoriaParam) {
        crumbs.push({ label: 'Produtos', href: '/produtos' });
        crumbs.push({ label: categoriaParam });
    } else if (segments[0] === 'produtos' && segments[1] && produtos.length > 0) {
        const produto = produtos.find((p) => p.slug === segments[1]);
        if (produto) {
            crumbs.push({ label: 'Produtos', href: '/produtos' });
            if (produto.categoria) {
                crumbs.push({
                    label: produto.categoria,
                    href: `/produtos?categoria=${encodeURIComponent(produto.categoria)}`,
                });
            }
            if (produto.subcategoria) {
                crumbs.push({
                    label: produto.subcategoria,
                    href: `/categorias/${encodeURIComponent(produto.categoria)}/${encodeURIComponent(produto.subcategoria)}`,
                });
            }
            crumbs.push({ label: produto.titulo });
        }
    } else if (segments[0] === 'categorias') {
        crumbs.push({ label: 'Produtos', href: '/produtos' });
        const categoria = decodeURIComponent(segments[1] || '');
        const subcategoria = decodeURIComponent(segments[2] || '');
        if (categoria) {
            crumbs.push({
                label: categoria,
                href: `/produtos?categoria=${encodeURIComponent(categoria)}`,
            });
        }
        if (subcategoria) {
            crumbs.push({ label: subcategoria });
        }
    } else if (pathname === '/produtos') {
        crumbs.push({ label: 'Produtos' });
    }

    return (
        <nav className="text-sm mt-4 mb-6 max-w-6xl mx-auto px-4" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-gray-500">
                {crumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center gap-1">
                        {index > 0 && <span className="text-gray-300 mx-1">→</span>}
                        {crumb.href ? (
                            <Link
                                href={crumb.href}
                                className="flex items-center gap-1 hover:text-blue-600 transition"
                            >
                                {index === 0 && <Home size={14} className="mt-[1px]" />}
                                <span>{crumb.label}</span>
                            </Link>
                        ) : (
                            <span className="text-gray-600">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
