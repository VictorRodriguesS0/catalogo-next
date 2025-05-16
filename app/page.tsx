import Hero from './components/Hero';
import CarrosseisHome from './components/CorrosseisHome';

export const metadata = {
  title: 'Catálogo de Produtos | Sua Loja',
  description: 'Confira eletrônicos com preços imperdíveis e frete rápido para o DF.',
};

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-8">

      {/* HERO COM GRADIENTE OU IMAGEM */}
      <Hero />

      {/* CARROSSEIS */}
      <CarrosseisHome />

      {/* TEXTO PARA SEO */}
      <section className="mt-10 text-center text-sm text-gray-600 max-w-2xl mx-auto px-4">
        <p>
          Somos especializados na venda de celulares, tablets e eletrônicos com envio imediato para o DF.
          Todos os produtos possuem nota fiscal e garantia. Atendimento rápido via WhatsApp e pagamento
          facilitado com parcelamento em até 12x.
        </p>
      </section>
    </main>
  );
}
