'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import getIconeCategoria from '@/lib/IconeCategoria';

interface MenuCategoria {
    id: number;
    name: string;
    children: MenuCategoria[];
}

export default function HeaderCategorias() {
    const [menu, setMenu] = useState<MenuCategoria[]>([]);
    const [categoriaAberta, setCategoriaAberta] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetch('/api/categorias')
            .then((res) => res.json())
            .then(setMenu)
            .catch((err) => console.error('Erro ao carregar categorias:', err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                window.innerWidth < 768 &&
                categoriaAberta &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setCategoriaAberta(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [categoriaAberta]);

    const todasCategorias = menu.map((c) => c.name);
    const categoriasSemPromocoes = todasCategorias.filter(
        (c) => c.toLowerCase() !== 'promoções'
    );
    const principaisCategorias = ['Promoções', ...categoriasSemPromocoes].filter(
        (c, i) => i < 8
    );

    const handleCategoriaClick = (categoria: string, e: React.MouseEvent) => {
        const cat = menu.find((c) => c.name === categoria);
        const temSub = cat?.children.length ? true : false;

        if (window.innerWidth < 768) {
            if (temSub) {
                e.preventDefault();
                setCategoriaAberta((prev) => (prev === categoria ? null : categoria));
            } else {
                setCategoriaAberta(null); // fecha dropdown se existir
            }
        }
    };

    const fecharDropdownMobile = () => setCategoriaAberta(null);

    return (
        <nav className="relative bg-white shadow-sm py-2 z-30">
            <div ref={containerRef} className="max-w-6xl mx-auto px-4 md:px-6">
                <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm ">
                    {principaisCategorias.map((categoria) => {
                        const isAberta = categoriaAberta === categoria;
                        const cat = menu.find((c) => c.name === categoria);
                        const temSub = cat?.children.length ? true : false;

                        return (
                            <li key={categoria} className="relative group">
                                <Link
                                    href={
                                        categoria.toLowerCase() === 'promoções'
                                            ? '/produtos?promocao=true'
                                            : `/produtos?categoria=${encodeURIComponent(categoria)}`
                                    }
                                    onClick={(e) => handleCategoriaClick(categoria, e)}
                                    className={clsx(
                                        'text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1',
                                        { 'text-blue-700': isAberta }
                                    )}
                                >
                                    <span className="text-gray-500">{getIconeCategoria(categoria)}</span>
                                    {categoria}
                                    {temSub && (
                                        <ChevronDown
                                            size={16}
                                            className={clsx('transition-transform duration-200', {
                                                'rotate-180': isAberta,
                                            })}
                                        />
                                    )}
                                </Link>

                                {temSub && (
                                    <ul
                                        className={clsx(
                                            'absolute top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ease-out',
                                            {
                                                'left-0 right-0 w-full': typeof window !== 'undefined' && window.innerWidth < 768,
                                                'left-1/2 -translate-x-1/2 w-56': typeof window !== 'undefined' && window.innerWidth >= 768,
                                                'opacity-100 visible translate-y-0 scale-100': isAberta,
                                                'opacity-0 invisible translate-y-1 scale-95': !isAberta,
                                            }
                                        )}
                                        style={{ maxHeight: '320px', overflowY: 'auto' }}
                                    >


                                        <li>
                                            <Link
                                                href={`/produtos?categoria=${encodeURIComponent(categoria)}`}
                                                onClick={fecharDropdownMobile}
                                                className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                                            >
                                                Ver tudo
                                            </Link>
                                        </li>
                                        {cat?.children.map((sub) => (
                                            <li key={sub.id}>
                                                <Link
                                                    href={`/categorias/${encodeURIComponent(
                                                        categoria
                                                    )}/${encodeURIComponent(sub.name)}`}
                                                    onClick={fecharDropdownMobile}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                                >
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
