'use client';

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
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="rounded-xl overflow-hidden"
        >
            {imagens.map((url, index) => (
                <SwiperSlide key={index}>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={url}
                            alt={`${titulo} imagem ${index + 1}`}
                            fill
                            className="object-cover rounded-xl"
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
