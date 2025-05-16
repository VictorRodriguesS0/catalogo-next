// lib/filtrarProdutos.ts

import { Product } from './fetchProducts';

interface Filtros {
    categoria?: string;
    busca?: string;
    marcas?: string[];
    cores?: string[];
    destaque?: boolean;
    promocao?: boolean;
}

export function filtrarProdutos(produtos: Product[], filtros: Filtros) {
    const {
        categoria = '',
        busca = '',
        marcas = [],
        cores = [],
        destaque = false,
        promocao = false,
    } = filtros;

    return produtos.filter((produto) => {
        const matchCategoria =
            categoria === 'promoções'
                ? produto.emPromocao
                : categoria
                    ? produto.categoria?.toLowerCase() === categoria
                    : true;

        const matchBusca =
            busca === '' ||
            produto.titulo.toLowerCase().includes(busca) ||
            produto.descricao?.toLowerCase().includes(busca) ||
            produto.categoria?.toLowerCase().includes(busca);

        const matchMarca = marcas.length === 0 || marcas.includes(produto.marca?.toLowerCase() || '');
        const matchCor = cores.length === 0 || cores.includes(produto.cor?.toLowerCase() || '');
        const matchDestaque = !destaque || produto.destaque;
        const matchPromocao = !promocao || produto.emPromocao;

        return matchCategoria && matchBusca && matchMarca && matchCor && matchDestaque && matchPromocao;
    });
}
