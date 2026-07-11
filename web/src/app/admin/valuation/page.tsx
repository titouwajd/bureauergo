"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────

interface RevenueEntry {
  id?: number;
  source: "affiliation" | "shop" | "adsense";
  amount: number;
  description: string;
}

interface RevenueSummary {
  source: string;
  total: number;
}

interface TrafficData {
  monthlyVisitors: number;
  domainAge: number;
  backlinks: number;
  articles: number;
}

interface ValuationReport {
  generatedAt: string;
  siteName: string;
  domain: string;
  revenue: {
    monthlyAffiliation: number;
    monthlyShop: number;
    monthlyAdsense: number;
    monthlyTotal: number;
    bySource: RevenueSummary[];
  };
  traffic: TrafficData;
  valuation: {
    multiple: number;
    estimatedValue: number;
    rangeLow: number;
    rangeHigh: number;
  };
  metrics: {
    totalCustomers: number;
    totalOrders: number;
    monthlyRevenue: number;
  };
}

const REVENUE_SOURCES: { value: RevenueEntry["source"]; label: string; icon: string }[] = [
  { value: "affiliation", label: "Affiliation", icon: "🔗" },
  { value: "shop", label: "Boutique", icon: "🛒" },
  { value: "adsense", label: "Publicité", icon: "📢" },
];

const TRAFFIC_STORAGE_KEY = "bureauergo_traffic_data";

