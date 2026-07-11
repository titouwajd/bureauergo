"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";

interface Props {
  categories: Array<{ id: number; name: string; slug: string; item_count: number }>;
  currentCategory: string;
  currentSort: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentMinRating?: number;
}

export default function FilterSidebar({
  categories,
  currentCategory,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
  currentMinRating,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/categorie/${currentCategory}?${params.toString()}`);
  };

  const priceRanges = [
    { label: "Moins de 20€", min: "", max: "20" },
    { label: "20€ - 50€", min: "20", max: "50" },
    { label: "50€ - 100€", min: "50", max: "100" },
    { label: "100€ - 200€", min: "100", max: "200" },
    { label: "Plus de 200€", min: "200", max: "" },
  ];

  const ratingOptions = [
    { label: "4★ et plus", value: "4" },
    { label: "4.5★ et plus", value: "4.5" },
  ];

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <a
                href={`/categorie/${cat.slug}`}
                className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                  cat.slug === currentCategory
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
                <span className="text-gray-400 ml-1.5">({cat.item_count})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
        <ul className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateFilter("sort", opt.value)}
                className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                  currentSort === opt.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
        <ul className="space-y-1">
          {priceRanges.map((range) => {
            const isActive =
              (range.min === "" ? !currentMinPrice : String(currentMinPrice) === range.min) &&
              (range.max === "" ? !currentMaxPrice : String(currentMaxPrice) === range.max);
            return (
              <li key={range.label}>
                <button
                  onClick={() => {
                    updateFilter("minPrice", range.min);
                    updateFilter("maxPrice", range.max);
                  }}
                  className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {range.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Note minimum</h3>
        <ul className="space-y-1">
          {ratingOptions.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateFilter("minRating", currentMinRating === Number(opt.value) ? "" : opt.value)}
                className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                  currentMinRating === Number(opt.value)
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      {(currentMinPrice || currentMaxPrice || currentMinRating || currentSort !== "rating_desc") && (
        <button
          onClick={() => router.push(`/categorie/${currentCategory}`)}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          ✕ Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
