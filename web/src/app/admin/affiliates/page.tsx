"use client";

import { useEffect, useState, useCallback } from "react";

interface AffiliateItem {
  id: number;
  title: string;
  affiliate_url: string | null;
  total_clicks: number;
}

export default function AdminAffiliatesPage() {
  const [items, setItems] = useState<AffiliateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchAffiliates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/affiliates", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  function openEdit(item: AffiliateItem) {
    setEditingId(item.id);
    setEditUrl(item.affiliate_url || "");
    setSaveMsg("");
  }

  function closeEdit() {
    setEditingId(null);
    setSaveMsg("");
  }

  async function saveUrl() {
    if (!editingId) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: editingId, affiliate_url: editUrl || null }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setSaveMsg("URL mise à jour !");
      // Update local state
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId ? { ...it, affiliate_url: editUrl || null } : it
        )
      );
      setTimeout(closeEdit, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  const totalClicks = items.reduce((sum, it) => sum + it.total_clicks, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Affiliation</h1>
        <p className="text-gray-500 mt-1">
          Gestion des liens affiliés — {totalClicks} clics au total
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">
            Fermer
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier l&apos;URL d&apos;affiliation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Affiliation
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://amazon.fr/..."
                />
              </div>
              {saveMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
                  {saveMsg}
                </div>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveUrl}
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Produits et liens affiliés
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-4 py-3 font-medium">URL Affiliation</th>
                <th className="text-center px-4 py-3 font-medium">Clics</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Aucun produit avec lien affilié
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 max-w-[300px] truncate">
                      {item.affiliate_url ? (
                        <a
                          href={item.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {item.affiliate_url}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {item.total_clicks}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Modifier l&apos;URL
                      </button>
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
