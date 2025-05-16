'use client';

import { useCatalogo } from '@/app/context/CatalogoContext';
import ProductCarousel from './ProductCarousel';

export default function CarrosseisHome() {
    const { produtos } = useCatalogo();

    const produtosDestaque = produtos.filter((p) => p.destaque);
    const produtosPromocao = produtos.filter((p) => p.emPromocao);

    return (
        <>
            <ProductCarousel titulo="🌟 Destaques da loja" produtos={produtosDestaque} />
            <ProductCarousel titulo="🔥 Promoções especiais" produtos={produtosPromocao} />
        </>
    );
}
