"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCatalogo } from "@/app/context/CatalogoContext";
import { Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { produtos, categorias } = useCatalogo();

  const segments = pathname.split("/").filter(Boolean);
  if (pathname === "/") return null;

  const termoBusca = searchParams.get("busca");
  const categoriaParam = searchParams.get("categoria");
  const categoriaMaeParam = searchParams.get("categoriaMae");

  const crumbs: Crumb[] = [{ label: "Início", href: "/" }];

  // Caso de busca
  const isPaginaBusca =
    termoBusca &&
    !pathname.startsWith("/produtos/") &&
    !pathname.startsWith("/categorias/") &&
    !segments.some((seg) => produtos.some((p) => p.slug === seg));

  if (isPaginaBusca) {
    crumbs.push({ label: "Produtos", href: "/produtos" });
    crumbs.push({ label: `Resultados para "${termoBusca}"` });
  }
  // Página de produto
  else if (segments[0] === "produtos" && segments[1]) {
    const produto = produtos.find((p) => p.slug === segments[1]);
    if (produto) {
      crumbs.push({ label: "Produtos", href: "/produtos" });
      const categoria = produto.categoriaPrincipal;
      if (categoria) {
        const catObj = categorias.find(
          (c) => c.name.toLowerCase() === categoria.toLowerCase()
        );
        if (catObj) {
          crumbs.push({
            label: catObj.name,
            href: `/categorias/${catObj.slug}`,
          });
        }
      }
      crumbs.push({ label: produto.titulo });
    }
  }
  // Página de categoria por query string
  else if (pathname === "/produtos" && categoriaParam) {
    crumbs.push({ label: "Produtos", href: "/produtos" });

    const cat = categorias.find((c) => c.slug === categoriaParam);
    const nomeCategoria = cat?.name || categoriaParam;

    const catMae =
      categoriaMaeParam && categorias.find((c) => c.slug === categoriaMaeParam);
    if (catMae) {
      crumbs.push({
        label: catMae.name,
        href: `/categorias/${catMae.slug}`,
      });
    }

    crumbs.push({ label: nomeCategoria });
  }
  // Página de categoria por rota: /categorias/[categoria]/[subcategoria]
  else if (segments[0] === "categorias") {
    crumbs.push({ label: "Produtos", href: "/produtos" });

    const categoriaSlug = segments[1];
    const subcategoriaSlug = segments[2];

    const categoria = categorias.find((c) => c.slug === categoriaSlug);
    const subcategoria = categorias.find((c) => c.slug === subcategoriaSlug);

    if (categoria) {
      crumbs.push({
        label: categoria.name,
        href: `/categorias/${categoria.slug}`,
      });
    }

    if (subcategoria) {
      crumbs.push({
        label: subcategoria.name,
        href: `/categorias/${categoriaSlug}/${subcategoria.slug}`,
      });
    }
  }
  // Página base de produtos
  else if (pathname === "/produtos") {
    crumbs.push({ label: "Produtos" });
  }

  return (
    <nav
      className="text-sm mt-4 mb-6 max-w-6xl mx-auto px-4"
      aria-label="breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-1 text-gray-500">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-300 mx-1">→</span>}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                {index === 0 && <Home size={14} className="mt-[1px]" />}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-gray-600">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