function loadTrafficFromStorage(): TrafficData {
  if (typeof window === "undefined") return { monthlyVisitors: 0, domainAge: 0, backlinks: 0, articles: 0 };
  try {
    const raw = localStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { monthlyVisitors: 0, domainAge: 0, backlinks: 0, articles: 0 };
}

function saveTrafficToStorage(data: TrafficData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

// ─── Multiple calculator ────────────────────────────────────────

function computeMultiple(visitors: number): number {
  if (visitors >= 20000) return 35;
  if (visitors >= 5000) return 30;
  if (visitors >= 1000) return 25;
  return 20;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Page ───────────────────────────────────────────────────────

export default function ValuationPage() {
  // Revenue state
  const [revenueForm, setRevenueForm] = useState<RevenueEntry>({
    source: "affiliation",
    amount: 0,
    description: "",
  });
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [savingRevenue, setSavingRevenue] = useState(false);
  const [revenueError, setRevenueError] = useState("");
  const [revenueOk, setRevenueOk] = useState("");

  // Traffic state
  const [traffic, setTraffic] = useState<TrafficData>(loadTrafficFromStorage);

  // Export state
  const [exporting, setExporting] = useState(false);

  // ─── Fetch revenue summary ────────────────────────────────────

  const fetchRevenueSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/revenue", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setRevenueSummary(data.summary || []);
      setMonthlyRevenue(data.monthlyRevenue || 0);
      setTotalCustomers(data.totalCustomers || 0);
      setTotalOrders(data.totalOrders || 0);
    } catch {
      // Silently fail — the dashboard still works with local state
    }
  }, []);

  useEffect(() => {
    fetchRevenueSummary();
  }, [fetchRevenueSummary]);

  // ─── Persist traffic ──────────────────────────────────────────

  useEffect(() => {
    saveTrafficToStorage(traffic);
  }, [traffic]);

  // ─── Add revenue entry ────────────────────────────────────────

  async function handleAddRevenue() {
    if (revenueForm.amount <= 0) {
      setRevenueError("Le montant doit être supérieur à 0.");
      return;
    }
    setRevenueError("");
    setRevenueOk("");
    setSavingRevenue(true);
    try {
      const res = await fetch("/api/admin/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          source: revenueForm.source,
          amount: revenueForm.amount,
          description: revenueForm.description || undefined,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      setRevenueEntries((prev) => [
        { ...revenueForm, id: Date.now() },
        ...prev,
      ]);
      setRevenueForm({ source: "affiliation", amount: 0, description: "" });
      setRevenueOk("Revenu enregistré !");
      await fetchRevenueSummary();
    } catch {
      setRevenueError("Impossible d'enregistrer le revenu.");
    } finally {
      setSavingRevenue(false);
    }
  }

  // ─── Computed values ──────────────────────────────────────────

  const bySourceTotal = (src: string) => {
    const row = revenueSummary.find((r) => r.source === src);
    return row ? row.total : 0;
  };

  const totalRevenue = revenueSummary.reduce((acc, r) => acc + r.total, 0);
  const multiple = computeMultiple(traffic.monthlyVisitors);
  const estimatedValue = totalRevenue * multiple;
  const rangeLow = Math.round(estimatedValue * 0.85);
  const rangeHigh = Math.round(estimatedValue * 1.15);

  // ─── Export ───────────────────────────────────────────────────

  function handleExport() {
    setExporting(true);
    const report: ValuationReport = {
      generatedAt: new Date().toISOString(),
      siteName: "BureauErgo",
      domain: "bureauergo.fr",
      revenue: {
        monthlyAffiliation: bySourceTotal("affiliation"),
        monthlyShop: bySourceTotal("shop"),
        monthlyAdsense: bySourceTotal("adsense"),
        monthlyTotal: totalRevenue,
        bySource: revenueSummary,
      },
      traffic,
      valuation: {
        multiple,
        estimatedValue,
        rangeLow,
        rangeHigh,
      },
      metrics: {
        totalCustomers,
        totalOrders,
        monthlyRevenue,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bureauergo-dossier-vente-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setExporting(false), 500);
  }

  // ─── UI ───────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Valorisation du site</h1>
        <p className="text-gray-500 mt-1">
          Estimez la valeur de votre site et préparez un dossier de vente
        </p>
      </div>

      {/* ═══════ Section 1 — Revenus ═══════ */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">💰 Revenus</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Revenue form */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Enregistrer un revenu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Source */}
              <select
                value={revenueForm.source}
                onChange={(e) =>
                  setRevenueForm({ ...revenueForm, source: e.target.value as RevenueEntry["source"] })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {REVENUE_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
              {/* Amount */}
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Montant (€)"
                value={revenueForm.amount || ""}
                onChange={(e) =>
                  setRevenueForm({ ...revenueForm, amount: parseFloat(e.target.value) || 0 })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {/* Description */}
              <input
                type="text"
                placeholder="Description (optionnel)"
                value={revenueForm.description}
                onChange={(e) =>
                  setRevenueForm({ ...revenueForm, description: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {/* Button */}
              <button
                onClick={handleAddRevenue}
                disabled={savingRevenue}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savingRevenue ? "Enregistrement…" : "➕ Ajouter"}
              </button>
            </div>
            {revenueError && (
              <p className="text-red-600 text-xs mt-2">{revenueError}</p>
            )}
            {revenueOk && (
              <p className="text-green-600 text-xs mt-2">{revenueOk}</p>
            )}
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">Revenu affiliation</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatEUR(bySourceTotal("affiliation"))}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <p className="text-sm text-green-600 font-medium">Revenu boutique</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {formatEUR(bySourceTotal("shop"))}
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <p className="text-sm text-amber-600 font-medium">Revenu publicité</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {formatEUR(bySourceTotal("adsense"))}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              <p className="text-sm text-indigo-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                {formatEUR(totalRevenue)}
              </p>
            </div>
          </div>

          {/* Monthly revenue + metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Revenu boutique (30 jours)
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatEUR(monthlyRevenue)}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Clients</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Commandes</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{totalOrders}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 2 — Trafic ═══════ */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">📈 Trafic</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Saisissez les indicateurs de trafic de votre site. Ces valeurs sont sauvegardées
            localement dans votre navigateur.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trafic organique mensuel
              </label>
              <input
                type="number"
                min="0"
                placeholder="ex: 5000"
                value={traffic.monthlyVisitors || ""}
                onChange={(e) =>
                  setTraffic({ ...traffic, monthlyVisitors: parseInt(e.target.value) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Visiteurs uniques / mois</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge du domaine
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="ex: 2.5"
                value={traffic.domainAge || ""}
                onChange={(e) =>
                  setTraffic({ ...traffic, domainAge: parseFloat(e.target.value) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Années</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backlinks
              </label>
              <input
                type="number"
                min="0"
                placeholder="ex: 150"
                value={traffic.backlinks || ""}
                onChange={(e) =>
                  setTraffic({ ...traffic, backlinks: parseInt(e.target.value) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Nombre de liens entrants</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Articles publiés
              </label>
              <input
                type="number"
                min="0"
                placeholder="ex: 45"
                value={traffic.articles || ""}
                onChange={(e) =>
                  setTraffic({ ...traffic, articles: parseInt(e.target.value) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Articles et pages indexées</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 3 — Estimation ═══════ */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">💎 Estimation de la valeur</h2>
        </div>
        <div className="p-6">
          {totalRevenue === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">Aucun revenu enregistré</p>
              <p className="text-sm mt-1">
                Ajoutez des revenus dans la section « Revenus » pour obtenir une estimation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Multiple explanation */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  Multiple appliqué :{" "}
                  <span className="font-bold text-gray-900">{multiple}x</span>
                  {traffic.monthlyVisitors > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      (basé sur {traffic.monthlyVisitors.toLocaleString("fr-FR")} visiteurs/mois)
                    </span>
                  )}
                </p>
                <div className="mt-2 flex gap-1.5 text-xs text-gray-400">
                  <span className={`px-2 py-0.5 rounded ${multiple === 20 ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100"}`}>
                    &lt;1k → 20x
                  </span>
                  <span className={`px-2 py-0.5 rounded ${multiple === 25 ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100"}`}>
                    1k-5k → 25x
                  </span>
                  <span className={`px-2 py-0.5 rounded ${multiple === 30 ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100"}`}>
                    5k-20k → 30x
                  </span>
                  <span className={`px-2 py-0.5 rounded ${multiple === 35 ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100"}`}>
                    20k+ → 35x
                  </span>
                </div>
              </div>

              {/* Big value card */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 text-center">
                <p className="text-sm text-indigo-600 font-medium mb-1">
                  Revenu mensuel net : {formatEUR(totalRevenue)}
                </p>
                <p className="text-4xl font-bold text-indigo-900">
                  Valeur estimée : {formatEUR(estimatedValue)}
                </p>
                <p className="text-sm text-indigo-500 mt-1">
                  Multiple de {multiple}x
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Fourchette : {formatEUR(rangeLow)} – {formatEUR(rangeHigh)}
                </p>
                {/* Progress-like bar */}
                <div className="mt-3 bg-white rounded-full h-2 overflow-hidden border border-indigo-100">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (estimatedValue / (rangeHigh || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bas de fourchette</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatEUR(rangeLow)}</p>
                  <p className="text-xs text-gray-400">-15%</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Estimation médiane</p>
                  <p className="text-xl font-bold text-indigo-700 mt-1">{formatEUR(estimatedValue)}</p>
                  <p className="text-xs text-gray-400">{multiple}x le revenu mensuel</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Haut de fourchette</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatEUR(rangeHigh)}</p>
                  <p className="text-xs text-gray-400">+15%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ Section 4 — Export ═══════ */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">📦 Export du dossier de vente</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Générez un fichier JSON contenant toutes les données de valorisation (revenus, trafic,
            estimation). Le dossier complet (zip avec PDF) est préparé dans le répertoire{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">transfert/</code>.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
          >
            {exporting ? "📥 Export en cours…" : "📥 Exporter le dossier de vente"}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Format JSON — contient toutes les métriques et l&apos;estimation calculée.
          </p>
        </div>
      </section>
    </div>
  );
}
