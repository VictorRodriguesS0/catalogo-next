export function formatPreco(valor: string | undefined): string {
    if (!valor) return '';
    const valorNumerico = valor.replace(/[^\d,.-]/g, '').replace(',', '.');
    const numero = parseFloat(valorNumerico);
    if (isNaN(numero)) return '';
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
}
