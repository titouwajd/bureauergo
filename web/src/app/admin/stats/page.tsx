"use client";

import { useEffect, useState, useCallback } from "react";

interface StatsData {
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
  topClickedProducts?: { id: number; title: string; clicks: number }[];
  searchFrequency?: { query: string; count: number }[];
  dailyClicks?: { date: string; count: number }[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur lors du chargement");
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

  const searchFrequency = stats.searchFrequency || [];
  const topClicked = stats.topClickedProducts || [];
  const dailyClicks = stats.dailyClicks || [];

  // Find max values for bar charts
  const maxSearchCount = Math.max(1, ...searchFrequency.map((s) => s.count));
  const maxClickCount = Math.max(1, ...topClicked.map((p) => p.clicks));
  const maxDailyCount = Math.max(1, ...dailyClicks.map((d) => d.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques avancées</h1>
        <p className="text-gray-500 mt-1">Analyse détaillée des performances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Produits", value: stats.totalItems },
          { label: "Actifs", value: stats.activeItems },
          { label: "Catégories", value: stats.totalCategories },
          { label: "Abonnés", value: stats.totalSubscribers },
          { label: "Clics", value: stats.totalClicks },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search Queries Frequency */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Fréquence des recherches
        </h2>
        {searchFrequency.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {searchFrequency.slice(0, 15).map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-32 text-sm text-gray-700 truncate flex-shrink-0">
                  {s.query || "(vide)"}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((s.count / maxSearchCount) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Clicked Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Produits les plus cliqués
        </h2>
        {topClicked.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {topClicked.slice(0, 10).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-sm text-gray-400 flex-shrink-0">
                  #{i + 1}
                </span>
                <span className="w-40 text-sm text-gray-700 truncate flex-shrink-0">
                  {p.title}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((p.clicks / maxClickCount) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">
                  {p.clicks}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Clicks Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Clics quotidiens
        </h2>
        {dailyClicks.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
        ) : (
          <div className="flex items-end gap-1 h-48">
            {dailyClicks.slice(-30).map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full"
                title={`${d.date}: ${d.count} clic(s)`}
              >
                <span className="text-xs text-gray-400 mb-1">{d.count}</span>
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors min-h-[2px]"
                  style={{
                    height: `${Math.max(
                      2,
                      Math.round((d.count / maxDailyCount) * 100)
                    )}%`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {dailyClicks.length > 0 && (
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{dailyClicks[0]?.date}</span>
            <span>{dailyClicks[dailyClicks.length - 1]?.date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
