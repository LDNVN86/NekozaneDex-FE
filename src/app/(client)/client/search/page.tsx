import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    genres?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  // Build redirect URL to /client/stories
  const urlParams = new URLSearchParams();
  if (params.q) urlParams.set("q", params.q);
  if (params.genres) urlParams.set("genre", params.genres);
  if (params.page) urlParams.set("page", params.page);

  const query = urlParams.toString();
  redirect(`/client/stories${query ? `?${query}` : ""}`);
}
