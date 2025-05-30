import { Suspense } from 'react';
import DescontoParceladoPage from './DescontoParceladoPage';

export default function Page() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Carregando...</div>}>
            <DescontoParceladoPage />
        </Suspense>
    );
}
