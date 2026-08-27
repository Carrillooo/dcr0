import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, byCategory, getCategory } from "@/data/products";
import { CategoryView } from "./CategoryView";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category as never);
  if (!c) return { title: "Not found" };
  return { title: c.name, description: c.mood };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = getCategory(category as never);
  if (!c) notFound();
  return <CategoryView category={c} products={byCategory(c.slug)} />;
}
