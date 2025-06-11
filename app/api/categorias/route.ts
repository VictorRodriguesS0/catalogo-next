import { fetchProducts } from "@/lib/fetchProducts";
import { NextResponse } from "next/server";
import { isProdutoAtivo } from "@/lib/isProdutoAtivo";

export async function GET() {
  const produtos = await fetchProducts();

  // Estrutura usando Map para garantir unicidade e facilitar ordenação
  const estrutura = new Map<string, Set<string>>();

  for (const p of produtos) {
    if (!p.categoriaPrincipal || !isProdutoAtivo(p)) continue;

    const categoria = p.categoriaPrincipal.trim();
    const subcategoria = p.categorias?.[1]?.trim();

    if (!estrutura.has(categoria)) {
      estrutura.set(categoria, new Set());
    }

    if (subcategoria) {
      estrutura.get(categoria)?.add(subcategoria);
    }
  }

  const resultado: Record<string, string[]> = {};
  for (const [categoria, subcategorias] of estrutura.entries()) {
    resultado[categoria] = Array.from(subcategorias).sort();
  }

  return NextResponse.json(resultado);
}
