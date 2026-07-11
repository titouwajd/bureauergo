"use client";

import { useEffect, useState, useCallback } from "react";
import { Item } from "@/types";

interface PaginatedResponse {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminItemsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    affiliate_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const pageSize = 15;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/items?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  async function toggleField(item: Item, field: "is_active" | "is_sponsored") {
    const newValue = item[field] === 1 ? 0 : 1;
    try {
      const res = await fetch("/api/admin/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: item.id, [field]: newValue }),
      });
      if (!res.ok) throw new Error("Erreur");
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, [field]: newValue } : i
          ),
        };
      });
    } catch {
      setSaveError("Erreur lors de la mise à jour");
    }
  }

  function openEdit(item: Item) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      description: item.description || "",
      price: item.price != null ? String(item.price) : "",
      affiliate_url: item.affiliate_url || "",
    });
    setSaveError("");
  }

  function closeEdit() {
    setEditingId(null);
    setSaveError("");
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    setSaveError("");
    try {
      const body: Record<string, unknown> = {
        id: editingId,
        title: editForm.title,
        description: editForm.description || null,
        affiliate_url: editForm.affiliate_url || null,
      };
      const priceNum = parseFloat(editForm.price);
      if (!isNaN(priceNum)) body.price = priceNum;

      const res = await fetch("/api/admin/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  title: editForm.title,
                  description: editForm.description || null,
                  price: isNaN(parseFloat(editForm.price))
                    ? null
                    : parseFloat(editForm.price),
                  affiliate_url: editForm.affiliate_url || null,
                }
              : i
          ),
        };
      });
      closeEdit();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: Item) {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    try {
      const res = await fetch("/api/admin/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) throw new Error("Erreur");
      fetchItems();
    } catch {
      setSaveError("Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
        <p className="text-gray-500 mt-1">
          {data ? `${data.total} produit(s)` : "Chargement..."}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher un produit..."
          className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Rechercher
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="text-gray-500 hover:text-gray-700 text-sm px-3"
          >
            Effacer
          </button>
        )}
      </form>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {saveError}
          <button onClick={() => setSaveError("")} className="ml-2 underline">
            Fermer
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier le produit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Affiliation
                </label>
                <input
                  type="url"
                  value={editForm.affiliate_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, affiliate_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                  {saveError}
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
                  onClick={saveEdit}
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Titre</th>
                <th className="text-left px-4 py-3 font-medium">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium">Prix</th>
                <th className="text-left px-4 py-3 font-medium">Note</th>
                <th className="text-center px-4 py-3 font-medium">Actif</th>
                <th className="text-center px-4 py-3 font-medium">Sponsorisé</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : data && data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                data?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {(item as any).category_name || `#${item.category_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.price != null
                        ? `${item.price.toFixed(2)} ${item.currency}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.rating != null ? `${item.rating}/5` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(item, "is_active")}
                        className={`inline-block w-10 h-5 rounded-full transition-colors relative ${
                          item.is_active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            item.is_active ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleField(item, "is_sponsored")}
                        className={`inline-block w-10 h-5 rounded-full transition-colors relative ${
                          item.is_sponsored ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            item.is_sponsored
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {data.page} sur {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                ← Précédent
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
