'use client';

import { Suspense } from 'react';
import CompararPageInner from './CompararPageInner';

export default function CompararPageClient() {
    return (
        <Suspense fallback={<p className="p-4">Carregando comparação...</p>}>
            <CompararPageInner />
        </Suspense>
    );
}
