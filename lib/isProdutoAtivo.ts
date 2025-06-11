// lib/isProdutoAtivo.ts

import { Product } from './fetchProductsWoo';

/**
 * Retorna true se o produto estiver ativo (ou seja, não marcado como inativo).
 */
export function isProdutoAtivo(produto: Product): boolean {
    const inativo = String(produto.inativo || '').trim().toLowerCase();
    return inativo !== 'true';
}
