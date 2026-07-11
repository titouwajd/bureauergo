"use client";

import { useEffect, useState, useCallback } from "react";

interface ScrapeLog {
  id: number;
  source: string;
  status: string;
  items_scraped: number;
  items_new: number;
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
}

export default function AdminScraperPage() {
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scraper", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : data.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function triggerScrape() {
    setScraping(true);
    setScrapeMsg("");
    setError("");
    try {
      const res = await fetch("/api/admin/scraper", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setScrapeMsg(data.message || "Scraping lancé avec succès !");
      } else {
        setError(data.error || "Erreur lors du lancement");
      }
      // Refresh logs
      await fetchLogs();
    } catch {
      setError("Erreur réseau");
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scraper</h1>
          <p className="text-gray-500 mt-1">Gestion du scraping de produits</p>
        </div>
        <button
          onClick={triggerScrape}
          disabled={scraping}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {scraping ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Scraping en cours...
            </span>
          ) : (
            "🕷️ Lancer le scraping"
          )}
        </button>
      </div>

      {scrapeMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {scrapeMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Historique des scrapings
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Source</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-left px-4 py-3 font-medium">Scrapés</th>
                <th className="text-left px-4 py-3 font-medium">Nouveaux</th>
                <th className="text-left px-4 py-3 font-medium">Début</th>
                <th className="text-left px-4 py-3 font-medium">Fin</th>
                <th className="text-left px-4 py-3 font-medium">Erreur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    Aucun scraping effectué
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{log.id}</td>
                    <td className="px-4 py-3 text-gray-900">{log.source}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : log.status === "running"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.items_scraped}</td>
                    <td className="px-4 py-3 text-gray-700">{log.items_new}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(log.started_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {log.finished_at
                        ? new Date(log.finished_at).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-red-600 max-w-[200px] truncate">
                      {log.error_message || "—"}
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
