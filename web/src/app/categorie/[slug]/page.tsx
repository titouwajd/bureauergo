import Link from "next/link";
import { Metadata } from "next";
import { getCategoryBySlug, getItems, getCategories } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> = null;
  try { category = await getCategoryBySlug(slug); } catch (e) { console.error("DB unavailable for getCategoryBySlug:", e); }
  if (!category) {
    return { title: "Catégorie non trouvée" };
  }
  return {
    title: `${category.name} - Comparatif et meilleurs prix`,
    description: category.description || `Découvrez notre sélection de ${category.name.toLowerCase()}. Comparatif, avis et meilleurs prix.`,
    alternates: { canonical: `${SITE_URL}/categorie/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> = null;
  try { category = await getCategoryBySlug(slug); } catch (e) { console.error("DB unavailable for getCategoryBySlug:", e); }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
        <p className="text-gray-600 mb-6">Cette catégorie n&apos;existe pas ou a été supprimée.</p>
        <Link href="/" className="text-blue-600 hover:underline">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const page = Number(sp.page) || 1;
  const sort = sp.sort || "rating_desc";
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const minRating = sp.minRating ? Number(sp.minRating) : undefined;
  const query = sp.q;

  let items: Awaited<ReturnType<typeof getItems>>["items"] = [];
  let total = 0;
  try {
    const result = await getItems({
      category: slug,
      page,
      pageSize: 20,
      sort,
      minPrice,
      maxPrice,
      minRating,
      query,
    });
    items = result.items;
    total = result.total;
  } catch (e) { console.error("DB unavailable for getItems:", e); }

  const totalPages = Math.ceil(total / 20);
  let allCategories: Array<{ id: number; name: string; slug: string; item_count: number }> = [];
  try { allCategories = await getCategories() as any; } catch (e) { console.error("DB unavailable for getCategories:", e); }

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/categorie/${slug}`,
    numberOfItems: total,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: item.title,
        url: `${SITE_URL}/item/${item.slug}`,
        ...(item.price ? { offers: { "@type": "Offer", price: item.price, priceCurrency: "EUR" } } : {}),
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: category.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-6">{category.description}</p>
      )}

      {query && (
        <p className="text-sm text-gray-500 mb-4">
          Recherche : &quot;{query}&quot; — {total} résultat{total > 1 ? "s" : ""}
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0">
          <FilterSidebar
            categories={allCategories}
            currentCategory={slug}
            currentSort={sort}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentMinRating={minRating}
          />
        </aside>

        {/* Items grid */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg mb-4">Aucun produit trouvé</p>
              <Link href={`/categorie/${slug}`} className="text-blue-600 hover:underline">
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {total} produit{total > 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-mobile" className="text-sm text-gray-600 lg:hidden">Trier :</label>
                  <select
                    id="sort-mobile"
                    defaultValue={sort}
                    onChange={(e) => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("sort", e.target.value);
                      window.location.href = url.toString();
                    }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 lg:hidden"
                  >
                    <option value="rating_desc">Meilleures notes</option>
                    <option value="popular">Plus populaires</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="recent">Plus récents</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item, i) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/categorie/${slug}`}
                searchParams={sp}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
