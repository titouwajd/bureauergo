import Link from "next/link";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description: `Guides, comparatifs et conseils pour votre confort au bureau. ${SITE_NAME} vous aide à choisir le bon équipement.`,
};

export default function BlogPage() {
  const posts = [
    {
      title: "Comment choisir sa chaise de bureau ergonomique en 2026",
      excerpt: "Guide complet pour trouver la chaise idéale : support lombaire, accoudoirs réglables, matériaux respirants et budget.",
      date: "2026-06-15",
      slug: "guide-choisir-chaise-bureau-ergonomique",
      category: "Sièges",
      readTime: "8 min",
    },
    {
      title: "Les 10 accessoires indispensables pour le télétravail",
      excerpt: "Améliorez votre productivité et votre confort avec ces accessoires essentiels pour le travail à domicile.",
      date: "2026-05-28",
      slug: "accessoires-indispensables-teletravail",
      category: "Accessoires",
      readTime: "6 min",
    },
    {
      title: "Bureau assis-debout : avantages, inconvénients et comparatif 2026",
      excerpt: "Pourquoi et comment adopter le bureau assis-debout ? Analyse des bénéfices santé et productivité.",
      date: "2026-05-10",
      slug: "bureau-assis-debout-avantages-comparatif",
      category: "Mobilier",
      readTime: "10 min",
    },
    {
      title: "Éclairage de bureau : comment éviter la fatigue oculaire",
      excerpt: "Le bon éclairage est essentiel pour votre santé visuelle. Découvrez les lampes les mieux notées.",
      date: "2026-04-22",
      slug: "eclairage-bureau-fatigue-oculaire",
      category: "Éclairage",
      readTime: "5 min",
    },
    {
      title: "5 exercices pour soulager le mal de dos au bureau",
      excerpt: "Des étirements simples à faire à votre poste de travail pour prévenir les douleurs lombaires.",
      date: "2026-04-05",
      slug: "exercices-soulager-mal-de-dos-bureau",
      category: "Bien-être",
      readTime: "7 min",
    },
    {
      title: "Guide : organiser son bureau pour maximiser sa productivité",
      excerpt: "Rangement, organisation des câbles, supports écran : tous nos conseils pour un espace de travail optimisé.",
      date: "2026-03-18",
      slug: "organiser-bureau-maximiser-productivite",
      category: "Rangement",
      readTime: "9 min",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Guides</h1>
        <p className="text-lg text-gray-600">
          Conseils, comparatifs et astuces pour votre confort au travail et votre productivité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Lire →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
