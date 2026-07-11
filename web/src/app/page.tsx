import Link from "next/link";
import { getTopItems, getCategories } from "@/lib/db";
import { SITE_NAME, SITE_TAGLINE, NAV_LINKS } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import StarRating from "@/components/StarRating";

export const revalidate = 3600;

export default async function HomePage() {
  const [topItems, categories] = await Promise.all([
    getTopItems(10),
    getCategories() as Promise<Array<{ id: number; name: string; slug: string; description: string | null; item_count: number }>>,
  ]);

  const categoryIcons: Record<string, string> = {
    "accessoires-bureau": "🖥️",
    "eclairage-bureau": "💡",
    "confort-bureau": "🤲",
    "sieges-bureau": "🪑",
    "supports-ecran": "📺",
    "rangement-bureau": "🗂️",
    "mobilier-bureau": "🪵",
    "high-tech-bureau": "🔌",
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {SITE_TAGLINE}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Découvrez les meilleurs accessoires de bureau ergonomiques. Comparatifs, avis vérifiés et prix actualisés pour votre confort au quotidien.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/categorie/accessoires-bureau"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Voir les accessoires
              </Link>
              <Link
                href="/categorie/sieges-bureau"
                className="px-6 py-3 bg-blue-500/20 text-white font-semibold rounded-lg hover:bg-blue-500/30 border border-blue-400/30 transition-colors"
              >
                Voir les chaises
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="text-2xl mb-2">{categoryIcons[cat.slug] || "📦"}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {cat.item_count} produit{cat.item_count > 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Products */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⭐ Meilleurs produits</h2>
          <Link href="/categorie/accessoires-bureau?sort=rating_desc" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topItems.slice(0, 10).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi {SITE_NAME} ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comparaison objective</h3>
              <p className="text-sm text-gray-600">
                Nous analysons des centaines de produits pour ne retenir que les meilleurs, avec des critères transparents.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prix actualisés</h3>
              <p className="text-sm text-gray-600">
                Nos prix sont mis à jour régulièrement pour vous garantir les meilleures offres du moment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Avis vérifiés</h3>
              <p className="text-sm text-gray-600">
                Nous agrégeons les avis de vraies personnes pour vous aider à faire le bon choix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Newsletter */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Restez informé</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Recevez nos guides d&apos;achat, comparatifs et bons plans directement dans votre boîte mail. 1 email par semaine, désabonnement facile.
          </p>
          <form action="/api/subscribe" method="POST" className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>

      {/* Blog preview */}
      <section className="max-w-7xl mx-auto px-4 mt-16 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📝 Guides & Conseils</h2>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir le blog →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Comment choisir sa chaise de bureau ergonomique en 2026",
              excerpt: "Guide complet pour trouver la chaise idéale : support lombaire, accoudoirs réglables, matériaux respirants...",
              slug: "guide-choisir-chaise-bureau-ergonomique",
            },
            {
              title: "Les 10 accessoires indispensables pour le télétravail",
              excerpt: "Améliorez votre productivité et votre confort avec ces accessoires essentiels pour le travail à domicile.",
              slug: "accessoires-indispensables-teletravail",
            },
            {
              title: "Bureau assis-debout : avantages et comparatif 2026",
              excerpt: "Pourquoi et comment adopter le bureau assis-debout ? Analyse des bénéfices santé et productivité.",
              slug: "bureau-assis-debout-avantages-comparatif",
            },
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600">{post.excerpt}</p>
              <span className="text-blue-600 text-sm font-medium mt-3 inline-block">
                Lire la suite →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
