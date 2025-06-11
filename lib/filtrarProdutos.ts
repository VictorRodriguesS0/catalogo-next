// lib/filtrarProdutos.ts
import { Product } from "./fetchProducts";

interface Filtros {
  busca?: string;
  categoria?: string;
  categoriaMae?: string;
  marca?: string;
  cor?: string;
  destaque?: boolean;
  emPromocao?: boolean;
}

export function filtrarProdutos(
  produtos: Product[],
  filtros: Filtros
): Product[] {
  return produtos.filter((produto) => {
    const { busca, categoria, categoriaMae, marca, cor, destaque, emPromocao } =
      filtros;

    // 🔎 Filtro por busca
    if (busca && !produto.titulo.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    // 🧩 Filtro por categoria mãe e subcategoria
    if (categoriaMae && produto.categoriaMae !== categoriaMae) {
      return false;
    }

    if (categoria && produto.categoria !== categoria) {
      return false;
    }

    // 🏷️ Filtro por marca
    if (marca && produto.marca !== marca) {
      return false;
    }

    // 🎨 Filtro por cor
    if (cor && produto.cor !== cor) {
      return false;
    }

    // 🌟 Filtro por destaque
    if (destaque && !produto.destaque) {
      return false;
    }

    // 💥 Filtro por promoção
    if (emPromocao && !produto.promocao) {
      return false;
    }

    return true;
  });
}
