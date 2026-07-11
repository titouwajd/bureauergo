import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import Breadcrumbs from "@/components/Breadcrumbs";
import CheckoutButton from "@/components/CheckoutButton";
import type { ProductRow } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<ProductRow | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Produit non trouvé" };
  }

  return {
    title: `${product.title} — Boutique`,
    description: product.description?.slice(0, 160) || `Achetez ${product.title} — ${product.price.toFixed(2)}€. Téléchargement immédiat.`,
    alternates: { canonical: `${SITE_URL}/boutique/${slug}` },
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 200),
      images: product.image_path ? [product.image_path] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Product schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image_path || undefined,
    category: product.category || undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/boutique/${slug}`,
    },
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
          { label: "Boutique", href: "/boutique" },
          { label: product.title },
        ]}
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            {product.image_path ? (
              <img
                src={product.image_path}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center p-8">
                <svg
                  className="w-20 h-20 mx-auto mb-2"
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
                <p>Image non disponible</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category badge */}
            {product.category && (
              <p className="text-sm text-blue-600 font-medium mb-2">
                {product.category}
              </p>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm text-gray-600 mb-6 max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {product.price.toFixed(2)}€
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Paiement sécurisé · Téléchargement immédiat après achat
              </p>
            </div>

            {/* Sales info */}
            {product.sales_count > 0 && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {product.sales_count} achat{product.sales_count > 1 ? "s" : ""} déjà effectué{product.sales_count > 1 ? "s" : ""}
              </div>
            )}

            {/* File info */}
            {product.file_path && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {product.file_size
                  ? `Téléchargement inclus (${(product.file_size / 1024 / 1024).toFixed(1)} Mo)`
                  : "Téléchargement inclus"}
              </div>
            )}

            {/* Checkout button (client component) */}
            <CheckoutButton
              productId={product.id}
              price={product.price}
              productTitle={product.title}
            />

            {/* Trust badges */}
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Paiement sécurisé Stripe
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Satisfait ou remboursé
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
