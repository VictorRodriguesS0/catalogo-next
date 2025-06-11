// lib/isProdutoAtivo.ts

import { Product } from './fetchProductsWoo';

/**
 * Retorna true se o produto estiver ativo (ou seja, não marcado como inativo e com estoque se aplicável).
 */
export function isProdutoAtivo(produto: Product): boolean {
    const inativo = String(produto.inativo || '').trim().toLowerCase();
    const semEstoque = produto.idTiny && produto.idTiny !== 'infinito' && (produto.estoqueSaldo ?? 0) <= 0;

    return inativo !== 'true' && !semEstoque;
}
