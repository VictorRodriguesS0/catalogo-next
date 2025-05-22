'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    Menu,
    X,
    Calculator,
    Scale,
    ShoppingBag,
    PhoneCall,
    MapPin,
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useEffect, useState, useRef, type Dispatch, type SetStateAction } from 'react';
import getIconeCategoria from '@/lib/IconeCategoria';
import { AnimatePresence, motion } from 'framer-motion';
import { loja } from '@/app/config/lojaConfig';

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false });

type MenuEstrutura = Record<string, string[]>;

export default function HeaderTop({
    menuAberto,
    setMenuAberto,
}: {
    menuAberto: boolean;
    setMenuAberto: Dispatch<SetStateAction<boolean>>;
}) {
    const [menu, setMenu] = useState<MenuEstrutura>({});
    const asideRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef(0);

    useEffect(() => {
        async function fetchMenu() {
            const res = await fetch('/api/categorias');
            const data = await res.json();
            setMenu(data);
        }
        fetchMenu();
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuAberto(false);
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [setMenuAberto]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > 50) setMenuAberto(false);
    };

    return (
        <>
            <div className="flex items-center justify-between px-6 py-4 gap-4">
                <Link href="/" aria-label="Página inicial">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                    />
                </Link>

                <div className="flex-1 flex justify-center">
                    <SearchBox />
                </div>

                <button
                    onClick={() => setMenuAberto(true)}
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                    aria-label="Abrir menu"
                >
                    <Menu size={28} />
                </button>
            </div>

            <AnimatePresence>
                {menuAberto && (
                    <motion.aside
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
                        onClick={() => setMenuAberto(false)}
                        aria-modal="true"
                        role="dialog"
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            className="relative bg-white w-72 h-full p-6 shadow-md flex flex-col overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            ref={asideRef}
                        >
                            <button
                                onClick={() => setMenuAberto(false)}
                                className="fixed bottom-4 right-4 z-50 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                                aria-label="Fechar menu"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Menu</h2>
                            </div>

                            <div className="mb-6">
                                <Link
                                    href="/produtos"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                                >
                                    <ShoppingBag size={16} /> Ver todos os produtos
                                </Link>
                            </div>

                            <ul className="space-y-4">
                                {Object.entries(menu).map(([categoria, subcategorias]) => {
                                    const subs = [...subcategorias];
                                    const xiaomiIndex = subs.findIndex(
                                        (s) => s.toLowerCase() === 'xiaomi'
                                    );
                                    if (xiaomiIndex > 0) {
                                        const [xiaomi] = subs.splice(xiaomiIndex, 1);
                                        subs.unshift(xiaomi);
                                    }
                                    return (
                                        <li key={categoria}>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                                <span className="text-gray-500">
                                                    {getIconeCategoria(categoria)}
                                                </span>
                                                {categoria}
                                            </div>

                                            <ul className="mt-3 pl-4 pr-3 space-y-2">
                                                <li>
                                                    <Link
                                                        href={`/produtos?categoria=${encodeURIComponent(
                                                            categoria
                                                        )}`}
                                                        onClick={() => setMenuAberto(false)}
                                                        className="block text-sm text-blue-600 font-medium hover:underline"
                                                    >
                                                        Ver tudo
                                                    </Link>
                                                </li>
                                                {subs.map((sub) => (
                                                    <li key={sub}>
                                                        <Link
                                                            href={`/categorias/${encodeURIComponent(
                                                                categoria
                                                            )}/${encodeURIComponent(sub)}`}
                                                            onClick={() => setMenuAberto(false)}
                                                            className="block text-sm text-gray-700 hover:underline"
                                                        >
                                                            {sub}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-10 border-t pt-6 space-y-5">
                                <Link
                                    href="/calculadora"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                                >
                                    <Calculator size={16} /> Calculadora de Parcelas
                                </Link>
                                <Link
                                    href="/comparar"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                                >
                                    <Scale size={16} /> Comparar produtos
                                </Link>
                                <Link
                                    href={`https://wa.me/${loja.whatsapp}`}
                                    target="_blank"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    <SiWhatsapp className="text-lg" /> Falar no WhatsApp
                                </Link>
                                <Link
                                    href={`tel:+${loja.whatsapp}`}
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                                >
                                    <PhoneCall size={16} /> Ligue para a loja
                                </Link>
                                <Link
                                    href={loja.redes.maps}
                                    target="_blank"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                                >
                                    <MapPin size={16} /> Ir até a loja
                                </Link>
                            </div>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
