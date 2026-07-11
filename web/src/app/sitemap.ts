import { SITE_URL } from "@/lib/constants";
import { getItems, getCategories } from "@/lib/db";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();
  const { items } = await getItems({ pageSize: 50000 });

  const staticPages = [
    { url: SITE_URL, priority: 1, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/contact`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/mentions-legales`, priority: 0.1, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/politique-confidentialite`, priority: 0.1, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/conditions-utilisation`, priority: 0.1, changeFrequency: "yearly" as const },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${SITE_URL}/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const itemPages = items.map((item) => ({
    url: `${SITE_URL}/item/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...itemPages];
}
