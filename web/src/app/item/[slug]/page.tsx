import Link from "next/link";
import { Metadata } from "next";
import { getItemBySlug, getSimilarItems, getCategories } from "@/lib/db";
import { SITE_URL, ADSENSE_ENABLED } from "@/lib/constants";
import StarRating from "@/components/StarRating";
import Breadcrumbs from "@/components/Breadcrumbs";
import ItemCard from "@/components/ItemCard";
import CopyLinkButton from "@/components/CopyLinkButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let item: Awaited<ReturnType<typeof getItemBySlug>> = null;
  try { item = await getItemBySlug(slug); } catch (e) { console.error("DB unavailable for getItemBySlug:", e); }
  if (!item) return { title: "Produit non trouvé" };

  return {
    title: `${item.title} - Comparatif et meilleur prix`,
    description: item.description?.slice(0, 160) || `Découvrez ${item.title}. Note : ${item.rating}/5 sur ${item.review_count} avis. Prix : ${item.price}€. Comparatif et meilleur prix.`,
    alternates: { canonical: `${SITE_URL}/item/${slug}` },
    openGraph: {
      title: item.title,
      description: item.description?.slice(0, 200),
      images: item.image_path ? [item.image_path] : [],
    },
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  let item: Awaited<ReturnType<typeof getItemBySlug>> = null;
  try { item = await getItemBySlug(slug); } catch (e) { console.error("DB unavailable for getItemBySlug:", e); }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <p className="text-gray-600 mb-6">Ce produit n&apos;existe pas ou a été retiré.</p>
        <Link href="/" className="text-blue-600 hover:underline">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  let similarItems: Awaited<ReturnType<typeof getSimilarItems>> = [];
  try { similarItems = await getSimilarItems(item.category_id, item.id, 6); } catch (e) { console.error("DB unavailable for getSimilarItems:", e); }

  // JSON-LD Product schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.description,
    image: item.image_path ? `${SITE_URL}${item.image_path}` : undefined,
    brand: item.brand ? { "@type": "Brand", name: item.brand } : undefined,
    ...(item.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: item.rating,
            reviewCount: item.review_count,
            bestRating: "5",
          },
        }
      : {}),
    ...(item.price
      ? {
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: item.currency || "EUR",
            availability: item.availability === "In stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: item.original_url,
          },
        }
      : {}),
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
          {
            label: item.category_name || "Catégorie",
            href: `/categorie/${item.category_slug}`,
          },
          { label: item.title },
        ]}
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            {item.image_path ? (
              <img
                src={item.image_path}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center p-8">
                <svg className="w-20 h-20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Image non disponible</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {item.brand && (
              <p className="text-sm text-blue-600 font-medium mb-2">{item.brand}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {item.title}
            </h1>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={item.rating} size="md" showValue />
                <span className="text-sm text-gray-500">
                  ({item.review_count.toLocaleString()} avis)
                </span>
              </div>
            )}

            {/* Price */}
            {item.price ? (
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  {item.price.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Prix de référence. Mis à jour le{" "}
                  {item.price_updated_at
                    ? new Date(item.price_updated_at).toLocaleDateString("fr-FR")
                    : new Date(item.updated_at).toLocaleDateString("fr-FR")}
                  .
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-lg text-gray-500">Prix non disponible</p>
              </div>
            )}

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  item.availability === "In stock" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {item.availability === "In stock" ? "En stock" : "Rupture de stock"}
              </span>
            </div>

            {/* Affiliate button */}
            <a
              href={`/api/go/${item.id}`}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 mb-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Voir l&apos;offre
            </a>
            <p className="text-xs text-gray-400 text-center mb-6">
              En cliquant, vous serez redirigé vers le site partenaire. {SITE_URL.replace("https://", "")} peut percevoir une commission.
            </p>

            {/* Source info */}
            <div className="text-xs text-gray-400 mb-6 p-3 bg-gray-50 rounded-lg">
              <p>
                Source : {item.source_name}{" "}
                <a
                  href={item.original_url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="text-blue-500 hover:underline ml-1"
                >
                  Voir l&apos;original
                </a>
              </p>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Partager :</span>
              <CopyLinkButton />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <div className="prose prose-gray max-w-none text-gray-700">
            <p>{item.description || "Aucune description détaillée disponible pour ce produit."}</p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {item.price && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Prix</p>
                <p className="font-bold text-gray-900">{item.price.toFixed(2)}€</p>
              </div>
            )}
            {item.rating && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Note</p>
                <p className="font-bold text-gray-900">{item.rating}/5</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Avis</p>
              <p className="font-bold text-gray-900">{item.review_count.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Disponibilité</p>
              <p className="font-bold text-gray-900">
                {item.availability === "In stock" ? "En stock" : "Rupture"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AdSense between content */}
      {ADSENSE_ENABLED && (
        <div className="my-8 p-4 bg-gray-100 rounded-xl text-center text-sm text-gray-400">
          Publicité
        </div>
      )}

      {/* Similar products */}
      {similarItems.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarItems.map((similar) => (
              <ItemCard key={similar.id} item={similar} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Bottom */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-xl font-bold mb-2">
          Vous avez aimé ce produit ?
        </h2>
        <p className="text-blue-100 mb-4">
          Découvrez d&apos;autres produits dans la catégorie {item.category_name}.
        </p>
        <Link
          href={`/categorie/${item.category_slug}`}
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          Voir plus de {item.category_name}
        </Link>
      </div>
    </div>
  );
}
