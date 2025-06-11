"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { useCatalogo } from "@/app/context/CatalogoContext";
import { motion, AnimatePresence } from "framer-motion";
import { filtrarProdutos } from "@/lib/filtrarProdutos";
import { Product } from "@/lib/fetchProducts";
import { useEffect, useRef, useState } from "react";

const LIMITE_INICIAL = 20;
const INCREMENTO = 20;

export default function ProductList() {
  const { produtos } = useCatalogo();
  const searchParams = useSearchParams();
  const [limite, setLimite] = useState(LIMITE_INICIAL);
  const sentinelaRef = useRef<HTMLDivElement | null>(null);

  const rawVisualizacao = searchParams.get("visualizacao");
  const visualizacao: "grade" | "lista" =
    rawVisualizacao === "lista" ? "lista" : "grade";

  const filtros = {
    categoria: searchParams.get("categoria")?.toLowerCase() || "",
    busca: searchParams.get("busca")?.toLowerCase() || "",
    marcas: searchParams.getAll("marca").map((m) => m.toLowerCase()),
    cores: searchParams.getAll("cor").map((c) => c.toLowerCase()),
    destaque: searchParams.get("destaque") === "true",
    promocao: searchParams.get("promocao") === "true",
    tem5g: searchParams.get("5g") === "true",
    temNFC: searchParams.get("nfc") === "true",
  };

  const ordenarParam = searchParams.get("ordenar") || "";
  const ordenarMap: Record<string, string> = {
    "menor-preco": "preco-asc",
    "maior-preco": "preco-desc",
    "a-z": "az",
    "z-a": "za",
  };
  const ordenar = ordenarMap[ordenarParam] || "";

  const produtosFiltrados = filtrarProdutos(
    produtos.filter(
      (p) =>
        p.disponivel !== false && String(p.inativo).toLowerCase() !== "true"
    ),
    filtros
  );

  function getValorParaOrdenacao(produto: Product): number {
    const valor = produto.promocao ?? produto.valor;
    return Number(valor);
  }

  function ordenarProdutos(lista: Product[], criterio: string) {
    return [...lista].sort((a, b) => {
      const valorA = getValorParaOrdenacao(a);
      const valorB = getValorParaOrdenacao(b);

      switch (criterio) {
        case "preco-asc":
          if (isNaN(valorA)) return 1;
          if (isNaN(valorB)) return -1;
          return valorA - valorB;
        case "preco-desc":
          if (isNaN(valorA)) return 1;
          if (isNaN(valorB)) return -1;
          return valorB - valorA;
        case "az":
          return a.titulo.localeCompare(b.titulo);
        case "za":
          return b.titulo.localeCompare(a.titulo);
        default:
          return 0;
      }
    });
  }

  const produtosOrdenados = ordenarProdutos(produtosFiltrados, ordenar);

  const produtosPorCategoria = produtosOrdenados.reduce(
    (acc: Record<string, Product[]>, produto) => {
      const categoria = produto.categoria || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(produto);
      return acc;
    },
    {}
  );

  // Scroll infinito
  useEffect(() => {
    if (!sentinelaRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimite((prev) => prev + INCREMENTO);
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelaRef.current);
    return () => observer.disconnect();
  }, []);

  return produtosOrdenados.length > 0 ? (
    <div className="space-y-10 font-sans">
      {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => {
        const visiveis = produtos.slice(0, limite);
        const exibirSentinela = produtos.length > visiveis.length;

        return (
          <div key={categoria}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {categoria}
            </h2>

            <div
              className={
                visualizacao === "grade"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              <AnimatePresence>
                {visiveis.map((produto) => (
                  <motion.div
                    key={produto.slug}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      product={{
                        ...produto,
                        imagemPrincipal: produto.imagemPrincipal || "",
                      }}
                      visualizacao={visualizacao}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {exibirSentinela && <div ref={sentinelaRef} className="h-10" />}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-gray-600 text-sm">
      Nenhum produto encontrado.
    </p>
  );
}
