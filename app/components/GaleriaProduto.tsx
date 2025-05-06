'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface GaleriaProdutoProps {
    imagens: string[];
    titulo: string;
}

export default function GaleriaProduto({ imagens, titulo }: GaleriaProdutoProps) {
    const [imagemSelecionada, setImagemSelecionada] = useState(imagens[0]);

    if (!imagens || imagens.length === 0) return null;

    if (imagens.length === 1) {
        return (
            <div className="w-full rounded-xl overflow-hidden shadow-sm border">
                <Image
                    src={imagens[0]}
                    alt={titulo}
                    width={800}
                    height={800}
                    className="w-full object-contain rounded-xl"
                />
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="rounded-xl border overflow-hidden">
                <Image
                    src={imagemSelecionada}
                    alt={titulo}
                    width={800}
                    height={800}
                    className="w-full object-contain rounded-xl transition-all duration-300"
                />
            </div>

            <Swiper
                spaceBetween={12}
                slidesPerView={imagens.length < 4 ? imagens.length : 4}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                className="w-full"
            >
                {imagens.map((img, index) => (
                    <SwiperSlide key={index}>
                        <button
                            onClick={() => setImagemSelecionada(img)}
                            className={`border rounded-lg overflow-hidden focus:outline-none ${img === imagemSelecionada ? 'ring-2 ring-green-500' : ''
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${titulo} - ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-24 object-contain bg-white"
                            />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
