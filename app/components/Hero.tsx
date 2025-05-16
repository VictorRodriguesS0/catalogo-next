'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Hero() {
    const [falhouImagem, setFalhouImagem] = useState(false);

    const handleErroImagem = () => {
        setFalhouImagem(true);
    };

    return falhouImagem ? (
        // HERO COM GRADIENTE (FALLBACK)
        <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 px-6 rounded-2xl text-center shadow-md">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Ofertas imperdíveis</h1>
            <p className="text-lg md:text-xl mb-4">Confira eletrônicos com a melhor qualidade e menor preço!</p>

            <Link
                href="/produtos"
                className="bg-white text-black text-sm sm:text-base font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
            >
                Ver todos os produtos
            </Link>

        </section>
    ) : (
        // HERO COM IMAGEM
        <section className="rounded-2xl overflow-hidden shadow mb-4 relative h-48 sm:h-64 md:h-72">
            <img
                src="/banner-home.png"
                alt="Promoções imperdíveis"
                className="w-full h-full object-cover"
                onError={handleErroImagem}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">Ofertas imperdíveis</h1>
                <p className="text-sm sm:text-base mb-4">Confira eletrônicos com a melhor qualidade e menor preço!</p>

                <Link
                    href="/produtos"
                    className="bg-white text-black text-sm sm:text-base font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    Ver todos os produtos
                </Link>
            </div>
        </section>
    );
}
