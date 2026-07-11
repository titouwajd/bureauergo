import Link from "next/link";
import { ItemRow } from "@/lib/db";
import StarRating from "./StarRating";

interface Props {
  item: ItemRow;
}

export default function ItemCard({ item }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      <Link href={`/item/${item.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {item.image_path ? (
            <img
              src={item.image_path}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {item.is_sponsored === 1 && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Sponsorisé
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{item.category_name}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* Rating */}
          {item.rating && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={item.rating} size="sm" />
              <span className="text-xs text-gray-500">
                ({item.review_count.toLocaleString()})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            {item.price ? (
              <span className="text-lg font-bold text-gray-900">
                {item.price.toFixed(2)}€
              </span>
            ) : (
              <span className="text-sm text-gray-500">Prix non disponible</span>
            )}
            <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Voir l&apos;offre →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
