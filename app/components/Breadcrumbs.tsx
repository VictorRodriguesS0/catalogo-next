'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    if (pathname === '/') return null;

    function formatarSegmento(seg: string): string {
        const decoded = decodeURIComponent(seg.replace(/-/g, ' '));
        return decoded
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Segmentar e aplicar lógica condicional de link
    const crumbs = [
        { label: 'Início', href: '/' },
        ...segments.map((seg, i) => {
            const href = '/' + segments.slice(0, i + 1).join('/');
            const label = formatarSegmento(seg);

            const isLast = i === segments.length - 1;
            const isStaticPathWithoutPage = ['produto'].includes(seg.toLowerCase());

            return {
                label,
                href: isLast || isStaticPathWithoutPage ? null : href,
            };
        }),
    ];

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
