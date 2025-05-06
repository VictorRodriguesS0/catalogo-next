'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchBox() {
    const [busca, setBusca] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (busca) {
                params.set('busca', busca);
            } else {
                params.delete('busca');
            }
            router.push(`/?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timeout);
    }, [busca]);

    return (
        <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="border rounded px-4 py-2 w-full max-w-md"
        />
    );
}
