import Hero from './components/Hero';
import CarrosseisHome from './components/CorrosseisHome';
import Reviews from './components/Reviews';
import CategoriasDinamicas from './components/CategoriasDinamicas';
import Link from 'next/link';
import { FaTruck, FaWhatsapp, FaCreditCard } from 'react-icons/fa';
import { WHATSAPP_NUMERO } from '@/lib/whatsapp';

export const metadata = {
  title: 'Catálogo de Produtos | Sua Loja',
  description: 'Confira eletrônicos com preços imperdíveis e frete rápido para o DF.',
};

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-10">

      {/* HERO */}
      <Hero />

      {/* BENEFÍCIOS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-white">
        <div className="bg-purple-700 p-4 rounded-2xl shadow-md flex flex-col items-center">
          <FaTruck className="text-3xl mb-2" />
          <p className="font-semibold">Envio Imediato no DF</p>
        </div>
        <div className="bg-yellow-400 text-black p-4 rounded-2xl shadow-md flex flex-col items-center">
          <FaCreditCard className="text-3xl mb-2" />
          <p className="font-semibold">Parcelamento em até 18x</p>
        </div>
        <Link
          href={`https://wa.me/${WHATSAPP_NUMERO}`}
          target="_blank"
          className="bg-purple-700 p-4 rounded-2xl shadow-md flex flex-col items-center hover:opacity-90"
        >
          <FaWhatsapp className="text-3xl mb-2" />
          <p className="font-semibold">Atendimento no WhatsApp</p>
        </Link>
      </section>

      {/* CARROSSEIS */}
      <CarrosseisHome />

      {/* CATEGORIAS RÁPIDAS */}
      <CategoriasDinamicas />

      {/* AVALIAÇÕES REAIS */}
      <Reviews />
    </main>
  );
}
