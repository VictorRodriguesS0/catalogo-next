'use client';

import { useComparar } from '@/app/context/CompararContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BotaoCompararFlutuante() {
    const { comparar } = useComparar();

    if (comparar.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
        >
            <Link
                href="/comparar"
                className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                title="Ver comparação"
            >
                Comparar ({comparar.length})
            </Link>
        </motion.div>
    );
}
