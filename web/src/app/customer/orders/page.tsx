"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OrderRow, OrderItemRow } from "@/types";

interface OrderWithItems extends OrderRow {
  items?: (OrderItemRow & { downloadToken?: string })[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check auth and fetch orders
    fetch("/api/customer/orders", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/customer/login?redirect=/customer/orders");
          return null;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur lors du chargement des commandes");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setOrders(data.orders || []);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Chargement de vos commandes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4">
          <p className="font-medium">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return { label: "Complétée", className: "bg-green-100 text-green-700" };
      case "pending":
        return { label: "En attente", className: "bg-yellow-100 text-yellow-700" };
      case "cancelled":
        return { label: "Annulée", className: "bg-red-100 text-red-700" };
      case "refunded":
        return { label: "Remboursée", className: "bg-gray-100 text-gray-700" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes commandes</h1>
      <p className="text-gray-600 mb-8">
        Retrouvez tous vos achats et téléchargements.
      </p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-lg mb-2">Aucune commande</p>
          <p className="text-gray-400 text-sm mb-6">
            Vous n&apos;avez pas encore passé de commande.
          </p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusLabel(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Order header */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      Commande #{order.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-medium text-gray-900">
                      {order.total.toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div className="px-6 py-4">
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product_title || `Produit #${item.product_id}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qté: {item.quantity} × {item.unit_price.toFixed(2)}€
                            </p>
                          </div>
                          <div>
                            {order.status === "completed" && item.downloadToken ? (
                              <a
                                href={`/api/download/${item.downloadToken}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                              >
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
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                Télécharger
                              </a>
                            ) : order.status === "completed" ? (
                              <span className="text-xs text-gray-400">
                                Téléchargement indisponible
                              </span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
