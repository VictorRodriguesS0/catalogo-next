import { redirect } from "next/navigation";

export default function CategoriaPage({
  params,
}: {
  params: { categoria: string };
}) {
  const { categoria } = params;

  const query = `?categoria=${encodeURIComponent(categoria)}`;
  redirect(`/produtos${query}`);
}
