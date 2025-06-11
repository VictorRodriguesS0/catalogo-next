// Componente restaurado com o visual original e correção do uso de `promocao` ao invés de `emPromocao`
"use client";

import { useCatalogo } from "@/app/context/CatalogoContext";
import ProductCarousel from "./ProductCarousel";
import { useEffect, useState } from "react";
import SkeletonProductCard from "./SkeletonProductCard";
import { isProdutoAtivo } from "@/lib/isProdutoAtivo";

export default function CarrosseisHome() {
  const { produtos } = useCatalogo();
  const [visualizacao, setVisualizacao] = useState<"grade" | "lista">("grade");

  useEffect(() => {
    const stored = localStorage.getItem("visualizacao");
    if (stored === "lista" || stored === "grade") {
      setVisualizacao(stored);
    }
  }, []);

  function alterarVisualizacao(tipo: "grade" | "lista") {
    setVisualizacao(tipo);
    localStorage.setItem("visualizacao", tipo);
  }

  const produtosAtivos = produtos.filter(isProdutoAtivo);
  const produtosDestaque = produtosAtivos.filter((p) => p.destaque);
  const produtosPromocao = produtosAtivos.filter((p) => p.promocao);
  const isCarregando = produtos.length === 0;

  return (
    <section className="space-y-8">
      <div className="flex justify-end items-center gap-2 text-sm text-gray-700 mb-2 pr-2">
        <button
          onClick={() => alterarVisualizacao("grade")}
          className={`px-2 py-1 rounded border ${
            visualizacao === "grade"
              ? "bg-blue-600 text-white"
              : "bg-white border-gray-300"
          }`}
          title="Visualização em grade"
        >
          🔳
        </button>
        <button
          onClick={() => alterarVisualizacao("lista")}
          className={`px-2 py-1 rounded border ${
            visualizacao === "lista"
              ? "bg-blue-600 text-white"
              : "bg-white border-gray-300"
          }`}
          title="Visualização em lista"
        >
          📄
        </button>
      </div>

      {isCarregando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <ProductCarousel
            titulo="🌟 Destaques da loja"
            produtos={produtosDestaque}
            visualizacao={visualizacao}
          />
          <ProductCarousel
            titulo="🔥 Promoções especiais"
            produtos={produtosPromocao}
            visualizacao={visualizacao}
          />
        </>
      )}
    </section>
  );
}
