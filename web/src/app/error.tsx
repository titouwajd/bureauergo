"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">500</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur serveur</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Une erreur inattendue s&apos;est produite. Veuillez réessayer ou revenir plus tard.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
