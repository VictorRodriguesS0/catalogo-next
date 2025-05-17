'use client';

import Link from 'next/link';

export default function Hero() {
    return (
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
    );
}
