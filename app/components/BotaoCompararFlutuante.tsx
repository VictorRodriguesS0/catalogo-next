'use client';

import { useComparar } from '@/app/context/CompararContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BotaoCompararFlutuante() {
    const { comparar, modoComparar } = useComparar();

    const quantidade = comparar.length;
    const deveExibir = modoComparar && quantidade > 0;

    if (!deveExibir) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 right-4 z-50"
            >
                <Link
                    href="/comparar"
                    aria-label="Ir para comparação de produtos"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm sm:text-base font-medium shadow-lg hover:bg-blue-700 transition"
                    title="Ir para comparação"
                >
                    Comparar ({quantidade})
                </Link>
            </motion.div>
        </AnimatePresence>
    );
}
