import Link from "next/link";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import type { ProductRow } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique — Guides & Templates",
  description: "Découvrez nos guides et templates pour améliorer votre confort au travail. Achetez et téléchargez instantanément.",
  alternates: { canonical: `${SITE_URL}/boutique` },
};

async function getProducts(): Promise<ProductRow[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function BoutiquePage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Boutique — Guides &amp; Templates
        </h1>
        <p className="text-lg text-gray-600">
          Des ressources digitales pour améliorer votre confort et votre productivité au travail.
          Téléchargement immédiat après achat.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-lg mb-2">Aucun produit disponible</p>
          <p className="text-gray-400 text-sm">
            Revenez bientôt pour découvrir nos nouveaux guides et templates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/boutique/${product.slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {product.image_path ? (
                  <img
                    src={product.image_path}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Category badge */}
                {product.category && (
                  <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                )}

                {/* Sales count */}
                {product.sales_count > 0 && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {product.sales_count} vente{product.sales_count > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price.toFixed(2)}€
                  </span>
                  <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Acheter →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
