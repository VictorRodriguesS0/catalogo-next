// app/components/Reviews.tsx
'use client';

import { useEffect, useState } from 'react';
import { Review, fetchReviews } from '@/lib/fetchReviews';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import SkeletonCard from './SkeletonCard';

const CACHE_KEY = 'cached_reviews';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 90; // 90 dias (aproximadamente 3 meses)

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(CACHE_KEY + '_timestamp');
        const now = Date.now();

        const carregarReviews = async () => {
            const data = await fetchReviews();
            const embaralhado = shuffleArray(data);
            setReviews(embaralhado);
            localStorage.setItem(CACHE_KEY, JSON.stringify(embaralhado));
            localStorage.setItem(CACHE_KEY + '_timestamp', now.toString());
            setLoading(false);
        };

        if (cached && timestamp && now - parseInt(timestamp) < CACHE_TTL) {
            setReviews(shuffleArray(JSON.parse(cached)));
            setLoading(false);
        } else {
            carregarReviews();
        }
    }, []);

    useEffect(() => {
        if (reviews.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % reviews.length);
        }, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, [reviews]);

    if (loading) {
        return (
            <section className="bg-gray-50 p-6 rounded-xl shadow-md max-w-xl mx-auto mt-10">
                <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                    O que nossos clientes dizem
                </h2>
                <SkeletonCard />
            </section>
        );
    }

    if (reviews.length === 0) return null;

    const review = reviews[index];

    return (
        <section className="bg-gray-50 p-6 rounded-xl shadow-md max-w-xl mx-auto mt-10">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                O que nossos clientes dizem
            </h2>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center mb-2 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className="text-xl" />
                        ))}
                    </div>
                    <p className="text-sm text-gray-700 italic text-center">"{review.texto}"</p>
                    <p className="text-sm font-semibold text-right mt-2 text-gray-600">
                        — {review.nome}
                    </p>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
