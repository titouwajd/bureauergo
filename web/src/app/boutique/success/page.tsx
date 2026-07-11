"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [customer, setCustomer] = useState<{ id: number; email: string; name: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("not authenticated");
      })
      .then((data) => setCustomer(data.customer))
      .catch(() => setCustomer(null))
      .finally(() => setChecked(true));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Green checkmark */}
      <div className="mb-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Paiement confirmé !
      </h1>

      <p className="text-lg text-gray-600 mb-2">
        Merci pour votre achat.
      </p>

      <p className="text-gray-600 mb-8">
        Votre produit sera disponible dans votre espace client.
      </p>

      {sessionId && (
        <p className="text-xs text-gray-400 mb-8">
          Référence de session : {sessionId}
        </p>
      )}

      {!checked ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customer ? (
        <div className="space-y-3">
          <Link
            href="/customer/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Accéder à mes commandes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-3">
            Connectez-vous pour accéder à vos achats.
          </p>
          <Link
            href="/customer/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Se connecter
          </Link>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/boutique"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement confirmé !
          </h1>
          <div className="flex justify-center mt-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
