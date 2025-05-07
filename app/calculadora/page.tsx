import { Suspense } from 'react';
import CalculadoraPage from './CalculadoraPage';

export default function Page() {
    return (
        <Suspense fallback={<p className="text-center p-4">Carregando calculadora...</p>}>
            <CalculadoraPage />
        </Suspense>
    );
}
