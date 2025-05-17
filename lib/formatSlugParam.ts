export function formatSlugParam(valor: string) {
    return valor.replace(/-/g, ' ').toLowerCase();
}
