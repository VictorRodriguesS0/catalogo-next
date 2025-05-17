import { redirect } from 'next/navigation';

export default async function SubcategoriaPage({
    params,
}: {
    params: Promise<{ categoria: string; subcategoria: string }>;
}) {
    const { categoria, subcategoria } = await params;

    const query = `?categoria=${encodeURIComponent(categoria)}&busca=${encodeURIComponent(subcategoria)}`;
    redirect(`/produtos${query}`);
}
