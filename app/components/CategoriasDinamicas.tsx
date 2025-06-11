"use client";

import Link from "next/link";
import { useState } from "react";
import { useCatalogo } from "@/app/context/CatalogoContext";

export default function CategoriasDinamicas() {
  const { categorias } = useCatalogo();
  const [mostrarTodas, setMostrarTodas] = useState(false);

  if (!categorias || categorias.length === 0) return null;

  const categoriasPrincipais = categorias.filter((c) => c.parent === 0);
  const visiveis = mostrarTodas
    ? categoriasPrincipais
    : categoriasPrincipais.slice(0, 8);

  const cores = ["bg-purple-100", "bg-yellow-100"];

  return (
    <section className="flex flex-col items-center gap-4 mt-6">
      <div className="flex flex-wrap justify-center gap-4 text-center">
        {visiveis.map((categoria, i) => {
          const subcategorias = categorias
            .filter((c) => c.parent === categoria.id)
            .sort((a, b) => a.name.localeCompare(b.name));

          return (
            <div key={categoria.id} className="flex flex-col items-center">
              <Link
                href={`/categorias/${categoria.slug}`}
                aria-label={`Categoria ${categoria.name}`}
                className={`${
                  cores[i % cores.length]
                } hover:scale-105 transition rounded-xl px-6 py-4 font-medium min-w-[120px]`}
              >
                {categoria.name}
              </Link>

              {subcategorias.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1 justify-center text-sm">
                  {subcategorias.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/categorias/${categoria.slug}/${sub.slug}`}
                      aria-label={`Subcategoria ${sub.name}`}
                      className="text-blue-600 hover:underline"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {categoriasPrincipais.length > 8 && (
        <button
          onClick={() => setMostrarTodas((v) => !v)}
          className="text-sm text-blue-600 underline mt-2 hover:text-blue-800"
        >
          {mostrarTodas ? "Ver menos" : "Ver todas as categorias"}
        </button>
      )}
    </section>
  );
}
