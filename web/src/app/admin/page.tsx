"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface DashboardStats {
  totalItems: number;
  activeItems: number;
  totalCategories: number;
  totalSubscribers: number;
  totalClicks: number;
  recentSearches: { query: string; results_count: number; searched_at: string }[];
  recentScrapes: {
    id: number;
    source: string;
    status: string;
    items_scraped: number;
    items_new: number;
    started_at: string;
    finished_at: string | null;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scraping, setScraping] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur lors du chargement des statistiques");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function triggerScraper() {
    setScraping(true);
    try {
      await fetch("/api/admin/scraper", {
        method: "POST",
        credentials: "include",
      });
      // Refresh stats after scraping
      await fetchStats();
    } catch {
      // Ignore
    } finally {
      setScraping(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Produits", value: stats.totalItems, sub: `${stats.activeItems} actifs` },
    { label: "Catégories", value: stats.totalCategories },
    { label: "Abonnés", value: stats.totalSubscribers },
    { label: "Clics affiliés", value: stats.totalClicks },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de votre site</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            {card.sub && <p className="text-xs text-gray-400 mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={triggerScraper}
          disabled={scraping}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {scraping ? "Scraping en cours..." : "🕷️ Lancer le scraper"}
        </button>
        <Link
          href="/admin/items"
          className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          📦 Voir les produits
        </Link>
      </div>

      {/* Recent Searches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recherches récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Requête</th>
                <th className="text-left px-6 py-3 font-medium">Résultats</th>
                <th className="text-left px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentSearches.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Aucune recherche récente
                  </td>
                </tr>
              ) : (
                stats.recentSearches.slice(0, 20).map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{s.query}</td>
                    <td className="px-6 py-3 text-gray-500">{s.results_count}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(s.searched_at).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Scrapes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Scrapings récents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Source</th>
                <th className="text-left px-6 py-3 font-medium">Statut</th>
                <th className="text-left px-6 py-3 font-medium">Scrapés</th>
                <th className="text-left px-6 py-3 font-medium">Nouveaux</th>
                <th className="text-left px-6 py-3 font-medium">Début</th>
                <th className="text-left px-6 py-3 font-medium">Fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentScrapes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Aucun scraping récent
                  </td>
                </tr>
              ) : (
                stats.recentScrapes.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{s.source}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : s.status === "running"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{s.items_scraped}</td>
                    <td className="px-6 py-3 text-gray-500">{s.items_new}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(s.started_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {s.finished_at
                        ? new Date(s.finished_at).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
