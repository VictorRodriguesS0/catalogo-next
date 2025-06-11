// app/components/HeaderCategorias.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCatalogo } from "@/app/context/CatalogoContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// mesmo tipo usado no getCatalogoData.ts
interface CategoriaNode {
  id: number;
  nome: string;
  slug: string;
  parent: number;
  imagem: string | null;
  filhos: CategoriaNode[];
}

export default function HeaderCategorias() {
  const { categorias } = useCatalogo();
  const pathname = usePathname();
  const [dropdownAberto, setDropdownAberto] = useState<number | null>(null);

  if (!categorias || categorias.length === 0) return null; // <-- evita erro no .map()

  const tree = categorias; // já está no formato certo após getCatalogoData

  return (
    // ...restante do código

    <div className="w-full bg-white z-30 border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-4 relative">
        <Link
          href="/produtos"
          className={`text-sm font-medium hover:underline ${
            pathname === "/produtos" ? "text-blue-600" : "text-gray-700"
          }`}
        >
          Ver todos os produtos
        </Link>

        {tree.map((categoriaMae) => {
          const aberta = dropdownAberto === categoriaMae.id;
          const temFilhos = categoriaMae.filhos.length > 0;

          return (
            <div key={categoriaMae.id} className="relative text-sm">
              <button
                onClick={() =>
                  temFilhos
                    ? setDropdownAberto(aberta ? null : categoriaMae.id)
                    : (window.location.href = `/produtos?categoriaMae=${categoriaMae.slug}`)
                }
                className={`flex items-center gap-1 font-medium hover:underline transition ${
                  pathname.includes(categoriaMae.slug)
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {categoriaMae.nome}
                {temFilhos && (
                  <motion.span
                    animate={{ rotate: aberta ? 180 : 0 }}
                    className="transition-transform"
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {temFilhos && aberta && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded z-40"
                  >
                    <ul className="divide-y divide-gray-100">
                      <li>
                        <Link
                          href={`/produtos?categoriaMae=${categoriaMae.slug}`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
                        >
                          Ver tudo
                        </Link>
                      </li>
                      {categoriaMae.filhos.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/produtos?categoriaMae=${categoriaMae.slug}&categoria=${sub.slug}`}
                            className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                              pathname.includes(sub.slug)
                                ? "text-blue-600"
                                : "text-gray-800"
                            }`}
                          >
                            {sub.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
