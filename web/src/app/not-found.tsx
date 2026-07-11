import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page introuvable</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. Vérifiez l&apos;URL ou utilisez la recherche.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/categorie/accessoires-bureau"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voir les produits
        </Link>
      </div>
    </div>
  );
}
