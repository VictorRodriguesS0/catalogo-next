// app/components/CategoriasDinamicas.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCatalogo } from '@/app/context/CatalogoContext';

export default function CategoriasDinamicas() {
    const { produtos } = useCatalogo();
    const [mostrarTodas, setMostrarTodas] = useState(false);

    const categorias = useMemo(() => {
        const unicas = new Set<string>();
        produtos.forEach((p) => {
            if (p.categoria) unicas.add(p.categoria);
        });
        return Array.from(unicas);
    }, [produtos]);

    const cores = ['bg-purple-100', 'bg-yellow-100'];
    const visiveis = mostrarTodas ? categorias : categorias.slice(0, 8);

    return (
        <section className="flex flex-col items-center gap-4 mt-6">
            <div className="flex flex-wrap justify-center gap-4 text-center">
                {visiveis.map((nome, i) => (
                    <Link
                        key={nome}
                        href={`/produtos?categoria=${encodeURIComponent(nome)}`}
                        className={`${cores[i % cores.length]} hover:scale-105 transition rounded-xl px-6 py-4 font-medium min-w-[120px]`}
                    >
                        {nome}
                    </Link>
                ))}
            </div>
            {categorias.length > 8 && (
                <button
                    onClick={() => setMostrarTodas((v) => !v)}
                    className="text-sm text-blue-600 underline mt-2 hover:text-blue-800"
                >
                    {mostrarTodas ? 'Ver menos' : 'Ver todas'}
                </button>
            )}
        </section>
    );
}
