"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

type Props = {
    imagens: string[];
    titulo: string;
};

export default function GaleriaProduto({ imagens, titulo }: Props) {
    if (!imagens.length) return null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={16}
                slidesPerView={1}
                className="rounded-xl overflow-hidden"
            >
                {imagens.map((src, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100">
                            <Image
                                src={src}
                                alt={`${titulo} ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 512px"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
