import { redirect } from "next/navigation";

type AdminPageProps = {
  params: {
    categoryId: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

function readItemParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const raw = searchParams?.item;
  return Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
}

export default function AdminMenuCategoryRedirectPage({
  params,
  searchParams,
}: AdminPageProps) {
  const item = readItemParam(searchParams);
  const destination = `/admin/menu?category=${params.categoryId}${item ? `&item=${item}` : ""}`;

  redirect(destination);
}
