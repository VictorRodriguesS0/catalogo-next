'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCatalogo } from '@/app/context/CatalogoContext';

type Crumb = {
    label: string;
    href?: string;
};

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    if (pathname === '/') return null;

    const { produtos } = useCatalogo();

    function formatarSegmento(seg: string): string {
        const decoded = decodeURIComponent(seg.replace(/-/g, ' '));
        return decoded
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const isProdutoDetalhe =
        segments.length === 2 &&
        segments[0] === 'produtos' &&
        produtos.length > 0;

    const produtoSlug = segments[1];
    const produtoEncontrado = produtos.find((p) => p.slug === produtoSlug);
    const tituloProduto = produtoEncontrado?.titulo;

    const crumbs: Crumb[] = [
        { label: 'Início', href: '/' },
        { label: 'Produtos', href: '/produtos' },
    ];

    if (isProdutoDetalhe && tituloProduto) {
        crumbs.push({ label: tituloProduto });
    } else {
        segments.slice(1).forEach((seg, i) => {
            const href = '/' + segments.slice(0, i + 2).join('/');
            const label = formatarSegmento(seg);
            crumbs.push({ label, href });
        });
    }

    return (
        <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
                {crumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-1">
                        {i > 0 && <span>/</span>}
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:underline">
                                {crumb.label}
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
