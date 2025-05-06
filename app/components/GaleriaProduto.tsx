'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface GaleriaProdutoProps {
    imagens: string[];
    titulo: string;
}

export default function GaleriaProduto({ imagens, titulo }: GaleriaProdutoProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="w-full">
            {/* Swiper principal */}
            <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="mb-4 rounded-xl border overflow-hidden"
                style={{ maxHeight: '400px' }}
            >
                {imagens.map((img, i) => (
                    <SwiperSlide key={i}>
                        <img
                            src={img || '/fallback.png'}
                            alt={titulo}
                            className="w-full h-[400px] object-contain bg-white"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Miniaturas */}
            {imagens.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={Math.min(imagens.length, 4)}
                    watchSlidesProgress
                    className="mt-2"
                >
                    {imagens.map((img, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={img || '/fallback.png'}
                                alt={`Miniatura ${i + 1}`}
                                className="w-full h-20 object-contain border rounded-md cursor-pointer bg-white"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
