import { redirect } from "next/navigation";

export default function SubcategoriaPage({
  params,
}: {
  params: { categoria: string; subcategoria: string };
}) {
  const { categoria, subcategoria } = params;

  const query = `?categoria=${encodeURIComponent(
    subcategoria
  )}&categoriaMae=${encodeURIComponent(categoria)}`;
  redirect(`/produtos${query}`);
}
