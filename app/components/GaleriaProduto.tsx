'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

interface GaleriaProdutoProps {
    imagens: string[];
    titulo: string;
}

export default function GaleriaProduto({ imagens, titulo }: GaleriaProdutoProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="w-full overflow-hidden">
            <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="mb-4 rounded-xl border overflow-hidden max-h-[400px] max-w-full"
            >
                {imagens.map((img, i) => (
                    <SwiperSlide key={i}>
                        <div className="relative w-full h-[400px] bg-white">
                            <Image
                                src={img || '/fallback.png'}
                                alt={titulo}
                                fill
                                className="object-contain"
                                sizes="100%"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {imagens.length > 1 && (
                <Swiper
                    onSwiper={(swiper) => setThumbsSwiper(swiper)}
                    spaceBetween={10}
                    slidesPerView={Math.min(imagens.length, 4)}
                    watchSlidesProgress
                    className="mt-2 max-w-full"
                >
                    {imagens.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative w-full h-20 bg-white border rounded-md">
                                <Image
                                    src={img || '/fallback.png'}
                                    alt={`Miniatura ${i + 1}`}
                                    fill
                                    className="object-contain cursor-pointer rounded-md"
                                    sizes="100%"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
