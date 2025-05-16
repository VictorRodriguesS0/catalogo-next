'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import ProductCard from './ProductCard';
import { Product } from '@/lib/fetchProducts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    titulo: string;
    produtos: Product[];
}

export default function ProductCarousel({ titulo, produtos }: Props) {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        slides: {
            perView: 1.3,
            spacing: 12,
        },
        breakpoints: {
            '(min-width: 640px)': {
                slides: { perView: 2.5, spacing: 16 },
            },
            '(min-width: 1024px)': {
                slides: { perView: 3.5, spacing: 20 },
            },
        },
    });

    if (produtos.length === 0) return null;

    return (
        <section className="relative space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 px-2">{titulo}</h2>

            {/* Setas */}
            <button
                onClick={() => slider.current?.prev()}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white border border-gray-300 shadow p-2 rounded-full z-10 hover:bg-gray-100 transition sm:-left-6"
                title="Voltar"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <button
                onClick={() => slider.current?.next()}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white border border-gray-300 shadow p-2 rounded-full z-10 hover:bg-gray-100 transition sm:-right-6"
                title="Avançar"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            <div
                ref={sliderRef}
                className="keen-slider bg-gray-50 rounded-xl p-2 sm:p-4 shadow-sm"
            >
                {produtos.map((p) => (
                    <div
                        key={p.slug}
                        className="keen-slider__slide h-full flex flex-col"
                        style={{ minWidth: 0 }}
                    >
                        <div className="h-full w-full">
                            <ProductCard product={p} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
