// app/components/CategoriasDinamicas.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCatalogo } from '@/app/context/CatalogoContext';

export default function CategoriasDinamicas() {
    const { produtos } = useCatalogo();

    const categorias = useMemo(() => {
        const unicas = new Set<string>();
        produtos.forEach((p) => {
            if (p.categoria) unicas.add(p.categoria);
        });
        return Array.from(unicas).slice(0, 8); // limitar a 8 categorias
    }, [produtos]);

    const cores = ['bg-purple-100', 'bg-yellow-100'];

    return (
        <section className="flex flex-wrap justify-center gap-4 text-center mt-6">
            {categorias.map((nome, i) => (
                <Link
                    key={nome}
                    href={`/produtos?categoria=${encodeURIComponent(nome)}`}
                    className={`${cores[i % cores.length]} hover:scale-105 transition rounded-xl px-6 py-4 font-medium min-w-[120px]`}
                >
                    {nome}
                </Link>
            ))}
        </section>
    );
}